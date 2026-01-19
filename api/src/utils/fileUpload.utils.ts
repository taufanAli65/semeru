import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { NODE_ENV } from '../config/index.config';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Local storage configuration
const uploadsDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user?.user_id;
        if (!userId) {
            return cb(new Error('User not authenticated'), '');
        }

        // Create user-specific directory
        const userDir = path.join(uploadsDir, userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow common document and image formats
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak didukung. Hanya JPG, PNG, PDF, DOC, DOCX, XLS, XLSX yang diperbolehkan.'));
    }
};

// Multer upload middleware
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

// Upload file to storage (local or Supabase)
export const uploadFileToStorage = async (
    file: Express.Multer.File,
    userId: string,
    semester: string,
    category: string
): Promise<string> => {
    if (NODE_ENV === 'production' && supabase) {
        // Upload to Supabase Storage
        return await uploadToSupabase(file, userId, semester, category);
    } else {
        // Upload to local storage
        return await uploadToLocal(file, userId, semester, category);
    }
};

// Upload to local storage
const uploadToLocal = async (
    file: Express.Multer.File,
    userId: string,
    semester: string,
    category: string
): Promise<string> => {
    const userDir = path.join(uploadsDir, userId);
    const semesterDir = path.join(userDir, semester);
    const categoryDir = path.join(semesterDir, category);

    // Create directories if they don't exist
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }

    // Move file to category directory
    const newFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const newPath = path.join(categoryDir, newFileName);

    fs.renameSync(file.path, newPath);

    // Return relative path for database storage
    return path.relative(uploadsDir, newPath).replace(/\\/g, '/');
};

// Upload to Supabase Storage
const uploadToSupabase = async (
    file: Express.Multer.File,
    userId: string,
    semester: string,
    category: string
): Promise<string> => {
    if (!supabase) {
        throw new Error('Supabase client not configured');
    }

    const bucketName = 'monev_files';
    const fileName = `${userId}/${semester}/${category}/${uuidv4()}${path.extname(file.originalname)}`;

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.path);

    // Upload to Supabase
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        throw new Error(`Gagal upload file ke Supabase: ${error.message}`);
    }

    // Clean up local temp file
    fs.unlinkSync(file.path);

    // Return Supabase public URL
    const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    return urlData.publicUrl;
};

// Delete file from storage
export const deleteFileFromStorage = async (fileUrl: string): Promise<void> => {
    if (NODE_ENV === 'production' && supabase && fileUrl.includes('supabase')) {
        // Delete from Supabase
        const bucketName = 'monev_files';
        const fileName = fileUrl.split('/').slice(-4).join('/'); // Extract path from URL

        const { error } = await supabase.storage
            .from(bucketName)
            .remove([fileName]);

        if (error) {
            console.error('Error deleting file from Supabase:', error);
        }
    } else {
        // Delete from local storage
        const filePath = path.join(uploadsDir, fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};
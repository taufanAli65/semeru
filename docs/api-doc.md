# Semeru API Documentation

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.2+-black.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2+-orange.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)

## Overview

Semeru API is a comprehensive REST API for the educational monitoring platform. It provides endpoints for user authentication, authorization, and monev (monitoring & evaluation) management. The API supports role-based access control with different permissions for students (Mahasiswa), mentors, administrators, and super administrators.

**Base URL:** `http://localhost:8000/api/v1` (development) / `https://your-domain.com/api/v1` (production)

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Health Check

#### GET /api/v1/health
Check if the API is running.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Authentication Endpoints

### 1. User Registration

**POST** `/api/v1/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "nim": "123456789",
  "nomor_whatsapp": "081234567890",
  "program_studi": "Teknik Informatika",
  "fakultas": "Teknik",
  "semester": "5",
  "universitas": "Universitas Indonesia"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pengguna berhasil didaftarkan",
  "data": {
    "user_id": "uuid-string",
    "email": "user@example.com",
    "role": "Mahasiswa",
    "information": {
      "name": "John Doe",
      "nim": "123456789",
      "nomor_whatsapp": "081234567890",
      "program_studi": "Teknik Informatika",
      "fakultas": "Teknik",
      "semester": "5",
      "universitas": "Universitas Indonesia",
      "status": "Active"
    }
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Pendaftaran gagal"
}
```

### 2. User Login

**POST** `/api/v1/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "user_id": "uuid-string",
      "email": "user@example.com",
      "role": "Mahasiswa",
      "information": {
        "name": "John Doe",
        "nim": "123456789",
        "nomor_whatsapp": "081234567890",
        "program_studi": "Teknik Informatika",
        "fakultas": "Teknik",
        "semester": "5",
        "universitas": "Universitas Indonesia",
        "status": "Active"
      }
    }
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Login gagal"
}
```

### 3. Get User by ID

**GET** `/api/v1/auth/user/:userId`

Get user information by user ID.

**Authorization:** Required (any authenticated user)

**URL Parameters:**
- `userId`: UUID of the user

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid-string",
    "email": "user@example.com",
    "role": "Mahasiswa",
    "information": {
      "name": "John Doe",
      "nim": "123456789",
      "nomor_whatsapp": "081234567890",
      "program_studi": "Teknik Informatika",
      "fakultas": "Teknik",
      "semester": "5",
      "universitas": "Universitas Indonesia",
      "status": "Active"
    }
  }
}
```

### 4. Update User Information

**PUT** `/api/v1/auth/user/info`

Update current user's information.

**Authorization:** Required (authenticated user)

**Request Body:**
```json
{
  "name": "Updated Name",
  "nomor_whatsapp": "081234567891"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Informasi pengguna berhasil diperbarui",
  "data": {
    "user_id": "uuid-string",
    "email": "user@example.com",
    "role": "Mahasiswa",
    "information": {
      "name": "Updated Name",
      "nim": "123456789",
      "nomor_whatsapp": "081234567891",
      "program_studi": "Teknik Informatika",
      "fakultas": "Teknik",
      "semester": "5",
      "universitas": "Universitas Indonesia",
      "status": "Active"
    }
  }
}
```

### 5. Get All Users

**GET** `/api/v1/auth/users`

Get all users (SuperAdmin only).

**Authorization:** Required (SuperAdmin only)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "uuid-string",
      "email": "user@example.com",
      "role": "Mahasiswa",
      "information": {
        "name": "John Doe",
        "nim": "123456789",
        "nomor_whatsapp": "081234567890",
        "program_studi": "Teknik Informatika",
        "fakultas": "Teknik",
        "semester": "5",
        "universitas": "Universitas Indonesia",
        "status": "Active"
      }
    }
  ]
}
```

### 6. Get Users by Role

**GET** `/api/v1/auth/users/role/:role`

Get users by role (SuperAdmin only).

**Authorization:** Required (SuperAdmin only)

**URL Parameters:**
- `role`: User role (SuperAdmin, Admin, Mahasiswa, Mentor)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "uuid-string",
      "email": "user@example.com",
      "role": "Mahasiswa",
      "information": {
        "name": "John Doe",
        "nim": "123456789",
        "nomor_whatsapp": "081234567890",
        "program_studi": "Teknik Informatika",
        "fakultas": "Teknik",
        "semester": "5",
        "universitas": "Universitas Indonesia",
        "status": "Active"
      }
    }
  ]
}
```

### 7. Change User Role

**PATCH** `/api/v1/auth/user/:userId/role`

Change user role (SuperAdmin only).

**Authorization:** Required (SuperAdmin only)

**URL Parameters:**
- `userId`: UUID of the user

**Request Body:**
```json
{
  "role": "Mentor"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Role pengguna berhasil diperbarui"
}
```

### 8. Delete User

**DELETE** `/api/v1/auth/user/:userId`

Delete user (SuperAdmin only).

**Authorization:** Required (SuperAdmin only)

**URL Parameters:**
- `userId`: UUID of the user to delete

**Response (200):**
```json
{
  "success": true,
  "message": "Pengguna berhasil dihapus"
}
```

---

## Monev (Monitoring & Evaluation) Endpoints

### Mentor Endpoints

#### 1. Assign Mentees to Mentor

**POST** `/api/v1/jejak/mentor/:mentorId/mentees`

Assign mentees to a mentor for a specific semester.

**Authorization:** Required (SuperAdmin, Admin, Mentor)

**URL Parameters:**
- `mentorId`: UUID of the mentor

**Request Body:**
```json
{
  "userIds": ["uuid1", "uuid2"],
  "semester": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Mahasiswa berhasil ditugaskan ke mentor"
}
```

#### 2. Get Mentee List

**GET** `/api/v1/jejak/mentor/:mentorId/mentees`

Get list of mentees for a mentor.

**Authorization:** Required (SuperAdmin, Admin, Mentor)

**URL Parameters:**
- `mentorId`: UUID of the mentor

**Query Parameters:**
- `semester` (optional): Semester number
- `status` (optional): "Complete" or "Incomplete"
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "user_id": "uuid-string",
        "period_id": "uuid-string"
      }
    ],
    "meta": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

#### 3. Approve/Reject Monev Record

**PATCH** `/api/v1/jejak/mentor/records/:record_id`

Approve or reject a monev record.

**Authorization:** Required (SuperAdmin, Admin, Mentor)

**URL Parameters:**
- `record_id`: UUID of the record

**Request Body:**
```json
{
  "status": "Verified",
  "notes": "Approved with minor corrections"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Record monev berhasil diperbarui"
}
```

#### 4. Get Monev Records by Period

**GET** `/api/v1/jejak/mentor/period/:period_id/records`

Get all monev records for a specific period.

**Authorization:** Required (SuperAdmin, Admin, Mentor)

**URL Parameters:**
- `period_id`: UUID of the period

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period_id": "uuid-string",
    "records": [
      {
        "record_id": "uuid-string",
        "category": "Prestasi",
        "title": "Juara Lomba Programming",
        "description": "Juara 1 lomba programming nasional",
        "file_url": "https://...",
        "status": "Verified",
        "reviewer_notes": "Approved",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### 5. Get Single Monev Record

**GET** `/api/v1/jejak/mentor/records/:record_id`

Get a specific monev record.

**Authorization:** Required (SuperAdmin, Admin, Mentor)

**URL Parameters:**
- `record_id`: UUID of the record

**Response (200):**
```json
{
  "success": true,
  "data": {
    "record_id": "uuid-string",
    "category": "Prestasi",
    "title": "Juara Lomba Programming",
    "description": "Juara 1 lomba programming nasional",
    "file_url": "https://...",
    "status": "Verified",
    "reviewer_notes": "Approved",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Mentee Endpoints

#### 1. Add Single Monev Record

**POST** `/api/v1/jejak/mentee/records`

Add a new monev record with file upload.

**Authorization:** Required (Mahasiswa only)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
- `file`: File to upload (image, PDF, document)
- `category`: MonevCategory enum value
- `title`: Record title
- `description` (optional): Record description
- `grade_value` (optional): Grade value (0-4)

**Response (201):**
```json
{
  "success": true,
  "message": "Record monev berhasil ditambahkan",
  "data": {
    "record_id": "uuid-string",
    "category": "Prestasi",
    "title": "Juara Lomba Programming",
    "description": "",
    "file_url": "https://...",
    "grade_value": null,
    "status": "Pending",
    "reviewer_notes": null,
    "verified_by": null,
    "verified_at": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Add Bulk Monev Records

**POST** `/api/v1/jejak/mentee/records/bulk`

Add multiple monev records with file uploads.

**Authorization:** Required (Mahasiswa only)

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
- `files`: Multiple files to upload
- `records`: JSON string of record data array

**Example records JSON:**
```json
[
  {
    "category": "Prestasi",
    "title": "Juara Lomba 1",
    "description": "Deskripsi lomba 1",
    "grade_value": 4
  },
  {
    "category": "Seminar",
    "title": "Peserta Seminar AI",
    "description": "Seminar kecerdasan buatan"
  }
]
```

**Response (201):**
```json
{
  "success": true,
  "message": "2 record monev berhasil ditambahkan",
  "data": [
    {
      "record_id": "uuid-string",
      "category": "Prestasi",
      "title": "Juara Lomba 1",
      "description": "Deskripsi lomba 1",
      "file_url": "https://...",
      "grade_value": 4,
      "status": "Pending",
      "reviewer_notes": null,
      "verified_by": null,
      "verified_at": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Get Current Period Records

**GET** `/api/v1/jejak/mentee/records/current`

Get monev records for current semester.

**Authorization:** Required (Mahasiswa only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period_id": "uuid-string",
    "semester": 5,
    "status": "Incomplete",
    "records": [
      {
        "record_id": "uuid-string",
        "category": "Prestasi",
        "title": "Juara Lomba Programming",
        "description": "Juara 1 lomba programming nasional",
        "file_url": "https://...",
        "grade_value": null,
        "status": "Pending",
        "reviewer_notes": null,
        "verified_by": null,
        "verified_at": null,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### 4. Update Monev Record

**PATCH** `/api/v1/jejak/mentee/records/:record_id`

Update a monev record (optional file upload).

**Authorization:** Required (Mahasiswa only)

**URL Parameters:**
- `record_id`: UUID of the record

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
- `file` (optional): New file to upload
- `title` (optional): Updated title
- `description` (optional): Updated description
- `grade_value` (optional): Updated grade value

**Response (200):**
```json
{
  "success": true,
  "message": "Record monev berhasil diperbarui",
  "data": {
    "record_id": "uuid-string",
    "category": "Prestasi",
    "title": "Updated Title",
    "description": "Updated description",
    "file_url": "https://...",
    "grade_value": 4,
    "status": "Pending",
    "reviewer_notes": null,
    "verified_by": null,
    "verified_at": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 5. Delete Monev Record

**DELETE** `/api/v1/jejak/mentee/records/:record_id`

Delete a monev record.

**Authorization:** Required (Mahasiswa only)

**URL Parameters:**
- `record_id`: UUID of the record

**Response (200):**
```json
{
  "success": true,
  "message": "Record monev berhasil dihapus"
}
```

#### 6. Get Past Records

**GET** `/api/v1/jejak/mentee/records/past`

Get monev records from past semesters.

**Authorization:** Required (Mahasiswa only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "periods": [
      {
        "period_id": "uuid-string",
        "semester": 4,
        "status": "Complete",
        "general_feedback": "Good progress",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "records": [
          {
            "record_id": "uuid-string",
            "category": "Prestasi",
            "title": "Juara Lomba Programming",
            "description": "Juara 1 lomba programming nasional",
            "file_url": "https://...",
            "grade_value": null,
            "status": "Verified",
            "reviewer_notes": "Approved",
            "verified_by": "uuid-string",
            "verified_at": "2024-01-01T00:00:00.000Z",
            "created_at": "2024-01-01T00:00:00.000Z",
            "updated_at": "2024-01-01T00:00:00.000Z"
          }
        ]
      }
    ]
  }
}
```

---

## Data Types

### MonevCategory Enum
- `Prestasi` - Achievements/Competitions
- `Seminar` - Seminar participation
- `Kepemimpinan` - Leadership roles
- `Pelatihan` - Training/Workshops
- `Akademik` - Academic performance
- `Publikasi` - Publications
- `Kecendekiawanan` - Social activities

### RecordStatus Enum
- `Pending` - Awaiting review
- `Verified` - Approved
- `Fail` - Rejected

### PeriodStatus Enum
- `Incomplete` - Missing required records
- `Complete` - All requirements met

### UserRole Enum
- `SuperAdmin` - Full system access
- `Admin` - Administrative access
- `Mahasiswa` - Student access
- `Mentor` - Mentor access

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description in Indonesian"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## File Upload

### Development Environment
Files are stored locally in the `uploads/` directory with the following structure:
```
uploads/{user_id}/{semester}/{category}/{filename}
```

### Production Environment
Files are uploaded to Supabase Storage in the `monev_files` bucket with the same directory structure.

### Supported File Types
- Images: JPG, PNG, JPEG
- Documents: PDF, DOC, DOCX
- Spreadsheets: XLS, XLSX

### File Size Limit
- Maximum file size: 10MB per file
- Bulk upload: Maximum 50 files per request

---

## Rate Limiting

The API implements rate limiting to protect against abuse:
- Basic rate limiting applied to all endpoints
- Configurable limits based on endpoint sensitivity

---

## Security Features

- JWT authentication with configurable expiration
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Helmet.js for security headers
- CORS configuration
- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM

---

## Environment Variables

### Required Environment Variables
```
NODE_ENV=development|production
PORT=8000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Production Only
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation
```bash
cd api
npm install
```

### Database Setup
```bash
# Generate Prisma client
npm run build

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### Running the API
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Testing
```bash
npm test
```

---

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add validation for all inputs
5. Update documentation for new endpoints
6. Test thoroughly before submitting PR

---

## License

This project is licensed under the ISC License.
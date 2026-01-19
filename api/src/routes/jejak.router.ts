import express from 'express';
import { userRole } from '@prisma/client';
import { assignMenteesController, getMenteeListController, approveMenteeProgressController, listMonevRecordsController, getMonevRecordController } from '../controllers/jejak/mentor.controller';
import { addMonevRecordController, addBulkMonevRecordsController, getCurrentPeriodRecordsController, updateMonevRecordController, deleteMonevRecordController, getPastRecordsController } from '../controllers/jejak/mentee.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { upload } from '../utils/fileUpload.utils';

const router = express.Router();

// Grouped under /mentor
router.post('/mentor/:mentorId/mentees', authenticate,authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor),assignMenteesController,);
router.get('/mentor/:mentorId/mentees',authenticate,authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor),getMenteeListController,);
router.patch('/mentor/records/:record_id', authenticate, authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor), approveMenteeProgressController,);
router.get('/mentor/period/:period_id/records', authenticate, authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor), listMonevRecordsController,);
router.get('/mentor/records/:record_id', authenticate, authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor), getMonevRecordController,);

// Grouped under /mentee
router.post('/mentee/records', authenticate, authorize(userRole.Mahasiswa), upload.single('file'), addMonevRecordController);
router.post('/mentee/records/bulk', authenticate, authorize(userRole.Mahasiswa), upload.array('files', 50), addBulkMonevRecordsController);
router.get('/mentee/records/current', authenticate, authorize(userRole.Mahasiswa), getCurrentPeriodRecordsController);
router.patch('/mentee/records/:record_id', authenticate, authorize(userRole.Mahasiswa), upload.single('file'), updateMonevRecordController);
router.delete('/mentee/records/:record_id', authenticate, authorize(userRole.Mahasiswa), deleteMonevRecordController);
router.get('/mentee/records/past', authenticate, authorize(userRole.Mahasiswa), getPastRecordsController);

export default router;
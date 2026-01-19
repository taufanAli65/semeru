import express from 'express';
import { userRole } from '@prisma/client';
import { assignMenteesController, getMenteeListController, approveMenteeProgressController, listMonevRecordsController, getMonevRecordController } from '../controllers/jejak/mentor.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = express.Router();

// Grouped under /mentor
router.post('/mentor/:mentorId/mentees', authenticate,authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor),assignMenteesController,);
router.get('/mentor/:mentorId/mentees',authenticate,authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor),getMenteeListController,);
router.patch('/mentor/records/:record_id', authenticate, authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor), approveMenteeProgressController,);
router.get('/mentor/period/:period_id/records', authenticate, authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor), listMonevRecordsController,);
router.get('/mentor/records/:record_id', authenticate, authorize(userRole.SuperAdmin, userRole.Admin, userRole.Mentor), getMonevRecordController,);

export default router;
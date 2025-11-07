import { Router } from "express";
import { getNotifications, markAllNotificationsAsRead, markAsRead } from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.post('/mark-all-read', markAllNotificationsAsRead);
router.patch('/:id/read', markAsRead);

export default router;
import { Router } from "express";
import { UserRole } from "../types";
import { approveVisitor, cancelVisitor, checkInVisitor, checkOutVisitor, createVisitor, getvisitorById, getVisitors, updateVisitor } from "../controllers/visitor.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router
    .route('/')
    .get(getVisitors)
    .post(
        authorize(UserRole.RECEPTIONIST, UserRole.EMPLOYEE, UserRole.ADMIN),
        createVisitor
    );

router
    .route('/:id')
    .get(getvisitorById)
    .patch(authorize(UserRole.RECEPTIONIST, UserRole.ADMIN), updateVisitor);

router.post('/:id/check-in', authorize(UserRole.RECEPTIONIST), checkInVisitor);
router.post('/:id/check-out', authorize(UserRole.RECEPTIONIST), checkOutVisitor);

router.post('/:id/cancel', cancelVisitor);

router.post('/:id/approve', authorize(UserRole.EMPLOYEE, UserRole.ADMIN), approveVisitor);

export default router;
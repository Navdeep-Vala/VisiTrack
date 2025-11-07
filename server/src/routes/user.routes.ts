import { Router } from "express";
import { UserRole } from "../types";
import { deleteUser, getUserById, getUsers, searchEmployees, updateUser } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get('/search/employees', searchEmployees);

router.get('/', authorize(UserRole.ADMIN), getUsers);

router
    .route('/:id')
    .get(getUserById)
    .patch(authorize(UserRole.ADMIN), updateUser)
    .delete(authorize(UserRole.ADMIN), deleteUser);

export default router;
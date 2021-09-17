import { Router } from "express";
const router = Router();

import * as usersController from '../controllers/users.controller';

router.post('/signIn', usersController.signIn);
router.post('/signUp', usersController.signUp);
//router.delete('/:id', usersController.deleteTicketById);

export default router;
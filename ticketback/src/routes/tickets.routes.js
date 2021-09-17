import { Router } from "express";
const router = Router();

import { verifyToken, isAdmin } from "../middlewares/auth";
import * as ticketsController from '../controllers/tickets.controller';

router.get('/', [verifyToken, isAdmin], ticketsController.getTickets);
router.post('/', verifyToken, ticketsController.createTicket);
router.get('/user', verifyToken, ticketsController.getTicketByUserId);
router.get('/:id', verifyToken, ticketsController.getTicketByTicketId);
router.delete('/:id',[verifyToken, isAdmin], ticketsController.deleteTicketById);

export default router;
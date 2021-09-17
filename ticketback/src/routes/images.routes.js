import { Router } from "express";
import processFile from "../middlewares/upload";
import { verifyToken } from "../middlewares/auth";
import * as imagesController from '../controllers/images.controller';

const router = Router();

router.post('/', [verifyToken, processFile], imagesController.uploadFiles);
router.get('/:id', verifyToken, imagesController.getUrlByTicketId);
router.delete('/:id', verifyToken, imagesController.deleteUrlByImageId);

export default router;
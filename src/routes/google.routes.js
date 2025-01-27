import { Router } from "express";
import { googleDecode } from "../controllers/google.controller.js";

const router = Router();

router.post('/google', googleDecode);

export default router;
import { Router } from "express";
import { getSongs, getSongById, createSong, updateSong, deleteSong } from "../controllers/songs.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = Router();

router.get('/songs', getSongs);
router.get('/songs/:id', getSongById);
router.post('/songs', [authJwt.verifyToken, authJwt.isAdmin], createSong);
router.patch('/songs/:id', [authJwt.verifyToken, authJwt.isAdmin], updateSong);
router.delete('/songs/:id', [authJwt.verifyToken, authJwt.isAdmin], deleteSong);

export default router;
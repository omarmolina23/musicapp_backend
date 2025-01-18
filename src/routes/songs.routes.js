import { Router } from "express";
import { getSongs, getSongById, createSong, updateSong, deleteSong } from "../controllers/songs.controller.js";

const router = Router();

router.get('/songs', getSongs);
router.get('/songs/:id', getSongById);
router.post('/songs', createSong);
router.patch('/songs/:id', updateSong);
router.delete('/songs/:id', deleteSong);

export default router;
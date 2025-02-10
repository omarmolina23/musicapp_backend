import { pool } from "../db.js";
import fs from "fs";

import { uploadFile, getFileUrl } from "../../s3.js";

export const getSongs = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM songs");

        // Obtener la URL de la canción y del cover para cada canción
        const songsWithUrls = await Promise.all(result[0].map(async (song) => {
            const fileUrl = await getFileUrl(song.file_url);
            const coverUrl = await getFileUrl(song.cover_url);

            return {
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                genre: song.genre,
                duration: song.duration,
                file_url: fileUrl,
                cover_url: coverUrl
            };
        }));

        res.json(songsWithUrls);

    } catch (err) {
        return res.status(500).json({message: "Error al obtener las canciones"});
    }
}

export const getSongById = async (req, res) => {
    try {
        const id = req.params.id;

        const [rows] = await pool.query("SELECT * FROM songs WHERE id = ?", [id]);
        
        if(rows.length <= 0){
            return res.status(404).json({message: "Canción no encontrada"});
        }

        const song = rows[0];
        const resultFileURL = await getFileUrl(rows[0].file_url);
        const resultCoverURL = await getFileUrl(rows[0].cover_url);
        
        res.json({
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            genre: song.genre,
            duration: song.duration,
            file_url: resultFileURL,
            cover_url: resultCoverURL
        });   

    } catch (err) {
        return res.status(500).json({message: "Error al obtener la canción"});
    }
    
}

export const createSong = async(req, res) => {

    if(!req.files) return res.status(400).json({message: "No se ha subido ningún archivo"});

    if (!req.files) {
        return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    if (!req.files.song) {
        deleteTempFiles(req.files);
        return res.status(400).json({ message: "No se ha subido la canción" });
    }

    if (!req.files.cover) {
        deleteTempFiles(req.files);
        return res.status(400).json({ message: "No se ha subido la portada" });
    }

    if (!req.files.song.mimetype.startsWith("audio")) {
        deleteTempFiles(req.files);
        return res.status(400).json({ message: "El archivo no es una canción" });
    }

    if (!req.files.cover.mimetype.startsWith("image")) {
        deleteTempFiles(req.files);
        return res.status(400).json({ message: "El archivo no es una imagen" });
    }

    const songFile = req.files.song.name;
    const coverFile = req.files.cover.name;

    const {title, artist, album, genre, duration} = req.body;

    try {
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, "");
        const sanitizedArtist = artist.replace(/[^a-zA-Z0-9 ]/g, "");
        const sanitizedAlbum = album.replace(/[^a-zA-Z0-9 ]/g, "");

        const songExtension = songFile.split(".").pop();
        const coverExtension = coverFile.split(".").pop();

        const songFileName = `song_${sanitizedTitle}_${sanitizedArtist}_${sanitizedAlbum}.${songExtension}`;
        const coverFileName = `cover_${sanitizedTitle}_${sanitizedArtist}_${sanitizedAlbum}.${coverExtension}`;

        await uploadFile(req.files.song, songFileName);
        await uploadFile(req.files.cover, coverFileName);

        const [rows] = await pool.query("INSERT INTO songs (title, artist, album, genre, duration, file_url, cover_url) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [title, artist, album, genre, duration, songFileName, coverFileName]);

        

        res.send(
            {
                id: rows.insertId,
                title, 
                artist, 
                album, 
            }
        );

    } catch (err) {
        return res.status(500).json({message: "Error al subir los archivos + {err}"});
    }
}

export const updateSong = async(req, res) => {
    const {id} = req.params;
    const {album} = req.body;

    const [result] = await pool.query("UPDATE songs SET album = ? WHERE id = ?", [album, id]);

    if(result.affectedRows === 0){
        return res.status(404).json({message: "Canción no encontrada"});
    }

    res.json({message: "Canción actualizada"});
}

export const deleteSong = async(req, res) => {
    const {id} = req.params;
    const [result] = await pool.query("DELETE FROM songs WHERE id = ?", [id]);

    res.json({message: "Canción eliminada"});
}

const deleteTempFiles = (files) => {
    try {
        if (files.song?.tempFilePath) fs.unlinkSync(files.song.tempFilePath);
        if (files.cover?.tempFilePath) fs.unlinkSync(files.cover.tempFilePath);
    } catch (err) {
        console.error("Error al eliminar los archivos temporales:", err);
    }
};
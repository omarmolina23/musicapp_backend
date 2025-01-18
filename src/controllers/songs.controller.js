import { pool } from "../db.js";
export const getSongs = async (req, res) => {
    const result = await pool.query("SELECT * FROM songs");
    res.send(result[0]);
}

export const getSongById = async (req, res) => {

    try {
        const id = req.params.id;

        const [rows] = await pool.query("SELECT * FROM songs WHERE id = ?", [id]);
        
        if(rows.length <= 0){
            return res.status(404).json({message: "Canción no encontrada"});
        }
    
        res.json(rows[0]);    
    } catch (error) {
        return res.status(500).json({message: "Error al obtener la canción"});
    }
    
}

export const createSong = async(req, res) => {
    const {title, artist, album, genre, duration, file_url, cover_url} = req.body;
    const [rows] = await pool.query("INSERT INTO songs (title, artist, album, genre, duration, file_url, cover_url) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [title, artist, album, genre, duration, file_url, cover_url])

    res.send(
        {
            id: rows.insertId,
            title, 
            artist, 
            album, 
        }
    );
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
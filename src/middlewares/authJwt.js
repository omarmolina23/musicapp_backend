import jwt from "jsonwebtoken";
import {pool} from "../db.js";
import {SECRET} from "../config.js";
export const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if(!token) return res.status(403).json({message: "No se tiene token"});

    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
  
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.userId]);
    if(rows.length <= 0) return res.status(404).json({message: "Usuario no encontrado"});
    
    next();
}

export const isAdmin = async (req, res, next) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.userId]);

    if(rows[0].role !== "admin") return res.status(403).json({message: "Se requiere rol de administrador"});

    next();
}
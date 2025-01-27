import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { SECRET } from "../config.js";

export const verifyToken = async (req, res, next) => {

    const token = req.cookies["auth-token"];
    console.log("Hola", token);

    if (!token) {
        return res.status(403).json({ message: "No se tiene token" });
    }

    try {

        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;

        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.userId]);
        if (rows.length <= 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.userId]);

        if (rows[0].role !== "admin") {
            return res.status(403).json({ message: "Se requiere rol de administrador" });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: "Error al verificar el rol del usuario" });
    }
};

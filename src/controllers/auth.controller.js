import {pool} from "../db.js";
import {SECRET} from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { name, email, password, role, googleId } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error al verificar el usuario" });
    }

    let hashedPassword = null;
    let isPasswordSet = false;

    if (!googleId) {
        if (!password) {
            return res.status(400).json({ message: "Se requiere una contraseña para el registro normal" });
        }
        hashedPassword = await encryptPassword(password);
        isPasswordSet = true; 
    }

    try {
        const fields = ["name", "email", "password", "googleId", "isPasswordSet"];
        const values = [name, email, hashedPassword, googleId, isPasswordSet];

        if (role) {
            fields.push("role");
            values.push(role);
        }

        const placeholders = fields.map(() => "?").join(", ");
        const squery = `INSERT INTO users (${fields.join(", ")}) VALUES (${placeholders})`;

        const [query] = await pool.query(squery, values);

        // Generar token JWT
        const token = jwt.sign({ id: query.insertId }, SECRET, { expiresIn: 86400 });

        res.cookie("auth-token", token, {httpOnly: true, maxAge: 86400});

        res.status(201).json({ name, email, token });
    } catch (err) {
        return res.status(500).json({ message: "Error al crear el usuario"});
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length <= 0) {
            return res.status(400).json({ message: "El usuario no existe" });
        }

        const user = rows[0];

        if (user.isPasswordSet) {
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    token: null,
                    message: "Contraseña incorrecta"
                });
            }
        } else {
            return res.status(400).json({
                token: null,
                message: "Este usuario fue registrado con Google. Usa el inicio de sesión con Google o configura una contraseña."
            });
        }

        const token = jwt.sign({ id: user.id }, SECRET, {
            expiresIn: 86400
        });

        res.cookie("auth-token", token, { httpOnly: true, maxAge: 86400 });

        res.json({ name: user.name, email: user.email, token });

    } catch (err) {
        return res.status(500).json({ message: "Error al buscar el usuario" });
    }
};

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

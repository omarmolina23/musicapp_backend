import {pool} from "../db.js";
import {SECRET} from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {name, email, password, role} = req.body;

    try{
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if(rows.length > 0) return res.status(400).json({message: "El usuario ya existe"});
    }
    catch(err) {
        return res.status(500).json({message: "Error al crear el usuario"});
    }

    const hashedPassword = await encryptPassword(password);

    try{
        let squery = "INSERT INTO users (name, email, password";
        let values = [name, email, hashedPassword];

        if(role) {
            squery += ", role) VALUES (?, ?, ?, ?)";
            values.push(role);
        }
        else squery += ") VALUES (?, ?, ?)";

        const [query] = await pool.query(squery, values);
        
        const token = jwt.sign({id: query.insertId}, SECRET, {
            expiresIn: 86400
        })
    
        res.json({name: name, email: email, token});
    }
    catch(err){
        return res.status(500).json({message: "Error al crear el usuario"});
    }
};

export const signin = async (req, res) => {
    const {email, password} = req.body;

    try{
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if(rows.length <= 0) return res.status(400).json({message: "El usuario no existe"});

        const isMatch = await comparePassword(password, rows[0].password);
        if(!isMatch) return res.status(400).json({
            token: null,
            message: "Contraseña incorrecta"
        });

        const token = jwt.sign({id: rows[0].id}, SECRET, {
            expiresIn: 86400
        })
    
        res.json({name: rows[0].name, email: rows[0].email, token});
    }
    catch(err){
        return res.status(500).json({message: "Error al buscar el usuario"});
    }
};

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

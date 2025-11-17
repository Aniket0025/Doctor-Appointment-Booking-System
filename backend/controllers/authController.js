//this authcontroller for new register and login

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";


export const register = async(req, res) => {
    const {name, email, phone, password, role} = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
        `insert into users (name,email, phone, password, role) values (?,?,?,?,?)`,
        [name, email, phone, hashed, role ||"patient"]
    );

    res.json({message: "registered successfull"});
};


export const login = async(req, res) => {
    const {email, password}= req.body;

    const [rows] = await pool.query("select * from users where email=?", 
        [email,]
    );


    if(rows.length === 0) return res.status(400).json({message:"User not found"});

    const user = rows[0];

    const valid = await bcrypt.compare(password,user.password);
    if(!valid) return res.json({message:"wrong password"});

    const token = jwt.sign(
        {id:user.id, email: user.email, role:user.role},
        process.env.JWT_SECRET
    );

    res.json({message:"login successfull", token, user});
};
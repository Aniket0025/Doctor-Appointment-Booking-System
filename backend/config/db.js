import dotenv from "dotenv";
import mysql2 from "mysql2/promise";
dotenv.config();

const host = process.env.host;
const user = process.env.user;
const password = process.env.password;
const database = process.env.database;


const pool = mysql2.createPool({
    host: host ,
    user: user,
    password: password,
    database: database
})


export default pool;
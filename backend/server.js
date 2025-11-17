import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./routes/auth.js";
dotenv.config();


const app = express();



app.use(cors())
app.use(express.json());

app.use("/api/auth",router);

const PORT = process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Server Started at ${PORT}`);
})



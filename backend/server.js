import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Server running!");
});

console.log(process.env.MONGO_URI);

//v4qDWVdlX0uikXyn


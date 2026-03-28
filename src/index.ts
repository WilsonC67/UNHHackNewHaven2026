import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config({})

const app = express();

app.get("/", (req, res) => {
    res.send("Testing the server!")
})

export default app;
import express from "express"
import weather from "../services/weather.js"

const router = express.Router()

router.get("/search_location", (req, res) => {
    console.log(req.body, req.params, req)

    res.end("hello, world!");
})

export default router;

import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs"
import { createServer } from "http";
import weather from "./routes/weather.js"
import flight_info from "./routes/flight_info.js"

function findDotEnv(check_path: string | undefined = undefined) {
    if (check_path == "/") {
        return "";
    }

    let _path = path.resolve(check_path ?? "");
    let file = path.resolve(_path, ".env")

    if (!fs.existsSync(file)) {
        return findDotEnv(path.resolve(check_path ?? "", '..'))
    }
    return file;
}

dotenv.config({
    path: findDotEnv()
});

const app = express();

app.use(express.json())
app.use(express.text())
app.use("/weather", weather)
app.use("/flight_info", flight_info)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

let server = createServer({}, app)

server.listen(3000, () => {
    console.log("Server listening at port 3000")
})


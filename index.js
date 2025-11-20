import "dotenv/config";
import axios from "axios";
import express from "express";
import cors from "cors";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import parseForwarded from "forwarded-parse";

const app = express();
app.use(cors());

const NUMBER_OF_PROXIES_TO_TRUST = 1;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
    keyGenerator: (req, res) => {
        let ip = req.ip;
        try {
            const forwards = parseForwarded(req.headers.forwarded);
            if (forwards && Array.isArray(forwards))
                ip = forwards[forwards.length - NUMBER_OF_PROXIES_TO_TRUST].for;
        } catch (ex) {
            console.error(
                `Error parsing Forwarded header ${req.headers.forwarded} from ${req.ip}:`,
                ex
            );
        }
        return ipKeyGenerator(ip);
    },
});

app.use(limiter);

app.get("/", (req, res) => {
    return res.send("Hello World");
});

app.get("/fetch-rss", async (req, res) => {
    const url = req.query.url;
    console.log("URL :: ", url);
    const response = await axios.get(url, {
        headers: { Accept: "application/xml" },
    });

    const xmlData = response.data;

    res.set("Content-Type", "text/xml");
    return res.send(xmlData);
});

const port = Number(process.env.PORT) || 8000;

app.listen(port, () => {
    console.log("Server Running at PORT : ", port);
});

import "dotenv/config";
import axios from "axios";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

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

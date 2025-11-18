import axios from "axios";
import express from "express";

const app = express();

app.get("/", (req, res) => {
    return res.send("Hello World");
});

app.get("/fetch-rss", async (req, res) => {
    const url = req.query.url;
    const response = await axios.get(url, {
        headers: { Accept: "application/xml" },
    });

    const xmlData = response.data;

    res.set("Content-Type", "text/xml");
    return res.send(xmlData);
});

app.listen(3000, () => {
    console.log("Server Running...");
});

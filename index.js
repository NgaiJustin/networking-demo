const express = require("express");
const app = express();
const url = require("url");

// Adapted from 2112 Servlet lab: https://github.com/mt-xing/cs2112-servlets

const port = process.env.PORT || 8080;

let message = "You'll never figure out how to change me";
const secret = "1_l0v3_n3tw0rk1n9";

/**
 * Endpoints for Postman Demo
 */
app.get("/", function (_, response) {
    response.send("Hello World");
});

app.get("/message", (_, res) => {
    res.send(message);
});

app.get("/json", (_, res) => {
    res.type("application/json");
    const msg = {
        message: "I am a JSON!",
        param: 42,
    };
    res.send(JSON.stringify(msg));
});

app.get("/params", (req, res) => {
    const queryInfo = {
        query: req.url.split("?")[1],
        paramNames: Object.keys(req.query),
        fooParam: req.query.foo,
    };

    res.type("application/json");
    res.send(JSON.stringify(queryInfo));
});

const setGood = JSON.stringify({ success: true });
const setBad = JSON.stringify({
    success: false,
    message: "Wrong secret/password, try again :(",
});

/**
 * Endpoint for Student Activity
 */
app.use(express.json());

app.get("/secret", (req, res) => {
    const paramNames = Object.keys(req.query);
    let queryInfo;
    if (paramNames.includes("name") && paramNames.includes("netid")) {
        queryInfo = {
            success: true,
            secret: secret,
        };
    } else {
        queryInfo = {
            success: false,
            message:
                "Please include your 'name' and 'netid' in your get request :)",
        };
    }
    res.type("application/json");
    res.send(JSON.stringify(queryInfo));
});

app.post("/message", async (req, res) => {
    const msgBundle = req.body;
    res.type("application/json");
    if (msgBundle.message && msgBundle.secret === secret) {
        message = msgBundle.message;
        res.send(setGood);
    } else {
        res.send(setBad);
    }
});

const bodyParser = require("body-parser");
app.use(bodyParser.text());

app.post("/post", async (req, res) => {
    const t = req.body;
    res.send(JSON.stringify(t));
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

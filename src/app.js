const express = require("express");
const app = express();

app.use("/namaste",(req, res) => {
    res.send("Namaste clients!!🙏 how can I help you?")
});

app.use("/hello",(req, res) => {
    res.send("Hello hello 👋")
});

app.use("/", (req, res) => {
    res.send("This is DashBoard 🚀🔍♻️✅")
});

app.listen(7777, () => {
    console.log("server started sucessully at 7777...")
});
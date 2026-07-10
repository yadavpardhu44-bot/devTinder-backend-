const express = require("express");
const app = express();


app.get("/a{b}cd", (req, res) => {
    res.send({FirstName: "Pardhu", LastName: "Yadav"})
})

app.get("/a*cd", (req, res) => {
    res.send({FirstName: "Pardhu", LastName: "Yadav"})
})

app.get(/a/, (req, res) => {
    res.send({FirstName: "Pardhu", LastName: "Yadav"})
})

app.get(/.*fly$/, (req, res) => {
    res.send({FirstName: "Pardhu", LastName: "Yadav"})
})

app.get("/user", (req, res) => {
    console.log(req.query);
    res.send({FirstName: "Pardhu", LastName: "Yadav"})
})

app.get("/user/:userid/:name/:password", (req, res) => {
    console.log(req.params);
    res.send({FirstName: "Pardhu", LastName: "Yadav"})
})

app.listen(7777, () => {
    console.log("server started sucessully at 7777...")
});
const express = require("express");
const app = express();


app.get("/user", (req, res) => {
    res.send({FirstName: "Pardhu", LastName: "Yadav"})
})

app.post("/user", (req, res) => {
    res.send("data successfully saved to the DB.")
})

app.delete("/user", (req, res) => {
    res.send("Deleted successfully.")
})

app.use("/hello",(req, res) => {
    res.send("Hello hello 👋")
});

app.use("/user", (req, res) => {
    res.send("Hahahaha")
})

app.listen(7777, () => {
    console.log("server started sucessully at 7777...")
});
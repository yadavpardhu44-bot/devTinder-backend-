const express = require("express");
const {adminAuthentication, userAuthentication} = require("./middlewares/auth")
const app = express();

app.use("/admin", adminAuthentication)
app.get("/admin/data", (req, res) => {
    res.send("This is the whole data")
})
app.delete("/admin/delete", (req, res) => {
    res.send("Deleted the data")
})

app.get("/user/login", (req, res) => {
    res.send("User loggedIn");
})

app.get("/user/data", userAuthentication, (req, res) => {
    res.send("User data");
})


app.listen(7777, () => {
    console.log("server started sucessully at 7777...")
});
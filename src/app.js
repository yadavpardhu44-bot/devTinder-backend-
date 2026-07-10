const express = require("express");
const app = express();


app.get("/user", (req, res, next) => {
    next();
    console.log("1st response")
    //res.send("1st response")
},
[(req, res, next) => {
    next();
    console.log("2nd response")
    //res.send("2nd response")
},
(req, res, next) => {
    next();
    console.log("3rd response")
    //res.send("2nd response")
}],
[(req, res, next) => {
    next();
    console.log("4th response")
    //res.send("4th response")
}]
)

app.get("/user", (req, res) => {
    console.log("5th response");
    res.send("6th response")
})


app.listen(7777, () => {
    console.log("server started sucessully at 7777...")
});
const express = require("express");
const {adminAuthentication, userAuthentication} = require("./middlewares/auth")
const app = express();

app.use("/", (err, req, res, next) => {
    if(err){
        //log your error
        res.status(500).send("something went wrong");
    }
})

app.get("/user", (req, res) => {
    //try {
        throw new Error("dksdk");
        res.send("User data sent");
    //}
    // catch(err) {
    //     if(err){
    //         res.status(500).send("some error conatact support team")
    //     }
    // }
})
app.use("/", (err, req, res, next) => {
    if(err){
        //log your error
        res.status(500).send("something went wrong");
    }
})

app.listen(7777, () => {
    console.log("server started sucessully at 7777...")
});
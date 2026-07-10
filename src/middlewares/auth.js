function adminAuthentication(req, res, next){
    const token = "xyz";
    if(token === "xyz"){
        console.log("admin authenticated")
        next();
    }
    else{
        res.status(401).send("Authentication failed");
    }
}

const userAuthentication = (req, res, next) => {
    const token = "abc";
    if(token === "abc"){
        console.log("user authenticated")
        next();
    }
    else{
        res.status(401).send("Authentication failed");
    }
}

module.exports = {adminAuthentication, userAuthentication};
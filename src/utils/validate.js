const validator = require("validator")
const validateSignUp = (req) => {
    const {firstName, lastName, emailId, password} = req.body
    if(!firstName || !lastName){
        throw new Error("Enter firstName and lastName");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid emailId");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password.")
    }
}

const validateEditProfileData = (req) => {
    const UPDATABLE_FIELDS = ["firstName", "lastName", "photourl", "about", "age", "gender", "skills"];
    const isValidEditData = Object.keys(req.body).every(k => UPDATABLE_FIELDS.includes(k));
    return isValidEditData;
}
module.exports = {
    validateSignUp,
    validateEditProfileData,
}
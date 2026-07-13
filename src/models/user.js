const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 25
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Not a strong password"+value);
            }
        }
    },
    age: {
        type: Number,
        required: false,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photourl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkoJVFBXmhIvZrkmrGFx3DtWth0dkNfljp9KK9VSg541DxseGpKvL1SbWj&s=10",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL"+value);
            }
        }

    },
    about: {
        type: String,
        about: "This is a dummy about you can edit it."
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);
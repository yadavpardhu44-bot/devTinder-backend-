const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is not a valid status type.`
        }
    }
},
{ timestamps: true }
)

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", async function () {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can not send connection request to yourself.");
    };
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
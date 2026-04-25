import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema =new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    phone: String,
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user"
    },
    forgetcode: String,
    profilePic: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2014/04/03/10/41/person-311134_1280.png",
            id: null
        }
    },
    coverimges: [{
        url: { type: String },
        id: { type: String }
    }],

},
    { timestamps: true }
);

//hooks 
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(
            this.password,
            parseInt(process.env.BCRYPT_ROUNDS)
        );
    }
});


userSchema.methods.comparePassword=async function(comprepassword){
    return await bcrypt.compare(comprepassword,this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
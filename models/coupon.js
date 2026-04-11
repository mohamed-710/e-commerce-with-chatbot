import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    expiredAt:{
        type:Date
    }

} ,{timestamps:true}
);
const Coupon=mongoose.model("Coupon",couponSchema);
export default Coupon;

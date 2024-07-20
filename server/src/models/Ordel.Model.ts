import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOrder extends Document {
    courseId: string;
    userId: string;
    payment_info: object;
}

const OrderSchema: Schema<IOrder> = new Schema({
    courseId:
    {
        type: String,
        required: true

    },
    userId:
    {
        type: String,
        required: true

    },
    payment_info:
    {
        type: Object,
        // required: true

    },
},
    { timestamps: true }
);

const OrderModel: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;

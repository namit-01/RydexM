import mongoose from "mongoose";

type vehicleType = "bike" | "car" | "loading" | "truck" | "auto";
export interface IVehicle {
  owner: mongoose.Types.ObjectId;
  type: vehicleType;
  vehicleModel: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKM?: number;
  waitingCharge?: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  number: string;
}
const vehicleSchema = new mongoose.Schema<IVehicle>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["bike", "car", "loading", "truck", "auto"],
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    imageUrl: String,
    baseFare: Number,
    pricePerKM: Number,
    waitingCharge: Number,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: String,
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);
const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;

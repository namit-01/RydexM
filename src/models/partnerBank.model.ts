import mongoose from "mongoose";

export interface IPartnerBank {
  owner: mongoose.Types.ObjectId;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  upi?: string;
  status: "not_added" | "added" | "verified";
  createdAt: Date;
  updatedAt: Date;
}
const PartnerBankSchema = new mongoose.Schema<IPartnerBank>(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },
    ifsc: { type: String, required: true, uppercase: true },
    upi: String,
    status: {
      type: String,
      enum: ["not_added", "added", "verified"],
      default: "not_added",
    },
  },
  { timestamps: true },
);
const PartnerBank =
  mongoose.models.PartnerBank ||
  mongoose.model("PartnerBank", PartnerBankSchema);
export default PartnerBank;

import mongoose, { Model, Schema } from "mongoose";
import { IVisitor, VisitorStatus } from "../types";

export const visitorSchema = new Schema<IVisitor>(
  {
    name: {
      type: String,
      required: [true, "Visitor name is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    purpose: {
      type: String,
      required: [true, "Purpose of visit is required"],
    },
    hostEmployeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host employee is required"],
    },
    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
    },
    idNumber: {
      type: String,
      trim: true,
    },
    passNumber: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(VisitorStatus),
      default: VisitorStatus.SCHEDULED,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    gateNumber: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

visitorSchema.index({ visitDate: 1 });
visitorSchema.index({ status: 1 });
visitorSchema.index({ hostEmployeeId: 1 });
visitorSchema.index({ passNumber: 1 });
visitorSchema.index({ checkInTime: 1 });
visitorSchema.index({ company: 1 });
visitorSchema.index({ createdAt: 1 });

visitorSchema.pre("save", async function (next) {
  if (!this.passNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    this.passNumber = `VMS-${timestamp}-${random}`;
  }
  next();
});

export const Visitor: Model<IVisitor> = mongoose.model<IVisitor>(
  "Visitor",
  visitorSchema
);

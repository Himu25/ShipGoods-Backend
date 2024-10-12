import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["car", "truck", "bus", "motorcycle"],
    },
    numberPlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ currentLocation: "2dsphere" });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;

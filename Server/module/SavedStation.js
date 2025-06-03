const mongoose = require("mongoose");

const SavedStationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stationId: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    tags: { type: Object, default: {} },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

SavedStationSchema.index({ userId: 1, stationId: 1 }, { unique: true });
module.exports = mongoose.model("SavedStation", SavedStationSchema);

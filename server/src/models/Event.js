import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },

  imageUrl: {
    type: String,
    default: ""
  },

  eventLink: {
    type: String,
    default: ""
  },

  // moderation / publishing
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved"
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  submittedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  }
});

export default mongoose.model("Event", eventSchema);

import mongoose from "mongoose";

// Review Schema Definition
const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },

  ratedBy: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define Review Model
const Review = mongoose.model("review", ReviewSchema);

export default Review;

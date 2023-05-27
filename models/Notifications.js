import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  user_email: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("notification", NotificationSchema);
export default Notification;

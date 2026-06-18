import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },

  clipboardData: {
    type: mongoose.Schema.Types.Mixed,
    default: ""
  },

  usersOnline: {
    type: Number,
    default: 0
  },

  expiresAt: {
    type: Date
  }
});

export default mongoose.model("Session", sessionSchema);
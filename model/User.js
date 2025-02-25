const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    brandName: { type: String, required: false },
    agentId: { type: String, required: false },
    agentName: { type: String, required: false },
    email: { type: String, required: false },
    contact: { type: String, required: false },
    password: { type: String, required: false },
<<<<<<< HEAD
=======
    confirmPassword: { type: String, required: false },
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    roleType: {
      type: String,
      required: false,
      enum: ["0", "1", "2"],
      default: "2",
    },
<<<<<<< HEAD
    location: {
      type: String,
    }
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

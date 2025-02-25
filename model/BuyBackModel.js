const mongoose = require("mongoose");
const { customerPersonalDetais } = require("./AmcModel");

const vehicleDetailsSchema = mongoose.Schema({
  vehicleModel: {
    type: String,
    required: false,
  },
  vinNumber: {
    type: String,
    required: false,
  },
  fuelType: {
    type: String,
    required: false,
  },
<<<<<<< HEAD
  dealerLocation: {
    type: String,
    required: false,
  },

=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  agreementStartDate: {
    type: String,
    required: false,
  },
  agreementValidDate: {
    type: String,
    required: false,
  },
  deliveryDate: {
    type: String,
    required: false,
  },
  validityMilage: {
    type: String,
    required: false,
  },
  totalPayment: {
    type: String,
    required: false,
  },
  gmEmail: {
    type: String,
  },
<<<<<<< HEAD
  rmName: {
    type: String,
  },
  rmEmployeeId: {
    type: String,
  },
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  rmEmail: {
    type: String,
  },
});
<<<<<<< HEAD
const buyBackDetailSchema = mongoose.Schema({
  deliveryDate: {
    type: String,
  },
  marketPrice: {
    type: String,
  },
  raamGroupPrice: {
    type: String,
  },
  priceDifference: {
    type: String,
  },
});
=======

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
const BuyBackSchema = mongoose.Schema(
  {
    customerDetails: customerPersonalDetais,
    vehicleDetails: vehicleDetailsSchema,
<<<<<<< HEAD
    buyBackDetails: buyBackDetailSchema,
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    buyBackStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
<<<<<<< HEAD

    customId: {
      type: String,
      required: true,
    },
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCancelReq: {
      type: String,
      enum: ["noReq", "reqCancel", "approvedReq"],
      default: "noReq",
    },
    approvedAt: {
      type: Date,
      required: false,
    },
    rejectedAt: {
      type: Date,
      required: false,
    },
    disabledAt: {
      type: Date,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BuyBacks = mongoose.model("BuyBacks", BuyBackSchema);

module.exports = BuyBacks;

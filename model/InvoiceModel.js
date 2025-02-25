const mongoose = require("mongoose");
const { customerPersonalDetais } = require("./AmcModel");

const vehicleDetailSchema = mongoose.Schema({
  hypothecated: {
    type: String,
    required: false,
  },
  branchName: {
    type: String,
    required: false,
  },
  model: {
    type: String,
    required: false,
  },
  vinNumber: {
    type: String,
    required: false,
  },
  gstAmount: {
    type: String,
    required: false,
  },
  cgst: {
    type: String,
    required: false,
  },
  sgst: {
    type: String,
    required: false,
  },
  totalAmount: {
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
  rmEmail: {
    type: String,
  },
=======
  rmEmail:{
    type: String,
  }
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
});
const invoiceSchema = mongoose.Schema(
  {
    invoiceType: {
      type: String,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "serviceType",
    },
    serviceType: {
      type: String,
      required: true,
<<<<<<< HEAD
      enum: ["BuyBacks", "AMCs", "EwPolicy"],
    },
    location:{
      type: String
=======
      enum: ["BuyBacks", "AMCs"],
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    },

    billingDetail: customerPersonalDetais,
    shippingDetails: customerPersonalDetais,
    vehicleDetails: vehicleDetailSchema,

 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    invoiceId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("invoice", invoiceSchema);
module.exports = Invoice;

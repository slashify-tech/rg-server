const mongoose = require("mongoose");

const customerPersonalDetais = mongoose.Schema({
  customerName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  pan: {
    type: String,
    required: false,
  },
  customerGst: {
    type: String,
    required: false,
  },
  zipCode: {
    type: String,
    required: false,
  },
  stateCode: {
    type: String,
    required: false,
  },
<<<<<<< HEAD
  city:{
    type:String
  },
  state:{
    type:String
  },
  dob:{
    type:String
  }
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
});

const amcVehicleDetailSchema = mongoose.Schema({
  model: {
    type: String,
  },
  fuelType: {
    type: String,
  },
<<<<<<< HEAD

=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  vinNumber: {
    type: String,
  },

  agreementPeriod: {
    type: String,
  },
  agreementStartDate: {
    type: String,
  },
  agreementValidDate: {
    type: String,
  },
  agreementStartMilage: {
    type: String,
  },
  agreementValidMilage: {
    type: String,
  },
  MaximumValidPMS: {
    type: String,
  },
  dealerLocation: {
    type: String,
  },
  total: {
    type: String,
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
const uploadDataSchema = mongoose.Schema({
  serviceVinNumber: {
    type: String,
  },
  serviceDate: {
    type: String,
    required: true
  },
  partsPrice: {
    type: String,
  },
  labourPrice: {
    type: String,
  },
  vasPrice: {
    type: String,
  },
  issueType:{
    trype:String,
  },
  serviceTotalAmount: {
    type: String,
  }

});

=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
const AMCschema = mongoose.Schema(
  {
    customerDetails: customerPersonalDetais,
    vehicleDetails: amcVehicleDetailSchema,
<<<<<<< HEAD
    amcExpense: [uploadDataSchema],
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    amcStatus: {
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

const AMCs = mongoose.model("AMCs", AMCschema);
module.exports = {
  AMCs,
  customerPersonalDetais,
};

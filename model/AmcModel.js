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
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  dob: {
    type: String,
  },
  amcType: {
    type: String,
  },
});

const amcVehicleDetailSchema = mongoose.Schema({
  model: {
    type: String,
  },
  fuelType: {
    type: String,
  },

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
  rmName: {
    type: String,
  },
  rmEmployeeId: {
    type: String,
  },
  rmEmail: {
    type: String,
  },
  department: {
    type: String,
  },
  salesTeamEmail: {
    type: String,
  },
  paymentReceivedDateForPackage: {
    type: String,
  },

  bookingId: {
    type: String,
  },

  custUpcomingService: {
    type: Array,
  },

  paymentScreenshot: {
    type: String,
  },
});

const uploadDataSchema = mongoose.Schema({
  serviceVinNumber: {
    type: String,
  },
  serviceDate: {
    type: String,
    required: true,
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
  serviceType: {
    type: String,
  },
  serviceTotalAmount: {
    type: String,
  },
});
const extendedPolicySchema = mongoose.Schema({
  extendedPolicyPeriod: String,
  additionalPrice: String,
  paymentCopyProof: String,
  openForm: Boolean,
  submittedAt: Date,
  validDate: String,
  validMileage: String,
  upcomingPackage: Array,
});

const amcAssuredSchema = mongoose.Schema({
  expenses: String,
  buybackOrSoldToRG: String,
  refundedAmount: String,
  submittedAt: Date,
});

const AMCschema = mongoose.Schema(
  {
    customerDetails: customerPersonalDetais,
    vehicleDetails: amcVehicleDetailSchema,
    extendedPolicy: extendedPolicySchema,
    amcAssuredAdditionalData: amcAssuredSchema,
    amcExpense: [uploadDataSchema],
    amcCredit: {
      type: String,
    },
    amcStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    customId: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isCancelReq: {
      type: String,
      enum: ["noReq", "reqCancel", "approvedReq"],
      default: "noReq",
    },

    isAmcSalesOrService: {
      type: Boolean,
      default: false,
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

const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const invoiceCounterSchema = new mongoose.Schema({
  amcCounter: counterSchema,
  buyBackCounter: counterSchema,
<<<<<<< HEAD
  ewCounter: counterSchema,

=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
});

const InvoiceCounter = mongoose.model("InvoiceCounter", invoiceCounterSchema);
module.exports = InvoiceCounter;

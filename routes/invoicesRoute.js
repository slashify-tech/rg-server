const express = require('express');
const router = express.Router();
const {
  addInvoice,
  editInvoice,
  getAllInvoice,
  invoiceApproval,
  getInvoicesByStatus,
  invoiceById,
  invoiceResubmit,
} = require('../controllers/invoiceController');
<<<<<<< HEAD
const { authCheck } = require('../middleware/Auth');

// Define routes
router.post('/add-invoice',authCheck, addInvoice);
router.patch('/update-invoice',authCheck, editInvoice);
router.patch('/update-approval',authCheck, invoiceApproval);
router.get('/all-invoice-approval',authCheck, getAllInvoice);
router.get('/invoice-all',authCheck, getInvoicesByStatus);
router.get('/invoice',authCheck, invoiceById);
router.patch('/invoice-resubmit',authCheck, invoiceResubmit);
=======

// Define routes
router.post('/add-invoice', addInvoice);
router.patch('/update-invoice', editInvoice);
router.patch('/update-approval', invoiceApproval);
router.get('/all-invoice-approval', getAllInvoice);
router.get('/invoice-all', getInvoicesByStatus);
router.get('/invoice', invoiceById);
router.patch('/invoice-resubmit', invoiceResubmit);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

// Export the router
module.exports = router;

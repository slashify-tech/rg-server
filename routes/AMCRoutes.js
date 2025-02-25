const express = require("express");
const {
  AmcFormData,
  editAmc,
  amcDataById,
  getAllAmcList,
  updateAMCStatus,
  AMCResubmit,
  disableAmc,
<<<<<<< HEAD
  addExpenseData,
  getamcStats,
  downloadAmcCsv,
} = require("../controllers/AmcController");
const { authCheck } = require("../middleware/Auth");
const router = express.Router();

router.post("/add-new-amc",authCheck, AmcFormData);
router.post("/add-expense-amc",authCheck, addExpenseData);
router.patch("/update-amc-status",authCheck, updateAMCStatus);
router.patch("/amc-resubmit",authCheck, AMCResubmit);
router.patch("/edit-amc/:id",authCheck, editAmc);
router.patch("/disable-amc",authCheck, disableAmc);
router.get("/amcById",authCheck, amcDataById);
router.get("/amc-lists",authCheck, getAllAmcList);
router.get("/amc-stats-data",authCheck, getamcStats);
router.get("/amc-download",authCheck, downloadAmcCsv);


=======
} = require("../controllers/AmcController");
const router = express.Router();

router.post("/add-new-amc", AmcFormData);
router.patch("/update-amc-status", updateAMCStatus);
router.patch("/amc-resubmit", AMCResubmit);
router.patch("/edit-amc/:id", editAmc);
router.get("/amcById", amcDataById);
router.get("/amc-lists", getAllAmcList);
router.patch("/disable-amc", disableAmc);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

module.exports = router;

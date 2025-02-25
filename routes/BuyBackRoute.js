const express = require("express");
const {
  BuyBackFormData,
  updateBuyBackStatus,
  editBuyBack,
  buyBackById,
  getAllBuyBackLists,
  buyBackResubmit,
  disableBuyBack,
<<<<<<< HEAD
  downloadBuyBackCsv,
  getBuyBackStats,
} = require("../controllers/BuyBackController");
const { authCheck } = require("../middleware/Auth");
const router = express.Router();

router.post("/add-new-buy-back", authCheck, BuyBackFormData);
router.patch("/update-buyback-status", authCheck, updateBuyBackStatus);
router.patch("/buyback-resubmit", authCheck, buyBackResubmit);
router.patch("/edit-buy-back/:id", authCheck, editBuyBack);
router.get("/buy-back", authCheck, buyBackById);
router.get("/buy-back-lists", authCheck, getAllBuyBackLists);
router.patch("/disable-buyBack", authCheck, disableBuyBack);
router.get("/buy-back-stats-data", authCheck, getBuyBackStats);
router.get("/buyBack-download",authCheck, downloadBuyBackCsv);

=======
} = require("../controllers/BuyBackController");
const router = express.Router();

router.post("/add-new-buy-back", BuyBackFormData);
router.patch("/update-buyback-status", updateBuyBackStatus);
router.patch("/buyback-resubmit", buyBackResubmit);
router.patch("/edit-buy-back/:id", editBuyBack);
router.get("/buy-back", buyBackById);
router.get("/buy-back-lists", getAllBuyBackLists);
router.patch("/disable-buyBack", disableBuyBack);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

module.exports = router;

const express = require("express");
const router = express.Router();
<<<<<<< HEAD
=======
const { cancelFromAgentRequest } = require("../controllers/PoliciesController");
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
const {
  signinController,
  getUsersData,
  getUserById,
  getUserDataById,
<<<<<<< HEAD
  passwordUpdate,
  emailUpdate,
} = require("../controllers/UserController");
const { authCheck } = require("../middleware/Auth");


router.post("/auth", signinController);
router.patch("/password-update",authCheck, passwordUpdate);
router.patch("/email-update",authCheck, emailUpdate);

router.get("/getUserData", authCheck, getUsersData);
router.get("/getUserDataById/:userId",authCheck, getUserById);
router.get("/getAllUserDataById/:userId",authCheck, getUserDataById);
=======
} = require("../controllers/UserController");
const { authCheck } = require("../middleware/Auth");

router.post("/auth", signinController);
router.put("/cancel-request/:id", cancelFromAgentRequest);

router.get("/getUserData", authCheck, getUsersData);
router.get("/getUserDataById/:userId", getUserById);
router.get("/getAllUserDataById/:userId", getUserDataById);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
module.exports = router;

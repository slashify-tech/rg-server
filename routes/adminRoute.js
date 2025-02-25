const express = require('express');
const router = express.Router();

<<<<<<< HEAD
const { addAgent, getMBagent, getMGagent, deleteAgent, getUserDataByBrand } = require("../controllers/UserController");
const { authCheck } = require('../middleware/Auth');

    router.post("/add-new-agent",authCheck, addAgent);
    router.delete("/deleteAgent/:id",authCheck, deleteAgent)

    router.get("/mb-agents",authCheck, getMBagent);
    router.get("/mg-agents",authCheck, getMGagent);
    router.get("/team-members",authCheck, getUserDataByBrand);
=======
const { getPendingPolicy, updatePolicyStatus,  disablePolicy, getCancelledPolicy, getAllPolicy, getAllPolicyCount, getCancelledPolicyCount, downloadPolicyCsv } = require("../controllers/PoliciesController");
const { addAgent, getMBagent, getMGagent, deleteAgent, getUserDataByBrand } = require("../controllers/UserController");

    router.post("/add-new-agent", addAgent);
    router.put("/policyStatus", updatePolicyStatus)
    router.put("/cancelPolicy/:policyId", disablePolicy)

    router.delete("/deleteAgent/:id", deleteAgent)

    router.get("/mb-agents", getMBagent);
    router.get("/mg-agents", getMGagent);
    router.get("/team-members", getUserDataByBrand);
    router.get("/pendingPolicy", getPendingPolicy)
    router.get("/get-cancelled-policy", getCancelledPolicy)
    router.get("/get-all-policy", getAllPolicy)
    router.get("/getPolicy-count", getAllPolicyCount)
    router.get("/getCancelledPolicy-count", getCancelledPolicyCount)
    router.get("/downloadCSV",downloadPolicyCsv)
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04


     

    
    module.exports = router;
const {
  sendAgentRejected,
  sendAgentAccepted,
  sendCustomerAccepted,
  AgentPolicyRejectedEmail,
} = require("../helper/emailFunction");
const BuyBacks = require("../model/BuyBackModel");
const User = require("../model/User");
<<<<<<< HEAD
const fs = require("fs");
const path = require("path");
const { parse: json2csv } = require("json2csv");
const { formatNumber } = require("../helper/countreunvtion");
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

exports.BuyBackFormData = async (req, res) => {
  try {
    const BuyBack = req.body;
    const vinNumber = BuyBack.vehicleDetails.vinNumber;
    const email = BuyBack.customerDetails.email;
    const duplicateVinNumber = await BuyBacks.findOne({ vinNumber });
    if (duplicateVinNumber) {
      return res.status(400).json({
        message: "Vehicle vin number already exists",
      });
    }

    const duplicateEmail = await BuyBacks.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

<<<<<<< HEAD
    const currentYear = new Date().getFullYear();
    const last5DigitsOfVin = vinNumber.slice(-5);
    const customId = `Raam-BB-${currentYear}-${last5DigitsOfVin}`;

    const newBuyBack = new BuyBacks({
      ...BuyBack,
      customId,
=======
    const newBuyBack = new BuyBacks({
      ...BuyBack,
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newBuyBack.save();

    return res.status(201).json({
      message: "BuyBack saved successfully.",
      BuyBack: newBuyBack,
    });
  } catch (error) {
    console.error("Error saving BuyBack data:", error);
    return res.status(500).json({
      message: "Failed to save BuyBack data",
      error: error.message,
    });
  }
};

exports.editBuyBack = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Check for duplicates
    if (updatedData.vinNumber) {
      const duplicateVinNumber = await BuyBacks.findOne({
        vinNumber: updatedData.vinNumber,
        _id: { $ne: id }, // Exclude the current being updated
      });
      if (duplicateVinNumber) {
        return res
          .status(400)
          .json({ message: "Vehicle Vin Number already exists" });
      }
    }

    if (updatedData.email) {
      const duplicateEmail = await BuyBacks.findOne({
        email: updatedData.email,
        _id: { $ne: id }, // Exclude the current buyback being updated
      });
      if (duplicateEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updateVinNumber = await BuyBacks.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updateVinNumber) {
      return res.status(404).json({ message: "BuyBacks not found" });
    }

    res.status(200).json({
      message: "BuyBacks updated successfully",
      data: updateVinNumber,
    });
  } catch (err) {
    console.error("Error updating BuyBacks data:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.updateBuyBackStatus = async (req, res) => {
  try {
    const { id, type } = req.body;
    const { reason } = req.query;
<<<<<<< HEAD
    const validTypes = [
      "pending",
      "approved",
      "rejected",
      "approvedReq",
      "reqCancel",
    ];
=======
    const validTypes = ["pending", "approved", "rejected", "approvedReq"];
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

    // Validate policy type
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid policy type." });
    }

    // Find the policy by ID
    const buyBackdata = await BuyBacks.findById(id);
<<<<<<< HEAD

    if (!buyBackdata) {
      return res.status(404).json({ message: "Buyback not found." });
    }
    const agent = await User.findById(buyBackdata.createdBy);
=======
    if (!buyBackdata) {
      return res.status(404).json({ message: "Buyback not found." });
    }

    const agent = await User.findById(buyBackdata.userId);

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    if (type === "approvedReq" && buyBackdata.isCancelReq === "reqCancel") {
      buyBackdata.isCancelReq = "approvedReq";
      await buyBackdata.save();

      return res.status(200).json({
        message: "Cancellation request approved.",
        isCancelReq: buyBackdata.isCancelReq,
      });
    }
<<<<<<< HEAD
    if (type === "reqCancel") {
      buyBackdata.isCancelReq = "reqCancel";
      await buyBackdata.save();

      return res.status(200).json({
        message: "Requested for cancellation",
        isCancelReq: buyBackdata.isCancelReq,
        status: 200,
      });
    }
=======

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    // Handle rejection case
    if (type === "rejected") {
      if (!reason) {
        return res
          .status(400)
          .json({ message: "Rejection reason is required." });
      }

      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 3);

      buyBackdata.rejectionReason = reason;
      buyBackdata.rejectedAt = deletionDate;
      buyBackdata.buyBackStatus = "rejected";

      await buyBackdata.save();
      console.log(
        `buyBackdata with ID: ${id} scheduled for deletion with reason: ${reason}.`
      );

      await AgentPolicyRejectedEmail(
        agent.email,
        agent.agentName,
        reason,
        "Buyback",
<<<<<<< HEAD
        buyBackdata.vehicleDetails.vinNumber,
        buyBackdata.customId,
        "Buyback",
        "Raam4Wheelers LLP"
=======
        AMCdata.vinNumber
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
      );

      return res
        .status(200)
        .json({ message: "Buyback rejected", buyBackdata, status: 200 });
    }

    // Handle approval case
    if (type === "approved") {
      buyBackdata.buyBackStatus = "approved";
      buyBackdata.approvedAt = new Date();

      buyBackdata.buyBackStatus = "approved";
      buyBackdata.approvedAt = new Date();

      await buyBackdata.save();
      return res
        .status(200)
        .json({ message: "buyBackData approved", buyBackdata, status: 200 });
    }

    buyBackdata.buyBackStatus = "pending";

    await buyBackdata.save();

    return res.status(200).json({
      message: "Buy Back Data Status Changed Successfully.",
      buyBackdata,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.disableBuyBack = async (req, res) => {
  try {
    const { buyBackId } = req.query;

    const buyBackdata = await BuyBacks.findById(buyBackId);
    if (!buyBackdata) {
      return res.status(404).json({ message: "buyback not found" });
    }

    if (!buyBackdata.approvedAt) {
      return res.status(403).json({
        message: "Buy Back must be approved before it can be disabled",
      });
    }

    const approvedDate = new Date(buyBackdata.approvedAt);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (currentDate - approvedDate) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > 15) {
      return res.status(403).json({
        message: "buyBackdata cannot be disabled after 15 days of creation",
      });
    }

    buyBackdata.isDisabled = true;
    const oneMonthFromApproval = new Date(approvedDate);
    oneMonthFromApproval.setMonth(approvedDate.getMonth() + 1);
    buyBackdata.disabledAt = oneMonthFromApproval;

    await buyBackdata.save();

    res
      .status(200)
      .json({ message: "Buy Back disabled successfully", data: buyBackdata });
  } catch (err) {
    console.error("Error disabling Buy Back:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.buyBackById = async (req, res) => {
  const { id, status } = req.query;
  try {
    if (!id && !status) {
      return res.status(400).json({
        message: "Please provide either buyBackId or status",
      });
    }

    // Build the query dynamically based on available parameters
    const query = {};
    if (id) query._id = id;
    if (status) query.status = status;

    const data = await BuyBacks.findOne(query);

    if (!data) {
      return res.status(404).json({
        message: "No data found with the provided criteria",
      });
    }

    return res.status(200).json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching BuyBack data:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAllBuyBackLists = async (req, res) => {
  const { page = 1, limit = 10, search = "", id, status } = req.query;
<<<<<<< HEAD
  const {roleType, location} = req.user
  
   console.log(req.user)
=======

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  try {
    const query = {};
    const orConditions = [];

    if (id) {
      orConditions.push({ createdBy: id });
    }

    if (status !== undefined) {
      const isBooleanStatus = status === "true" || status === "false";
      if (isBooleanStatus) {
        orConditions.push({ isDisabled: status === "true" });
      } else if (typeof status === "string") {
        orConditions.push({
          $or: [{ buyBackStatus: status }, { isCancelReq: status }],
        });
      }
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    if (search) {
      query["vehicleDetails.vinNumber"] = { $regex: search, $options: "i" };
    }
<<<<<<< HEAD
    if (roleType === "1" && location) {
      query["vehicleDetails.dealerLocation"] = location;
    }
=======

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    // console.log("Constructed Query:", JSON.stringify(query, null, 2));

    const skip = (parseInt(page) - 1) * parseInt(limit);

<<<<<<< HEAD
    const data = await BuyBacks.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
=======
    const data = await BuyBacks.find(query).skip(skip).limit(parseInt(limit));
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    const totalCount = await BuyBacks.countDocuments(query);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No Buyback Available" });
    }

    return res.status(200).json({
      message: "Data fetched successfully",
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching buyback data:", error.message);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.buyBackResubmit = async (req, res) => {
  const { buyBackId } = req.query;

  try {
<<<<<<< HEAD
    const buyBackdata = await BuyBacks.findById({ _id: buyBackId });
=======
    const buyBackdata = await BuyBacks.findOne({ _id: buyBackId });

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    if (!buyBackdata) {
      return res.status(404).json({ message: "Buy Back not found" });
    }
    buyBackdata.buyBackStatus = "pending";
    await buyBackdata.save();

    return res
      .status(200)
      .json({ message: "Buy Back fetched successfully", buyBackdata });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};
<<<<<<< HEAD

exports.getBuyBackStats = async (req, res) => {
  try {
    const { location, vehicleModel, startDate, endDate } = req.query;

    let filter = {};
    if (location) {
      filter["vehicleDetails.dealerLocation"] = location;
    }
    if (vehicleModel) {
      filter["vehicleDetails.vehicleModel"] = vehicleModel;
    }
    if (startDate || endDate) {
      if (startDate && endDate) {
        // If both startDate and endDate are provided, filter between them
        filter["createdAt"] = {
          $gte: new Date(`${startDate}T00:00:00.000Z`),
          $lte: new Date(`${endDate}T23:59:59.999Z`),
        };
      } else if (startDate) {
        // If only startDate is provided, match only that date
        filter["createdAt"] = {
          $gte: new Date(`${startDate}T00:00:00.000Z`),
          $lte: new Date(`${startDate}T23:59:59.999Z`),
        };
      } else if (endDate) {
        // If only endDate is provided, match only that date
        filter["createdAt"] = {
          $gte: new Date(`${endDate}T00:00:00.000Z`),
          $lte: new Date(`${endDate}T23:59:59.999Z`),
        };
      }
    }
    
    const buyBackDocs = await BuyBacks.find(filter);
    const totalBuyBackCount = buyBackDocs.length;
    const totalRevenue = buyBackDocs.reduce((sum, doc) => {
      return sum + Number(doc.vehicleDetails?.totalPayment || 0);
    }, 0);

    const totalExpense = buyBackDocs.reduce((sum, doc) => {
      return sum + Number(doc.buyBackDetails?.raamGroupPrice || 0);
    }, 0);

    return res.status(200).json({
      success: true,
      totalBuyBackCount: formatNumber(totalBuyBackCount),
      totalRevenue: formatNumber(totalRevenue),
      totalExpense: formatNumber(totalExpense),
    });
  } catch (error) {
    console.error("Error fetching buyback stats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.downloadBuyBackCsv = async (req, res) => {
  try {
    let query = {
      $and: [{ isDisabled: { $ne: true } }],
    };

    const data = await BuyBacks.find(query);

    const csvData = data.map((policy) => ({
      "Customer Name": policy.customerDetails.customerName || "",
      Email: policy.customerDetails.email || "",
      "Pan Number": policy.customerDetails.pan || "",
      Address: policy.customerDetails.address || "",
      "Contact Number": policy.customerDetails.contact || "",
      "Gst Number": policy.customerDetails.customerGst || "",
      "Vehicle Model": policy.vehicleDetails.model || "",
      "Vin Number": policy.vehicleDetails.vinNumber || "",
      "Fuel Type": policy.vehicleDetails.fuelType || "",
      "Agreement Start Date": policy.vehicleDetails.agreementStartDate || "",
      "Agreement Valid Date": policy.vehicleDetails.agreementValidDate || "",
      "Validity Milage": policy.vehicleDetails.validityMilage || "",
      "Delivery Date": policy.vehicleDetails.deliveryDate || "",
      "Dealer Location": policy.vehicleDetails.dealerLocation || "",
      "Total Price": policy.vehicleDetails.totalPayment || "",
      "Regional Manager Name": policy.vehicleDetails.rmName || "",
      "RM Employee Id": policy.vehicleDetails.rmEmployeeId || "",
      "RM Email": policy.vehicleDetails.rmEmail || "",
      "GM Email": policy.vehicleDetails.gmEmail || "",

      "Current Status": policy.buyBackStatus || "",
    }));

    const csvDataString = json2csv(csvData, {
      fields: [
        "Customer Name",
        "Email",
        "Pan Number",
        "Address",
        "Contact Number",
        "Gst Number",
        "Vehicle Model",
        "Vin Number",
        "Fuel Type",
        "Agreement Period",
        "Agreement Start Date",
        "Agreement Valid Date",
        "Validity Milage",
        "Delivery Date",
        "Dealer Location",
        "Total Price",
        "Regional Manager Name",
        "RM Employee Id",
        "RM Email",
        "GM Email",
        "Current Status",
      ],
    });

    const folderPath = path.join(__dirname, "..", "csv");
    const filePath = path.join(folderPath, "exportedData.csv");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(filePath, csvDataString);

    res.download(filePath, "amcData.csv", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Internal Server Error");
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error downloading CSV:", error);
    res.status(500).send("Internal Server Error");
  }
};
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

const { AgentPolicyRejectedEmail } = require("../helper/emailFunction");
const { AMCs } = require("../model/AmcModel");
const Invoice = require("../model/InvoiceModel");
const User = require("../model/User");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const { formatNumber } = require("../helper/countreunvtion");
const mongoose = require("mongoose");
const {
  formatAmountObj,
  formatNumberStats,
} = require("../Utility/utilityFunc");

exports.AmcFormData = async (req, res) => {
  try {
    const amcData = req.body;
    const vinNumber = amcData.vehicleDetails.vinNumber;
    const email = amcData.customerDetails.email;
    const duplicateVinNumber = await AMCs.findOne({
      "vehicleDetails.vinNumber": vinNumber,
    });
    if (duplicateVinNumber) {
      return res.status(400).json({
        message: "Vehicle vin number already exists",
      });
    }

    const duplicateEmail = await AMCs.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const currentYear = new Date().getFullYear();
    const last5DigitsOfVin = vinNumber.slice(-5);
    const customId = `Raam-AMC-${currentYear}-${last5DigitsOfVin}`;
    // const amcCredit = Number(amcData.vehicleDetails?.agreementPeriod) || 0;
    let totalCredit = [];

    if (
      Array.isArray(amcData?.vehicleDetails?.custUpcomingService) &&
      amcData.vehicleDetails.custUpcomingService.length > 0
    ) {
      totalCredit = [...amcData.vehicleDetails.custUpcomingService];
    }
    const newAmc = new AMCs({
      ...amcData,
      totalCredit,
      // amcCredit,
      customId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newAmc.save();

    return res.status(201).json({
      message: "AMC saved successfully.",
      AMC: newAmc,
    });
  } catch (error) {
    console.error("Error saving AMC data:", error);
    return res.status(500).json({
      message: "Failed to save AMC data",
      error: error.message,
    });
  }
};

exports.editAmc = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Check for duplicates
    if (updatedData.vinNumber) {
      const duplicateVinNumber = await AMCs.findOne({
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
      const duplicateEmail = await AMCs.findOne({
        email: updatedData.email,
        _id: { $ne: id }, // Exclude the current AMC being updated
      });
      if (duplicateEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updateVinNumber = await AMCs.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updateVinNumber) {
      return res.status(404).json({ message: "AMC not found" });
    }

    res
      .status(200)
      .json({ message: "AMC updated successfully", data: updateVinNumber });
  } catch (err) {
    console.error("Error updating AMC data:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.addRefundAndExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenses, buybackOrSoldToRG, refundedAmount } = req.body;

    const AMCdata = await AMCs.findOne({
      "vehicleDetails.vinNumber": id,
    });

    if (!AMCdata) {
      return res.status(404).json({
        message: "AMC not found for this VIN number.",
      });
    }

    AMCdata.amcAssuredAdditionalData = {
      expenses,
      buybackOrSoldToRG,
      refundedAmount,
      submittedAt: new Date(),
    };

    await AMCdata.save();

    return res.status(200).json({
      message: "Details added successfully",
      data: AMCdata,
      status: 200,
    });
  } catch (error) {
    console.error("Error adding details:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.AmcSalesFormData = async (req, res) => {
  try {
    const amcData = req.body;
    const vinNumber = amcData.vehicleDetails.vinNumber;
    const email = amcData.customerDetails.email;
    const duplicateVinNumber = await AMCs.findOne({
      "vehicleDetails.vinNumber": vinNumber,
    });
    if (duplicateVinNumber) {
      return res.status(400).json({
        message: "Vehicle vin number already exists",
      });
    }

    const duplicateEmail = await AMCs.findOne({ email });
    if (duplicateEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const currentYear = new Date().getFullYear();
    const last5DigitsOfVin = vinNumber.slice(-5);
    const customId = `Raam-AMC-${currentYear}-${last5DigitsOfVin}`;
    // const amcCredit = Number(amcData.vehicleDetails?.agreementPeriod) || 0;
    let totalCredit = [];

    if (
      Array.isArray(amcData?.vehicleDetails?.custUpcomingService) &&
      amcData.vehicleDetails.custUpcomingService.length > 0
    ) {
      totalCredit = [...amcData.vehicleDetails.custUpcomingService];
    }
    const newAmc = new AMCs({
      ...amcData,
      totalCredit,
      // amcCredit,
      customId,
      isAmcSalesOrService: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newAmc.save();

    return res.status(201).json({
      message: "saved successfully.",
      AMC: newAmc,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({
      message: "Failed to save data",
      error: error.message,
    });
  }
};
exports.createExtendedPolicy = async (req, res) => {
  const { id } = req.params; // VIN Number

  const {
    extendedPolicyPeriod,
    additionalPrice,
    paymentCopyProof,
    upcomingPackage,
    validDate,
    validMileage,
    openForm,
    edit,
  } = req.body;

  try {
    if (!extendedPolicyPeriod || !additionalPrice || !paymentCopyProof) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const AMCdata = await AMCs.findOne({
      "vehicleDetails.vinNumber": id,
    });

    if (!AMCdata) {
      return res.status(404).json({
        message: "AMC data not found for this VIN number.",
      });
    }

    // Ensure extendedPolicy is always an array
    if (!Array.isArray(AMCdata.extendedPolicy)) {
      AMCdata.extendedPolicy = AMCdata.extendedPolicy
        ? [AMCdata.extendedPolicy]
        : [];
    }

    // Find latest pending policy index
    const pendingIndex = [...AMCdata.extendedPolicy]
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.extendedStatus === "pending")
      .sort(
        (a, b) => new Date(b.p.submittedAt) - new Date(a.p.submittedAt)
      )[0]?.i;

    if (edit === true && pendingIndex !== undefined) {
      // ✅ Update latest pending
      AMCdata.extendedPolicy[pendingIndex] = {
        ...AMCdata.extendedPolicy[pendingIndex],
        extendedPolicyPeriod,
        additionalPrice,
        paymentCopyProof,
        upcomingPackage,
        validMileage,
        validDate,
        openForm,
        updatedAt: new Date(),
      };
    } else {
      // ✅ Create new pending if:
      // - edit === false
      // - OR edit === true but no pending found
      AMCdata.extendedPolicy.push({
        extendedPolicyPeriod,
        additionalPrice,
        paymentCopyProof,
        upcomingPackage,
        validMileage,
        validDate,
        openForm,
        extendedStatus: "pending",
        submittedAt: new Date(),
      });
    }

    // AMC stays pending until approval
    AMCdata.amcStatus = "pending";

    await AMCdata.save();

    return res.status(200).json({
      message:
        edit && pendingIndex !== undefined
          ? "Extended policy updated successfully"
          : "Extended policy added successfully",
      data: AMCdata,
    });
  } catch (error) {
    console.error("Error creating/updating extended policy:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.updateAMCStatus = async (req, res) => {
  try {
    const { id, type } = req.body;
    const { reason } = req.query;
    const validTypes = [
      "pending",
      "approved",
      "rejected",
      "approvedReq",
      "reqCancel",
    ];

    // Validate policy type
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid policy type." });
    }

    const InvoiceCheck = await Invoice.findOne({ serviceId: id });

    if (InvoiceCheck && !type) {
      return res
        .status(400)
        .json({ message: "Invoice already exist for this AMC" });
    }

    // Find the policy by ID
    const AMCdata = await AMCs.findById(id);
    if (!AMCdata) {
      return res.status(404).json({ message: "AMC not found." });
    }

    const agent = await User.findById(AMCdata.createdBy);

    if (type === "approvedReq" && AMCdata.isCancelReq === "reqCancel") {
      AMCdata.isCancelReq = "approvedReq";
      await AMCdata.save();

      return res.status(200).json({
        message: "Cancellation request approved.",
        isCancelReq: AMCdata.isCancelReq,
        status: 200,
      });
    }
    if (type === "reqCancel") {
      AMCdata.isCancelReq = "reqCancel";
      await AMCdata.save();

      return res.status(200).json({
        message: "Requested for cancellation",
        isCancelReq: AMCdata.isCancelReq,
        status: 200,
      });
    }

    // Handle rejection case
    if (type === "rejected") {
      if (!reason) {
        return res
          .status(400)
          .json({ message: "Rejection reason is required." });
      }
      if (
        AMCdata.isAmcSalesOrService === true ||
        AMCdata.extendedPolicy?.openForm === true
      ) {
        await AgentPolicyRejectedEmail(
          AMCdata.vehicleDetails.salesTeamEmail,
          "User",
          reason,
          "AMC(Annual Maintenance Contract)",
          AMCdata.vehicleDetails.vinNumber,
          AMCdata.customId,
          "AMC",
          "Raam4Wheelers LLP"
        );

        await AMCs.findByIdAndDelete(id);

        // console.log(`AMCdata with ID: ${id} deleted immediately`);

        return res.status(200).json({
          message: "AMC rejected & deleted",
          status: 200,
        });
      }

      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 3);

      AMCdata.rejectionReason = reason;
      AMCdata.rejectedAt = deletionDate;
      AMCdata.amcStatus = "rejected";

      await AMCdata.save();
      console.log(
        `AMCdata with ID: ${id} scheduled for deletion with reason: ${reason}.`
      );

      await AgentPolicyRejectedEmail(
        agent.email,
        agent.agentName,
        reason,
        "AMC(Annual Maintenance Contract)",
        AMCdata.vehicleDetails.vinNumber,
        AMCdata.customId,
        "AMC",
        "Raam4Wheelers LLP"
      );

      return res.status(200).json({ message: "AMC rejected", AMCdata });
    }

    // Handle approval case
    if (type === "approved") {
      // Always ensure extendedPolicy is an array
      if (!Array.isArray(AMCdata.extendedPolicy)) {
        AMCdata.extendedPolicy = AMCdata.extendedPolicy
          ? [AMCdata.extendedPolicy]
          : [];
      }

      // Get latest extended policy entry
      const latestPolicy =
        AMCdata.extendedPolicy.length > 0
          ? AMCdata.extendedPolicy[AMCdata.extendedPolicy.length - 1]
          : null;

      // If extended policy exists and is pending → approve it
      if (latestPolicy && latestPolicy.extendedStatus === "pending") {
        latestPolicy.extendedStatus = "approved";
      }

      // 🔍 CHECK: If latest extended policy is approved → Add upcomingPackage to totalCredit
      if (latestPolicy && latestPolicy.extendedStatus === "approved") {
        // Make sure totalCredit exists and is array
        if (!Array.isArray(AMCdata.totalCredit)) {
          AMCdata.totalCredit = [];
        }

        if (Array.isArray(latestPolicy.upcomingPackage)) {
          AMCdata.totalCredit.push(...latestPolicy.upcomingPackage);
        }
      }

      // Approve AMC
      AMCdata.amcStatus = "approved";
      AMCdata.approvedAt = new Date();

      await AMCdata.save();

      return res.status(200).json({
        message: "AMC approved",
        AMCdata,
        status: 200,
      });
    }

    AMCdata.amcStatus = "pending";

    await AMCdata.save();

    return res
      .status(200)
      .json({ message: "AMC Status Changed Successfully.", AMCdata });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.disableAmc = async (req, res) => {
  try {
    const { amcId } = req.query;

    const AMCdata = await AMCs.findById(amcId);
    if (!AMCdata) {
      return res.status(404).json({ message: "AMC not found" });
    }

    if (!AMCdata.approvedAt) {
      return res.status(403).json({
        message: "AMC data must be approved before it can be cancel",
      });
    }

    const approvedDate = new Date(AMCdata.approvedAt);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (currentDate - approvedDate) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > 15) {
      return res.status(403).json({
        message: "AMC data cannot be disabled after 15 days of creation",
      });
    }

    AMCdata.isDisabled = true;
    const oneMonthFromApproval = new Date(approvedDate);
    oneMonthFromApproval.setMonth(approvedDate.getMonth() + 1);
    AMCdata.disabledAt = oneMonthFromApproval;

    await AMCdata.save();

    res
      .status(200)
      .json({ message: "AMC disabled successfully", data: AMCdata });
  } catch (err) {
    console.error("Error disabling AMC:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.amcDataById = async (req, res) => {
  const { id, status, newExtend } = req.query;

  try {
    if (!id && !status) {
      return res.status(400).json({
        message: "Please provide either AMCID, VIN Number, or status",
      });
    }

    let data = null;

    // Find by ObjectId or VIN
    if (id) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        data = await AMCs.findOne({
          _id: id,
          ...(status && { amcStatus: status }),
        });
      }

      if (!data) {
        data = await AMCs.findOne({
          "vehicleDetails.vinNumber": id,
          ...(status && { amcStatus: status }),
        });
      }
    }

    // Find by status only
    if (!id && status) {
      data = await AMCs.findOne({ amcStatus: status });
    }

    if (!data) {
      return res.status(404).json({
        message: "No matching AMC or VIN number found",
      });
    }

    let finalData = data.toObject();

    // ----------------------------------------------------
    // EXTENDED POLICY SELECTION LOGIC
    // ----------------------------------------------------

    let finalPolicy = null;

    const policies = data.extendedPolicy || [];

    if (policies.length > 0) {
      const lastItem = policies[policies.length - 1];

      if (newExtend === "true") {
        // RETURN LATEST ALWAYS (even pending)
        finalPolicy = lastItem;
      } else {
        // EXISTING LOGIC: return latest approved only
        if (lastItem.extendedStatus === "approved") {
          finalPolicy = lastItem;
        } else {
          // Find last approved if latest is pending
          const approvedList = policies.filter(
            (p) => p.extendedStatus === "approved"
          );
          finalPolicy =
            approvedList.length > 0
              ? approvedList[approvedList.length - 1]
              : null;
        }
      }
    }

    finalData.extendedPolicy = finalPolicy;

    // ----------------------------------------------------
    // SHOW AMOUNT LOGIC (USE LATEST IF newExtend=true)
    // ----------------------------------------------------

    let showAmount = 0;

    if (finalPolicy) {
      showAmount =
        finalPolicy.additionalPrice || data?.vehicleDetails?.totalAmount || 0;
    } else {
      showAmount = data?.vehicleDetails?.total || 0;
    }

    return res.status(200).json({
      message: "Data fetched successfully",
      data: {
        ...finalData,
        showAmount,
      },
    });
  } catch (error) {
    console.error("Error fetching AMC data:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAllAmcList = async (req, res) => {
  const { page = 1, limit = 10, search = "", id, status } = req.query;
  const { roleType, location } = req.user;
  try {
    // Construct query
    const query = {};
    const orConditions = [];

    if (id) {
      orConditions.push({ createdBy: id });
    }

    // Handle status
    if (status !== undefined) {
      const isBooleanStatus = status === "true" || status === "false";
      if (isBooleanStatus) {
        orConditions.push({ isDisabled: status === "true" });
      } else if (typeof status === "string") {
        orConditions.push({
          $or: [{ amcStatus: status }, { isCancelReq: status }],
        });
      }
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    if (search) {
      query["vehicleDetails.vinNumber"] = { $regex: search, $options: "i" };
    }
    if (roleType === "1" && location) {
      query["vehicleDetails.dealerLocation"] = location;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch data
    const data = await AMCs.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const totalCount = await AMCs.countDocuments(query);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No AMC Available" });
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
    console.error("Error fetching AMC data:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.AMCResubmit = async (req, res) => {
  const { amcId } = req.query;

  try {
    const AMCData = await AMCs.findOne({ _id: amcId });
    if (!AMCData) {
      return res.status(404).json({ message: "AMC not found" });
    }
    AMCData.amcStatus = "pending";
    await AMCData.save();
    return res
      .status(200)
      .json({ message: "AMC fetched successfully", AMCData });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

exports.addExpenseData = async (req, res) => {
  try {
    const serviceData = req.body;

    if (!Array.isArray(serviceData) || serviceData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please upload valid data.",
      });
    }

    const vinNumbers = serviceData.map((entry) => entry.serviceVinNumber);

    const amcRecords = await AMCs.find({
      "vehicleDetails.vinNumber": { $in: vinNumbers },
    });

    if (amcRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "AMC records not found for provided VINs.",
      });
    }

    // Map serviceData by VIN
    const serviceDataMap = new Map(
      serviceData.map((entry) => [entry.serviceVinNumber, entry.expenses])
    );

    const updates = amcRecords
      .map((amcRecord) => {
        const vinNumber = amcRecord.vehicleDetails.vinNumber;
        const expenses = serviceDataMap.get(vinNumber) || [];

        // Create unique key: serviceDate + serviceType
        const existingServiceKeys = new Set(
          amcRecord?.amcExpense?.map((e) => `${e.serviceDate}-${e.serviceType}`)
        );

        // Filter unique services only
        const uniqueServices = expenses.filter((e) => {
          const key = `${e.serviceDate}-${e.serviceType}`;
          return !existingServiceKeys.has(key);
        });

        if (uniqueServices.length === 0) return null;

        const updateFields = {
          $push: { amcExpense: { $each: uniqueServices } },
        };

        // ======================================
        // NEW AMC CREDIT REMOVAL LOGIC (FINAL)
        // Remove FREE + PMS from BOTH arrays
        // ======================================

        let upcoming = [
          ...(amcRecord.vehicleDetails.custUpcomingService || []),
        ];
        let extUpcoming = [
          ...(amcRecord.extendedPolicy?.upcomingPackage || []),
        ];

        // Normalize strings: lowercase + collapse spaces
        const normalize = (str) =>
          str?.toLowerCase().replace(/\s+/g, " ").trim();

        // Helper: remove matching service from given arr
        const removeService = (arr, incoming) => {
          const idx = arr.findIndex((x) => normalize(x) === incoming);
          if (idx !== -1) {
            arr.splice(idx, 1); // remove only FIRST matched → maintains order
            return true;
          }
          return false;
        };

        // Loop through new services and remove from both lists
        uniqueServices.forEach((svc) => {
          const incoming = normalize(svc.serviceType);

          // Try removing from custUpcomingService
          if (removeService(upcoming, incoming)) return;

          // If not found there, remove from extendedPolicy.upcomingPackage
          removeService(extUpcoming, incoming);
        });
const latestExtIndex = [...(amcRecord.extendedPolicy || [])]
  .map((p, i) => ({ p, i }))
  .filter(({ p }) => p.extendedStatus === "approved")
  .sort(
    (a, b) => new Date(b.p.submittedAt) - new Date(a.p.submittedAt)
  )[0]?.i;

        // Save updated arrays
        if (latestExtIndex !== undefined) {
          updateFields.$set = {
            "vehicleDetails.custUpcomingService": upcoming,
            [`extendedPolicy.${latestExtIndex}.upcomingPackage`]: extUpcoming,
          };
        } else {
          updateFields.$set = {
            "vehicleDetails.custUpcomingService": upcoming,
          };
        }

        return {
          updateOne: {
            filter: { _id: amcRecord._id },
            update: updateFields,
          },
        };
      })
      .filter(Boolean);

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No new unique service entries to update.",
      });
    }

    await AMCs.bulkWrite(updates);

    return res.status(200).json({
      success: true,
      message: "Service expenses added successfully.",
    });
  } catch (error) {
    console.error("Error adding service expenses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getamcStats = async (req, res) => {
  try {
    const { location, vehicleModel, startDate, endDate } = req.query;

    let filter = { amcStatus: "approved", isDisabled: false };

    if (location) filter["vehicleDetails.dealerLocation"] = location;
    if (vehicleModel) filter["vehicleDetails.model"] = vehicleModel;

    if (startDate || endDate) {
      filter["createdAt"] = {
        ...(startDate && { $gte: new Date(`${startDate}T00:00:00.000Z`) }),
        ...(endDate && { $lte: new Date(`${endDate}T23:59:59.999Z`) }),
      };
    }

    const amcDocs = await AMCs.find(filter);

    const totalamcCount = amcDocs.length;

    const totalRevenue = amcDocs.reduce(
      (sum, doc) => sum + Number(doc.vehicleDetails?.total || 0),
      0
    );

    const totalExpense = amcDocs.reduce(
      (sum, doc) =>
        sum +
        (doc.amcExpense?.reduce(
          (acc, item) => acc + Number(item.serviceTotalAmount || 0),
          0
        ) || 0),
      0
    );

    let totalPartsPrice = 0;
    let totalLabourPrice = 0;
    let totalVasPrice = 0;

    // Instead of count → store TOTAL AMOUNT
    const serviceTypeAmount = {};

    // Track PMS & Free services per VIN
    const pmsTracker = {};
    const freeTracker = {};

    amcDocs.forEach((doc) => {
      const vin = doc.vehicleDetails?.vinNumber;

      doc.amcExpense?.forEach((item) => {
        totalPartsPrice += Number(item.partsPrice || 0);
        totalLabourPrice += Number(item.labourPrice || 0);
        totalVasPrice += Number(item.vasPrice || 0);

        if (!item.serviceType) return;

        let key = item.serviceType.trim().toLowerCase();
        const amount = Number(item.serviceTotalAmount || 0);

        // ------------------ PMS LOGIC ------------------
        if (key.includes("pms")) {
          pmsTracker[vin] = (pmsTracker[vin] || 0) + 1;
          const count = pmsTracker[vin];

          if (count > 7) return;

          const suffix =
            count === 1
              ? "1st"
              : count === 2
              ? "2nd"
              : count === 3
              ? "3rd"
              : `${count}th`;

          key = `${suffix} Preventive Maintenance Service (PMS)`;
        }

        // ------------------ FREE SERVICE LOGIC ------------------
        else if (key.includes("free")) {
          freeTracker[vin] = (freeTracker[vin] || 0) + 1;

          const count = freeTracker[vin];
          if (count > 5) return;

          const suffix =
            count === 1
              ? "1st"
              : count === 2
              ? "2nd"
              : count === 3
              ? "3rd"
              : `${count}th`;

          key = `${suffix} Free Service`;
        }

        // accumulate AMOUNT instead of COUNT
        serviceTypeAmount[key] = (serviceTypeAmount[key] || 0) + amount;
      });
    });

    // ------------------ SORTING FREE SERVICES FIRST THEN PMS ------------------
    const sortedOutput = {};

    const freeOrder = ["1st", "2nd", "3rd", "4th", "5th"];
    freeOrder.forEach((num) => {
      const key = `${num} Free Service`;
      if (serviceTypeAmount[key])
        sortedOutput[key] = formatNumberStats(serviceTypeAmount[key]);
    });

    const pmsOrder = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
    pmsOrder.forEach((num) => {
      const key = `${num} Preventive Maintenance Service (PMS)`;
      if (serviceTypeAmount[key])
        sortedOutput[key] = formatNumberStats(serviceTypeAmount[key]);
    });

    // ------------------ RESPONSE ------------------
    return res.status(200).json({
      success: true,
      totalamcCount: formatNumberStats(totalamcCount),
      totalRevenue: formatNumberStats(totalRevenue),
      totalExpense: formatNumberStats(totalExpense),
      totalPartsPrice: formatNumberStats(totalPartsPrice),
      totalLabourPrice: formatNumberStats(totalLabourPrice),
      totalVasPrice: formatNumberStats(totalVasPrice),

      serviceTypeAmount: sortedOutput,
    });
  } catch (error) {
    console.error("Error fetching AMC stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getamcAssuredStats = async (req, res) => {
  try {
    const { location, vehicleModel, startDate, endDate } = req.query;

    let filter = {
      amcStatus: "approved",
      isDisabled: false,
      "customerDetails.amcType": "AMC Assured",
    };

    if (location) {
      filter["vehicleDetails.dealerLocation"] = location;
    }
    if (vehicleModel) {
      filter["vehicleDetails.model"] = vehicleModel;
    }
    if (startDate || endDate) {
      if (startDate && endDate) {
        filter["createdAt"] = {
          $gte: new Date(`${startDate}T00:00:00.000Z`),
          $lte: new Date(`${endDate}T23:59:59.999Z`),
        };
      } else if (startDate) {
        filter["createdAt"] = {
          $gte: new Date(`${startDate}T00:00:00.000Z`),
          $lte: new Date(`${startDate}T23:59:59.999Z`),
        };
      } else if (endDate) {
        filter["createdAt"] = {
          $gte: new Date(`${endDate}T00:00:00.000Z`),
          $lte: new Date(`${endDate}T23:59:59.999Z`),
        };
      }
    }

    const amcDocs = await AMCs.find(filter);
    const totalamcCount = amcDocs.length;

    const totalRevenue = amcDocs.reduce(
      (sum, doc) => sum + Number(doc?.vehicleDetails?.total || 0),
      0
    );

    const totalExpense = amcDocs.reduce(
      (sum, doc) =>
        sum +
        (doc?.amcExpense?.reduce(
          (acc, item) => acc + Number(item?.serviceTotalAmount || 0),
          0
        ) || 0),
      0
    );

    return res.status(200).json({
      success: true,
      totalamcAssured: formatNumber(totalamcCount),
      totalAmcAssuredRevenue: formatNumber(totalRevenue),
      totalAmcAssuredExpense: formatNumber(totalExpense),
    });
  } catch (error) {
    console.error("Error fetching AMC Assured stats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.downloadAmcCsv = async (req, res) => {
  try {
    // Fetch all non-disabled AMC records
    const data = await AMCs.find({ isDisabled: { $ne: true } });

    const csvData = data.map((policy) => {
      // Compute totals from amcExpense
      const totals = policy?.amcExpense?.reduce(
        (acc, item) => {
          acc.parts += Number(item?.partsPrice || 0);
          acc.vas += Number(item?.vasPrice || 0);
          acc.labour += Number(item?.labourPrice || 0);
          return acc;
        },
        { parts: 0, vas: 0, labour: 0 }
      );

      // Get latest approved extended policy
      let latestApprovedExt = null;
      if (Array.isArray(policy.extendedPolicy)) {
        const approvedPolicies = policy.extendedPolicy
          .filter((x) => x.extendedStatus === "approved")
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        latestApprovedExt = approvedPolicies[0] || null;
      }

      // Compute availableCredit list: combine upcomingService + latest approved extendedPolicy upcomingPackage
      let upcomingServiceList = [];
      if (Array.isArray(policy.vehicleDetails.custUpcomingService)) {
        upcomingServiceList = policy.vehicleDetails.custUpcomingService;
      } else if (policy.vehicleDetails.custUpcomingService) {
        upcomingServiceList = [policy.vehicleDetails.custUpcomingService];
      }

      const approvedUpcomingFromExt = Array.isArray(
        latestApprovedExt?.upcomingPackage
      )
        ? latestApprovedExt.upcomingPackage
        : [];

      const availableCreditList = [
        ...upcomingServiceList,
        ...approvedUpcomingFromExt,
      ];
      const availableCredit = availableCreditList.join(", ");

      // Compute totalCredit: existing totalCredit + latest approved upcomingPackage
      let totalCreditList = Array.isArray(policy.totalCredit)
        ? [...policy.totalCredit]
        : [];

      if (approvedUpcomingFromExt.length > 0) {
        totalCreditList.push(...approvedUpcomingFromExt);
      }

      const totalCreditData = totalCreditList.join(", ");

      return {
        "Customer Name": policy.customerDetails.customerName || "",
        Email: policy.customerDetails.email || "",
        "Pan Number": policy.customerDetails.pan || "",
        Address: policy.customerDetails.address || "",
        "Contact Number": policy.customerDetails.contact || "",
        "Gst Number": policy.customerDetails.customerGst || "",
        "Vehicle Model": policy.vehicleDetails.model || "",
        "Vin Number": policy.vehicleDetails.vinNumber || "",
        "Fuel Type": policy.vehicleDetails.fuelType || "",
        "Agreement Period": policy.vehicleDetails.agreementPeriod || "",
        "Agreement Start Date": policy.vehicleDetails.agreementStartDate || "",
        "Agreement Valid Date": policy.vehicleDetails.agreementValidDate || "",
        "Agreement Start Milage":
          policy.vehicleDetails.agreementStartMilage || "",
        "Agreement Valid Milage":
          policy.vehicleDetails.agreementValidMilage || "",
        "Maximum Valid PMS": policy.vehicleDetails.MaximumValidPMS || "",
        "Dealer Location": policy.vehicleDetails.dealerLocation || "",
        "Total Price": policy.vehicleDetails.total || "",
        "Regional Manager Name": policy.vehicleDetails.rmName || "",
        "RM Employee Id": policy.vehicleDetails.rmEmployeeId || "",
        "RM Email": policy.vehicleDetails.rmEmail || "",
        "GM Email": policy.vehicleDetails.gmEmail || "",
        "Current Status": policy.amcStatus || "",
        "Available Credit": availableCredit || "",
        "Total Credit": totalCreditData || "",
        "Parts Price": totals.parts || "",
        "Vas Price": totals.vas || "",
        "Labour Price": totals.labour || "",
      };
    });

    // Convert JSON to CSV
    const json2csv = new Parser();
    const csvDataString = json2csv.parse(csvData);

    // Prepare file path
    const folderPath = path.join(__dirname, "..", "csv");
    const filePath = path.join(folderPath, "exportedData.csv");

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    fs.writeFileSync(filePath, csvDataString);

    // Send file to client and delete after sending
    res.download(filePath, "amcData.csv", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Internal Server Error");
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting file:", unlinkErr);
        });
      }
    });
  } catch (error) {
    console.error("Error downloading CSV:", error);
    res.status(500).send("Internal Server Error");
  }
};

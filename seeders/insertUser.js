const mongoose = require('mongoose')
const connectDb = require('../db/mongoConnection');
const User = require('../model/User');
const { encryptText } = require('../Utility/utilityFunc');
const amcData = require('../amcData');
const { AMCs } = require("../model/AmcModel");
const EwPolicy = require('../model/EwModel');
const ewData = require('../ewData');
const Invoice = require('../model/InvoiceModel');
const amcDataDateUpdate = require('../amcData');

// (async () => {
//   try {
//     await connectDb()

//     const adminData = {
//       agentId: "admin@01",
//       agentName: "Dinesh Pathiwada",
//       contact: "2356856232",
//       email: "dineshpathiwada@mghyderabad.com",
//       roleType: "0",
//       password: encryptText("mghyderabad@123"),
//       role: "0",
//     };

//     const admin = new User(adminData);
//     await admin.save();
//     console.log("Admin data saved successfully!");
//   } catch (error) {
//     console.error("Error saving admin data:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// })();


const insertAMCData = async (data) => {
  await connectDb();
  try {
    const flatData = data.flat(); // Flatten the array if nested

    // Extract VIN numbers correctly using bracket notation
    const vinNumbers = flatData.map((item) => item["vehicleDetails.vinNumber"]).filter(Boolean);

    if (vinNumbers.length === 0) {
      console.log("No VIN numbers found in data.");
      return;
    }

    // Check if VINs already exist in the database
    const existingVINs = await AMCs.find({ "vehicleDetails.vinNumber": { $in: vinNumbers } })
      .select("vehicleDetails.vinNumber");

    const existingVINSet = new Set(existingVINs.map((item) => item["vehicleDetails.vinNumber"]));

    // Helper function to format date to YYYY-MM-DD
    const formatDate = (dateStr) => {
      if (!dateStr || typeof dateStr !== "string") {
        console.error("Invalid date input:", dateStr);
        return null;
      }
    
      dateStr = dateStr.trim();
      const parts = dateStr.split("-"); // Expecting "DD-MM-YYYY"
    
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const formattedDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD string
    
        console.log(`Converted ${dateStr} → ${formattedDate}`); // Debugging
        return formattedDate; // Return as a string
      }
    
      console.error("Invalid date format:", dateStr);
      return null;
    };
    

    // Helper function to convert agreementStartDate to ISO format for `createdBy`
    const toISODate = (dateStr) => {
      const formattedDate = formatDate(dateStr);
      return formattedDate ? new Date(formattedDate).toISOString() : null;
    };

    // Filter only new VINs
    const newData = flatData.filter((item) => !existingVINSet.has(item["vehicleDetails.vinNumber"]));

    // Generate `customId` and `amcCredit` for each record before inserting
    const currentYear = new Date().getFullYear();
    const preparedData = newData.map((item) => {
      const vinNumber = item["vehicleDetails.vinNumber"] || "";
      const last5DigitsOfVin = vinNumber.slice(-5);
      const customId = `Raam-AMC-${currentYear}-${last5DigitsOfVin}`;
      const amcCredit = Number(item["vehicleDetails.agreementPeriod"]) || 0;
    
      const formattedStartDate = item["vehicleDetails.agreementStartDate"]
      const formattedValidDate = item["vehicleDetails.agreementValidDate"]
    
      console.log(`Before inserting - VIN: ${vinNumber}, Start: ${formattedStartDate}, Valid: ${formattedValidDate}`);
    
      return {
        ...item,
        // vehicleDetails: {
        //   ...item["vehicleDetails"],
        //   agreementStartDate: formattedStartDate, // Ensure it is used
        //   agreementValidDate: formattedValidDate, // Ensure it is used
        // },
        amcStatus: "pending",
        customId,
        amcCredit,
        createdAt: formattedStartDate,
        createdBy: "679c6740a829dea6d21072aa",
      };
    });
    
    // Log final data before inserting into MongoDB
    console.log("Final prepared data:", JSON.stringify(preparedData, null, 2));
    
    if (preparedData.length > 0) {
      await AMCs.insertMany(preparedData);
      console.log(`${preparedData.length} new records inserted successfully!`);
    } else {
      console.log("No new records to insert. All VIN numbers already exist.");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
// insertAMCData(amcData)




const deleteAMCData = async (amcData) => {
  await connectDb();
  try {
    if (!Array.isArray(amcData) || amcData.length === 0) {
      console.log("No data provided for deletion.");
      return;
    }

    // Extract VIN numbers correctly
    const vinNumbers = amcData.map(item => {
      console.log("Checking item:", item);
      return item["vehicleDetails.vinNumber"]; // Corrected
    }).filter(Boolean);

    console.log("Extracted VINs:", vinNumbers);

    if (vinNumbers.length === 0) {
      console.log("No valid VIN numbers found in provided data.");
      return;
    }

    // Delete records where VIN matches any in the extracted array
    const result = await AMCs.deleteMany({ "vehicleDetails.vinNumber": { $in: vinNumbers } });

    if (result.deletedCount > 0) {
      console.log(`${result.deletedCount} records deleted successfully!`);
    } else {
      console.log("No matching records found for deletion.");
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

// Example Usage
// deleteAMCData(amcData);








const insertEwData = async (data) => {
  await connectDb();
  try {
    const flatData = data.flat(); // Flatten the array if nested

    // Extract VIN numbers correctly using bracket notation
    const vinNumbers = flatData.map((item) => item["vehicleDetails.vinNumber"]).filter(Boolean);

    if (vinNumbers.length === 0) {
      console.log("No VIN numbers found in data.");
      return;
    }

    // Check if VINs already exist in the database
    const existingVINs = await EwPolicy.find({ "vehicleDetails.vinNumber": { $in: vinNumbers } })
      .select("vehicleDetails.vinNumber");

    const existingVINSet = new Set(existingVINs.map((item) => item["vehicleDetails.vinNumber"]));



    // Filter only new VINs
    const newData = flatData.filter((item) => !existingVINSet.has(item["vehicleDetails.vinNumber"]));

    // Generate `customId` and `amcCredit` for each record before inserting
    const currentYear = new Date().getFullYear();
    const preparedData = newData.map((item) => {
      const vinNumber = item["vehicleDetails.vinNumber"] || "";

      const last5DigitsOfVin = vinNumber.slice(-5);
      const customId = `360-EW-${currentYear}-${last5DigitsOfVin}`;
    

    
      console.log(`Before inserting - VIN: ${vinNumber}`);
      let createdAt = new Date(); // Default to current date
      if (item?.ewDetails?.policyDate) {
        const dateParts = item.ewDetails.policyDate.split("-"); // ["yyyy", "mm", "dd"]
        if (dateParts.length === 3) {
          const [year, month, day] = dateParts;
          createdAt = new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
        } else {
          console.warn(`Invalid policyDate format: ${item.ewDetails.policyDate}`);
        }
      }

      console.log(`Before inserting - VIN: ${vinNumber}, CreatedAt: ${createdAt}`);
      return {
        ...item,
        vehicleDetails: {
          ...item["vehicleDetails"],
   
        },
        ewDetails:{
          ...item["ewDetails"],
        },
        customId,
        createdAt,
        createdBy: "679c6740a829dea6d21072aa",
      };
    });
    
    // Log final data before inserting into MongoDB
    console.log("Final prepared data:", JSON.stringify(preparedData, null, 2));
    
    if (preparedData.length > 0) {
      await EwPolicy.insertMany(preparedData);
      console.log(`${preparedData.length} new records inserted successfully!`);
    } else {
      console.log("No new records to insert. All VIN numbers already exist.");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
// insertEwData(ewData)


const deleteEwDataByVin = async (data) => {
  await connectDb();
  try {
    // Extract VIN numbers from the provided data array
    const vinNumbers = data.map((item) => item["vehicleDetails.vinNumber"]).filter(Boolean);

    if (vinNumbers.length === 0) {
      console.log("No VIN numbers found for deletion.");
      return;
    }

    // Delete records where "vehicleDetails.vinNumber" matches any in the array
    const result = await Invoice.deleteMany({
      $and: [
        { "vehicleDetails.vinNumber": { $in: vinNumbers } },
        { serviceType: "EwPolicy" }
      ]
    });
    console.log(`${result.deletedCount} records deleted successfully!`);
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};
// deleteEwDataByVin(ewData)




const updateWarrantyAmountByVin = async (data) => {
  await connectDb();
  try {
    // Extract vinNumber and warrantyAmount from provided data
    const updates = data
      .map((item) => ({
        vinNumber: item["vehicleDetails.vinNumber"],
        warrantyAmount: item["ewDetails.warrantyAmount"],
      }))
      .filter((item) => item.vinNumber && item.warrantyAmount); // Ensure both exist

    if (updates.length === 0) {
      console.log("No valid VIN numbers and warranty amounts found.");
      return;
    }

    // Update each matching document
    for (const { vinNumber, warrantyAmount } of updates) {
      const result = await EwPolicy.updateOne(
        { "vehicleDetails.vinNumber": vinNumber }, // Find document by VIN
        { $set: { "ewDetails.warrantyAmount": warrantyAmount } } // Update warranty amount
      );

      if (result.matchedCount > 0) {
        console.log(`Updated warrantyAmount for VIN: ${vinNumber}`);
      } else {
        console.log(`No matching record found for VIN: ${vinNumber}`);
      }
    }
  } catch (error) {
    console.error("Error updating warranty amounts:", error);
  }
};

// updateWarrantyAmountByVin(ewData);






const dateUpdateAmc = async (amcData) => {
  await connectDb();

  try {
    for (const amc of amcData) {
      const vin = amc["vehicleDetails.vinNumber"];
      const startDate = amc["vehicleDetails.agreementStartDate"]
      const validDate = amc["vehicleDetails.agreementValidDate"]

      const result = await AMCs.updateOne(
        { "vehicleDetails.vinNumber": vin },
        {
          $set: {
            "vehicleDetails.agreementStartDate": startDate,
            "vehicleDetails.agreementValidDate": validDate,
          },
        }
      );

      console.log(`VIN ${vin} - Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    }
  } catch (err) {
    console.error('Error updating documents:', err);
  } finally {
    mongoose.disconnect();
  }
};

// dateUpdateAmc(amcDataDateUpdate);






const invoiceAmountFix = async () => {
  await connectDb();

  try {
    const targetDate = new Date('2025-04-05T00:00:00.000Z');

    const invoiceData = await Invoice.find({
      createdAt: { $lt: targetDate }
    });

    if (!invoiceData.length) {
      console.log('No invoices found before 5 April 2025.');
      return;
    }

    for (const invoice of invoiceData) {
      const vehicle = invoice.vehicleDetails;

      if (vehicle && vehicle.gstAmount) {
        const gstAmount = vehicle.gstAmount;

        // Step 1: Calculate base amount (before GST)
        const baseAmount = Number((gstAmount / 1.18).toFixed(2));

        // Step 2: Calculate total GST amount
        const totalGst = Number((gstAmount - baseAmount).toFixed(2));

        // Step 3: Split GST into CGST and SGST (equal halves)
        let cgst = Number((totalGst / 2).toFixed(2));
        let sgst = Number((totalGst - cgst).toFixed(2)); // Forces exact sum
        


        // Step 4: Round base and totalAmount
        const roundedBaseAmount = +baseAmount.toFixed(2);
        const totalAmount = +(roundedBaseAmount + cgst + sgst).toFixed(2);

        // Update invoice fields
        invoice.vehicleDetails.cgst = cgst;      // 9%
        invoice.vehicleDetails.sgst = sgst;     // 9%
        invoice.vehicleDetails.totalAmount = totalAmount;
        invoice.vehicleDetails.gstAmount = baseAmount;


        await invoice.save();

        console.log(`✅ Updated Invoice ID: ${invoice._id}`);
        console.log(`GST Amount (18% included): ₹${gstAmount}`);
        console.log(`Base Amount: ₹${roundedBaseAmount}`);
        console.log(`CGST (9%): ₹${cgst}`);
        console.log(`SGST (9%): ₹${sgst}`);
        console.log(`Total Amount (final): ₹${totalAmount}`);
        console.log('---------------------------');
      }
    }

  } catch (err) {
    console.error('❌ Error processing invoices:', err);
  } finally {
    mongoose.disconnect();
  }
};

// invoiceAmountFix();


const aboveFiveAprInvoiceAmtFix = async () => {
  await connectDb();

  try {
    const targetDate = new Date('2025-04-05T00:00:00.000Z');

    const invoiceData = await Invoice.find({
      createdAt: { $gte: targetDate } // changed to fetch invoices created ON or AFTER 5 April 2025
    });

    if (!invoiceData.length) {
      console.log('No invoices found on or after 5 April 2025.');
      return;
    }

    for (const invoice of invoiceData) {
      const vehicle = invoice.vehicleDetails;

      if (vehicle && vehicle.totalAmount) {
        const totalAmount = vehicle.totalAmount;

        // Step 1: Calculate base amount (excluding 18% GST)
        const baseAmount = Number((totalAmount / 1.18).toFixed(2));

        // Step 2: Calculate total GST amount
        const totalGst = Number((totalAmount - baseAmount).toFixed(2));

        // Step 3: Split GST into CGST and SGST
        let cgst = Number((totalGst / 2).toFixed(2));
        let sgst = Number((totalGst - cgst).toFixed(2)); // Ensures totalGst = cgst + sgst
        const roundedBaseAmount = +baseAmount.toFixed(2);
        const totalAmountNew= +(roundedBaseAmount + cgst + sgst).toFixed(2);
        // Update invoice fields
        invoice.vehicleDetails.cgst = cgst;      // 9%
        invoice.vehicleDetails.sgst = sgst;      // 9%
        invoice.vehicleDetails.gstAmount = baseAmount;
        invoice.vehicleDetails.totalAmount = totalAmountNew;

        await invoice.save();

        console.log(`✅ Updated Invoice ID: ${invoice._id}`);
        console.log(`Total Amount (with 18% GST): ₹${totalAmount}`);
        console.log(`Base Amount: ₹${baseAmount}`);
        console.log(`CGST (9%): ₹${cgst}`);
        console.log(`SGST (9%): ₹${sgst}`);
        console.log(`GST Amount (total): ₹${totalGst}`);
        console.log('---------------------------');
      }
    }

  } catch (err) {
    console.error('❌ Error processing invoices:', err);
  } finally {
    mongoose.disconnect();
  }
};

// aboveFiveAprInvoiceAmtFix();

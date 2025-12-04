
const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer')
const fs = require('fs');
const { formatIsoDate } = require('../Utility/utilityFunc');

const renderEmailTemplate = async (data, pathData, typeData) => {
  try {
    const templatePath = path.join(__dirname, `${pathData}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error('Template file does not exist.');
    }

    const template = fs.readFileSync(templatePath, 'utf-8');
    const evModels = ["Windsor", "Comet", "ZS EV"];
    const nonEvModels = ["Hector", "Astor", "Gloster"];
    const allModels = [...evModels,...nonEvModels];
    let pageTypeAData;
    let pageTypeBData;
    if (typeData === "ewpolicy" && data?.ewDetails) {
      const comprehensiveData = data.ewDetails.planSubType === "Comprehensive";
      const standardData = data.ewDetails.planSubType === "Standard";
    
       pageTypeAData = (() => {
        if (comprehensiveData && data?.ewDetails?.planType === "Type A" || comprehensiveData && data?.ewDetails?.planType === "Type B" ) {
          if (evModels.some(model => data?.vehicleDetails?.vehicleModel.includes(model))) {
            return "defaultPages";
          } else if (nonEvModels.some(model => data?.vehicleDetails?.vehicleModel.includes(model))) {
            return "typeTwoPages";
          }
        }
        return null;
      })();
    
       pageTypeBData = (() => {
       
   
        if (comprehensiveData && data?.ewDetails?.planType === "Type B" || comprehensiveData && data?.ewDetails?.planType === "Type A" ) {
          if (nonEvModels.some(model => data?.vehicleDetails?.vehicleModel.includes(model))) {
            return "typeTwoPages";
          }
        } else if (standardData && data?.ewDetails?.planType === "Type B") {
          if (allModels.some(model => data?.vehicleDetails?.vehicleModel.includes(model))) {
            return "typeThreePages";
          }
        }
        return null;
      })();
    console.log(pageTypeAData, pageTypeBData, "dataCheck");

    }
    
   let totalPrice;
    let sgstAmount;
    let cgstAmount;

    if (data.extendedPolicy?.additionalPrice) {
      // CASE 1: Extended policy
      totalPrice = Number(data.extendedPolicy.additionalPrice);

      sgstAmount = totalPrice * 0.09; // 9%
      cgstAmount = totalPrice * 0.09; // 9%

    } else {
      // CASE 2: AMC normal GST
      totalPrice = Number(data.vehicleDetails?.gstAmount || 0);

      sgstAmount = Number(data.vehicleDetails?.sgst || 0);
      cgstAmount = Number(data.vehicleDetails?.cgst || 0);
    }

    const afterGstAmount = totalPrice + sgstAmount + cgstAmount;
      
    return ejs.render(template, {
      data: data,
      totalPrice,
      sgstAmount,
      cgstAmount,
      afterGstAmount,
      date: formatIsoDate(data?.createdAt),
      titleData: typeData === "ewpolicy" ?    "360 CAR PROTECT INDIA LLP": "RAAM4WHEELERS LLP",
      addressData: typeData === "ewpolicy" ? "3-4-138, 138/A Flat No.501, Royal Elegance, Himayathnagar, Barkatpura, Hyderabad, Hyderabad,Telangana, 500027, Ph: 7799935258, Email Id: ew@360carprotect.in GSTIN: 36AADFZ5034G1Z5, PAN: AADFZ5034G"
      : "8-2-120/86/10,10A,11B,11C and 11D, Opp: Hotel Park Hyatt,   Road Number 2, Banjara Hills Hyderabad, PIN-500033, Ph: 7799935258, Email Id: hyderabad.crmhead@mgdealer.co.in, Website: https://www.mghyderabad.co.in,  GSTIN: 36AAYFR9176L1ZY, CIN NO: AAN-7654, PAN: AAYFR9176L",
      imageData: typeData === "ewpolicy" ? "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2F360.png?alt=media&token=5221f392-a303-4a35-8ec5-c823751059c4" :pageTypeBData === "typeThreePages" ? "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FType%203%20Page%204.png?alt=media&token=bea83844-81ef-4df2-80f6-b785a16fbe7d" :"https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FRG%20Stamp.jpeg?alt=media&token=fc1bdb53-20bd-46b3-963c-7e8e507fceb1",
      imageDataOne:typeData !== "ewpolicy" &&"https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FMG-symbol-black-2010-1920x1080-removebg-preview.png?alt=media&token=4df87beb-002a-4956-9ad4-36902a5a6bdd",
      pageFourData: pageTypeAData === "defaultPages"  ? "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FPage%204%20EW.png?alt=media&token=06bb2e27-f8f8-4a74-916a-2d465666b522" :     pageTypeAData === "typeTwoPages" || pageTypeBData === "typeTwoPages" ? "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FType%202%20Page%204.png?alt=media&token=df965d87-726e-47f3-b787-ff1d535b3124" : pageTypeBData === "typeThreePages" ? "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FType%203%20Page%204.png?alt=media&token=bea83844-81ef-4df2-80f6-b785a16fbe7d" : "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FPage%204%20EW.png?alt=media&token=06bb2e27-f8f8-4a74-916a-2d465666b522",
      pageFiveData: pageTypeBData === "typeTwoPages" ? "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FType%202%20Page%205.png?alt=media&token=99b3037a-5820-4d13-afb0-128415151ac8" : pageTypeBData === "typeThreePages" ? "" :  "https://firebasestorage.googleapis.com/v0/b/car-protect-99a26.firebasestorage.app/o/files%2FRG%20Portal%2FPage%205%20EW.png?alt=media&token=2963714d-cc83-472c-9469-24447a65032b"
    });
  } catch (error) {
    console.error('Error rendering email template:', error);
    throw error;
  }
};



const generatePdf = async (html, pdfType) => {
  let browser;
  try {
    // Launch Puppeteer with error-resilient options
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
      timeout: 180000, // Increased timeout
    });

    //  browser = await puppeteer.launch({  //production code for aws ec2 
    //   executablePath: '/usr/bin/chromium-browser', // Path to system-installed Chromium
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });
    

    const page = await browser.newPage();

    // Increase timeout settings
    await page.setDefaultTimeout(180000);
    await page.setDefaultNavigationTimeout(180000);
  // Block unnecessary requests (images, fonts, styles)
  // await page.setRequestInterception(true);
  // page.on("request", (req) => {
  //   if (["image", "stylesheet", "font"].includes(req.resourceType())) {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });
    
  await page.setContent(html, { waitUntil: 'load' });

  let pdfBuffer;
  if (pdfType === "pdfInvoice") {
    pdfBuffer = await page.pdf({ format: "A3", printBackground: true });
  } else if (pdfType === "pdfbuyBack") {
    pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  } else if (pdfType === "pdfEwPolicy") {
    pdfBuffer = await page.pdf({ format: "A2", printBackground: true });
  } else if (pdfType === "pdfAmc") {
    pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  }

  // console.log("PDF generated successfully!");
  return pdfBuffer;
} catch (error) {
  console.error("Error generating PDF:", error);
  throw error;
} finally {
  if (browser) {
    await browser.close();
  }
}
};

module.exports = {
  renderEmailTemplate,
  generatePdf,
};

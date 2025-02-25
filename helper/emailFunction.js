const dotenv = require("dotenv");
const { sendEmail } = require("../Utility/emailUtil");

dotenv.config();

<<<<<<< HEAD
=======
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
const COMMON_EMAIL = process.env.COMMON_EMAIL;
const sendUserEmail = async ({
  to,
  subject,
  htmlContent,
  pdfPolicyBuffer,
  pdfInvoiceBuffer,
  policyFilename,
  invoiceFilename,
<<<<<<< HEAD
  policyType,
  ccEmails,
 
}) => {
  // if (to && subject && htmlContent) {
  await sendEmail({
    to,
    subject,
    htmlContent,
    pdfPolicyBuffer,
    pdfInvoiceBuffer,
    policyFilename,
    invoiceFilename,
    policyType,
    ccEmails,
 
    
  });
=======
  rmEmail,
  gmEmail,
  policyType,
  agentEmail
}) => {
  // if (to && subject && htmlContent) {
    await sendEmail({
      to,
      subject,
      htmlContent,
      pdfPolicyBuffer,
      pdfInvoiceBuffer,
      policyFilename,
      invoiceFilename,
      rmEmail,
      gmEmail,
      policyType,
      agentEmail
    });
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  // } else {
  //   throw new Error("Missing required parameters to send email");
  // }
};

const getEmailTemplate = (
  type,
  email,
  password,
  customerName,
  agentName,
  reason,
  policyType,
  vinNumber,
<<<<<<< HEAD
  invoiceId,
  policyId,
  companyName
) => {
  let template;
  let userName = agentName || "user";
  let clientName = customerName || "customer";
=======
  invoiceId
  

  
) => {
  let template;
  let userName = agentName || "user";
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  const styles = `
    font-family: Arial, sans-serif; 
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    background-color: rgba(255, 255, 255, 0.7); /* Transparent with opacity 0.7 */
    margin: 5% 10%;
    padding: 10px 5px;
    text-align: left;
    display: inline-block;
  `;

  switch (type) {
    case "credentials":
      template = `
        <div style="text-align: center;">
          <div style="${styles}">
            <p>Dear ${userName},</p>
            <p>Your account has been successfully created on RaamGroup. You can now log in and start managing customers effortlessly.</p>
            <p>Login Details:</p>
          
<<<<<<< HEAD
            <p>Portal Link - <a href="https://360carprotect.in/raamgroup-portal/login">Raam4Wheelers LLP Portal</a></p>
=======
            <p>Portal Link - <a href="https://360carprotect.in/raamgroup-portal/login">RaamGroup Wheelers LLP Portal</a></p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
            <p>Email ID - ${email}</p>
            <p>Password: - ${password}</p>
            <p>If you need assistance, feel free to contact us.</p></br>
            <p>Best regards,</p>
<<<<<<< HEAD
            <p>Raam4Wheelers LLP</p>
=======
            <p>RaamGroup Wheelers LLP</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
          </div>
        </div>
      `;
      break;
    case "updatedCredentials":
      template = `
          <div style="text-align: center;">
            <div style="${styles}">
              <p>Dear ${userName},</p>
              <p>Your account details on RaamGroup Portal have been updated successfully.</p>
              <p>Updated Details:</p>
            
              <p>Email ID - ${email}</p>
              <p>Password: - ${password}</p>
<<<<<<< HEAD
              <p>Please use these credentials to log in to the portal:<a href="https://360carprotect.in/raamgroup-portal/login">Raam4Wheelers LLP Portal</a></p>
              <p>If need any assistance, please contact us immediately.</p></br>
              <p>Best regards,</p>
              <p>Raam4Wheelers LLP</p>
=======
              <p>Please use these credentials to log in to the portal:<a href="https://360carprotect.in/raamgroup-portal/login">RaamGroup Wheelers LLP Portal</a></p>
              <p>If need any assistance, please contact us immediately.</p></br>
              <p>Best regards,</p>
              <p>RaamGroup Wheelers LLP</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
            </div>
          </div>
        `;
      break;
    case "accountsTeamCredentials":
      template = `
            <div style="text-align: center;">
              <div style="${styles}">
                <p>Dear ${userName},</p>
                <p>Your account has been created on RaamGroup Portal to manage and process policies efficiently. You can now log in to approve/reject all the policies and generate invoices.</p>
                <p>Login Details:</p>
              
<<<<<<< HEAD
                <p>Portal Link - <a href="https://360carprotect.in/raamgroup-portal/login">Raam4Wheelers LLP Portal</a></p>
=======
                <p>Portal Link - <a href="https://360carprotect.in/raamgroup-portal/login">RaamGroup Wheelers LLP Portal</a></p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
                <p>Email ID - ${email}</p>
                <p>Password: - ${password}</p>
                <p>If you need any assistance, feel free to reach out.</p></br>
                <p>Best regards,</p>
<<<<<<< HEAD
                <p>Raam4Wheelers LLP</p>
=======
                <p>RaamGroup Wheelers LLP</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
              </div>
            </div>
          `;
      break;
    case "updatedTeamCredentials":
      template = `
              <div style="text-align: center;">
                <div style="${styles}">
                  <p>Dear ${userName},</p>
                  <p>Your account details on RaamGroup Portal have been successfully updated.</p>
                  <p>Updated Details:</p>
                
                  <p>Email ID - ${email}</p>
                  <p>Password: - ${password}</p>
<<<<<<< HEAD
                  <p>Please use these credentials to log in to the portal:<a href="https://360carprotect.in/raamgroup-portal/login">Raam4Wheelers LLP Portal</a></p>
                  <p>If you have any questions or did not request this update, please contact us immediately.</p></br>
                  <p>Best regards,</p>
                  <p>Raam4Wheelers LLP</p>
=======
                  <p>Please use these credentials to log in to the portal:<a href="https://360carprotect.in/raamgroup-portal/login">RaamGroup Wheelers LLP Portal</a></p>
                  <p>If you have any questions or did not request this update, please contact us immediately.</p></br>
                  <p>Best regards,</p>
                  <p>RaamGroup Wheelers LLP</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
                </div>
              </div>
            `;
      break;
    case "commonTemp":
      template = `
                <div style="text-align: center;">
                  <div style="${styles}">
                    <p>Dear ${userName},</p>
                    <p>Please find below the details of the customer and the related documents for your reference.</p>
                    <p>Customer Details:</p>
                      <p>Name: ${customerName}</p>
                    <p>Policy Type: ${policyType}</p>
<<<<<<< HEAD
                    <p>Policy Id: ${policyId}</p>
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
                    <p>Policy Vin Number: ${vinNumber}</p>
                    <p>Invoice Number: ${invoiceId}</p>
                    <p>If you require any further information or assistance, please let us know.</p>
                    <p>Best regards,</p>
<<<<<<< HEAD
                    <p>Raam4Wheelers LLP</p>
=======
                    <p>RaamGroup Wheelers LLP</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
                  </div>
                </div>
              `;
      break;

<<<<<<< HEAD
=======
   

  
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    case "customerDoc":
      template = `
                    <div style="text-align: center;">
                      <div style="${styles}">
<<<<<<< HEAD
                        <p>Dear ${clientName},</p>
                        <p>Thank you for choosing ${companyName}. Please find below the details of your policy and invoice for your reference.</p>
                        <p>Policy and Invoice Details:</p>
                        <p>Policy Type: ${policyType}</p>
                        <p>Policy Id: ${policyId}</p>
=======
                        <p>Dear ${userName},</p>
                        <p>Thank you for choosing RaamGroup Wheelers LLP. Please find below the details of your policy and invoice for your reference.</p>
                        <p>Policy and Invoice Details:</p>
                        <p>Policy Type: ${policyType}</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
                        <p>Policy Vin Number: ${vinNumber}</p>
                        <p>Invoice Number: ${invoiceId}</p>
                        <p>If you have any questions or need further assistance, feel free to contact us.</p>
                        <p>Best regards,</p>
<<<<<<< HEAD
                        <p>${companyName}</p>
=======
                        <p>RaamGroup Wheelers LLP</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
                      </div>
                    </div>
                  `;
      break;

    case "AgentPolicyRejected":
      template = `
          <div style="text-align: center;">
            <div style="${styles}">
              <p>Dear ${userName},</p>
              <p>The ${policyType}, you submitted for approval has been rejected.</p>
              <p>Rejection Details:</p>
<<<<<<< HEAD
              <p>Policy Id: ${policyId} </p>
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
              <p>Policy Vin Number: ${vinNumber} </p>
              <p>Reason for Rejection: ${reason}</p>
              <p>Please review the feedback and make the necessary corrections before resubmitting. For further assistance, feel free to reach out.</p>
              </br>
              <p>Best Regards,</p>
              <p>Accounts Team</p>
<<<<<<< HEAD
              <p>${companyName}</p>
=======
              <p>RaamGroup Wheelers LLP</p>
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
            </div>
          </div>
        `;
      break;

    default:
      throw new Error("Invalid email type");
  }
  return template;
};

exports.sendAgentCredEmail = async (userEmail, password, name) => {
<<<<<<< HEAD
  const subject = "Welcome to RaamGroup Portal– Your Account is Ready!";
=======

  const subject =
    "Welcome to RaamGroup Portal– Your Account is Ready!";
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  const htmlContent = getEmailTemplate(
    "credentials",
    userEmail, // email
    password, // password
<<<<<<< HEAD
    null, // customerName
=======
    null, // customerName 
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    name, // agentName
    null, // reason
    null, // policyType
    null, // vinNumber
    null // invoiceId
<<<<<<< HEAD
=======
   
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  );
  await sendUserEmail({
    to: userEmail,
    subject,
    htmlContent,
    optional: null,
    optional: null,
    optional: null,
  });
};
<<<<<<< HEAD
exports.sendAgentUpdatedEmail = async (userEmail, password, name) => {
  const subject = "Your Account details Have Been Updated";
=======
  exports.sendAgentUpdatedEmail = async (userEmail, password, name) => {

  const subject =
    "Your Account details Have Been Updated";
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  const htmlContent = getEmailTemplate(
    "updatedCredentials",
    userEmail, // email
    password, // password
<<<<<<< HEAD
    null, // customerName
=======
    null, // customerName 
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    name, // agentName
    null, // reason
    null, // policyType
    null, // vinNumber
    null // invoiceId
<<<<<<< HEAD
  );
=======

   
  );
  
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

  await sendUserEmail({
    to: userEmail,
    subject,
    htmlContent,
    optional: null,
    optional: null,
    optional: null,
  });
};

exports.sendTeamCredEmail = async (userEmail, password, name) => {
<<<<<<< HEAD
  const subject = "Your Account on RaamGroup Portal is Ready";
=======

  const subject =
    "Your Account on RaamGroup Portal is Ready";
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  const htmlContent = getEmailTemplate(
    "accountsTeamCredentials",
    userEmail, // email
    password, // password
<<<<<<< HEAD
    null, // customerName
=======
    null, // customerName 
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    name, // agentName
    null, // reason
    null, // policyType
    null, // vinNumber
    null // invoiceId
<<<<<<< HEAD
=======

   
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  );
  await sendUserEmail({
    to: userEmail,
    subject,
    htmlContent,
    optional: null,
    optional: null,
    optional: null,
  });
};

exports.sendTeamUpdatedEmail = async (userEmail, password, name) => {
<<<<<<< HEAD
  const subject = "Your Account details Have Been Updated";
=======

  const subject =
    "Your Account details Have Been Updated";
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  const htmlContent = getEmailTemplate(
    "updatedTeamCredentials",
    userEmail, // email
    password, // password
<<<<<<< HEAD
    null, // customerName
=======
    null, // customerName 
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    name, // agentName
    null, // reason
    null, // policyType
    null, // vinNumber
    null // invoiceId
<<<<<<< HEAD
  );
=======

   
  );
  
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

  await sendUserEmail({
    to: userEmail,
    subject,
    htmlContent,
    optional: null,
    optional: null,
    optional: null,
  });
};
<<<<<<< HEAD
exports.AgentPolicyRejectedEmail = async (
  userEmail,
  name,
  reason,
  policyType,
  vinNumber,
  policyId,
  emailType,
  companyName
) => {
  const subject = "Policy Submission Rejected";
  const htmlContent = getEmailTemplate(
    "AgentPolicyRejected",
    userEmail, // email
    null, // password
    null, // customerName
=======
exports.AgentPolicyRejectedEmail = async (userEmail, name, reason, policyType, vinNumber) => {

  const subject =
    "Policy Submission Rejected";
  const htmlContent = getEmailTemplate(
    "AgentPolicyRejected",
    userEmail, // email
    password, // password
    null, // customerName 
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    name, // agentName
    reason, // reason
    policyType, // policyType
    vinNumber, // vinNumber
<<<<<<< HEAD
    null, // invoiceId
    policyId,
    companyName
  );
=======
    null // invoiceId

   
  );
  
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

  await sendUserEmail({
    to: userEmail,
    subject,
    htmlContent,
    optional: null,
    optional: null,
    optional: null,
<<<<<<< HEAD
    optional: null,
    optional: null,
    optional: null,
    emailType,
  });
};
exports.sendDocEmail = async (
=======
  });
};
exports.sendDocEmail = async (

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  policyType,
  vinNumber,
  invoiceId,
  customerName,
  pdfPolicyBuffer,
  pdfInvoiceBuffer,
  policyFilename,
  invoiceFilename,
  rmEmail,
  gmEmail,
<<<<<<< HEAD
  agentEmail,
  agentName,
  policyId
) => {
  const subject = "Customer Policy and Invoice Details";
  const recipients = [
    { email: rmEmail, salutation: "Relationship Manager/ Service Advisor" },
    { email: gmEmail, salutation: "General Manager" },
    { email: COMMON_EMAIL, salutation: "Admin" },
    { email: agentEmail, salutation: agentName || "user" },
  ];
  const validRecipients = recipients.filter((recipient) => recipient.email);

  for (const recipient of validRecipients) {
    if (recipient.email) {
      const htmlContent = getEmailTemplate(
        "commonTemp",
        null, // email
        null, // password
        customerName, // customerName
        recipient.salutation, // agentName
        null, // reason
        policyType, // policyType
        vinNumber, // vinNumber
        invoiceId, // invoiceId
        policyId
      );

      await sendUserEmail({
        to: recipient.email,
        subject,
        htmlContent,
        pdfPolicyBuffer,
        pdfInvoiceBuffer,
        policyFilename,
        invoiceFilename,
    
        policyType,
      });
    }
  }
};

exports.sendCustomerDocEmail = async (
  customerName,
=======
  agentEmail
) => {
  const subject = "Customer Policy and Invoice Details";
  const htmlContent = getEmailTemplate(
    "commonTemp",
    COMMON_EMAIL, // email
    null, // password
    customerName, // customerName 
    null, // agentName
    null, // reason
    policyType, // policyType
    vinNumber, // vinNumber
    invoiceId // invoiceId
  );

  await sendUserEmail({
    to: COMMON_EMAIL, 
    subject,
    htmlContent,
    pdfPolicyBuffer,
    pdfInvoiceBuffer,
    policyFilename,
    invoiceFilename,
    rmEmail,
    gmEmail,
    policyType,
    agentEmail

  });
};

exports.sendCustomerDocEmail = async (
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  userEmail,
  policyType,
  vinNumber,
  invoiceId,
  pdfPolicyBuffer,
  pdfInvoiceBuffer,
  policyFilename,
  invoiceFilename,
<<<<<<< HEAD
  policyId,
  rmEmail,
  gmEmail,
  agentEmail,
  companyName,

) => {
 

=======
) => {
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  const subject = "Your Policy and Invoice Details";
  const htmlContent = getEmailTemplate(
    "customerDoc",
    userEmail, // email
    null, // password
<<<<<<< HEAD
    customerName, // customerName
=======
    null, // customerName 
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    null, // agentName
    null, // reason
    policyType, // policyType
    vinNumber, // vinNumber
<<<<<<< HEAD
    invoiceId, // invoiceId
    policyId,
    companyName,
  );
  const ccEmails = [rmEmail, gmEmail, agentEmail].filter(Boolean);  
=======
    invoiceId // invoiceId
  );

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
  await sendUserEmail({
    to: userEmail,
    subject,
    htmlContent,
    pdfPolicyBuffer,
    pdfInvoiceBuffer,
    policyFilename,
    invoiceFilename,
<<<<<<< HEAD
    policyType,
    ccEmails,
    
  });
};
=======
  });
  
};

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

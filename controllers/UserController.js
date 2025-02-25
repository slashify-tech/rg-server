const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const User = require("../model/User");
=======
const userSchema = require("../model/User");
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
const dotenv = require("dotenv");
const fs = require("fs");
// const { encryptText, decryptText } = require("../Utility/utilityFunc");
const {
  sendAgentCredEmail,
  sendAgentUpdatedEmail,
  sendTeamUpdatedEmail,
  sendTeamCredEmail,
} = require("../helper/emailFunction");
<<<<<<< HEAD
const { encryptText, decryptText } = require("../Utility/utilityFunc");
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
const json2csv = require("json2csv").parse;
dotenv.config();

exports.signinController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid Field" });
  }

  try {
<<<<<<< HEAD
    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const decryptedPassword = decryptText(existingUser.password);
    if (password !== decryptedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
=======
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ token, user: existingUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getUsersData = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

<<<<<<< HEAD
    const { password, ...userData } = user.toObject();
=======
    const { password, confirmPassword, ...userData } = user.toObject();
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

    res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching data for userId: ${userId}`);
  try {
<<<<<<< HEAD
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userData } = user.toObject();
=======
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, confirmPassword, ...userData } = user.toObject();
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
//fetch password and confirmpassword as well
exports.getUserDataById = async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching data for userId: ${userId}`);
  try {
<<<<<<< HEAD
    const user = await User.findById(userId);
=======
    const user = await userSchema.findById(userId);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

<<<<<<< HEAD
    const { password, ...userData } = user.toObject();
    const response = {
      ...userData,
=======
    const { password, confirmPassword, ...userData } = user.toObject();
    const response = {
      ...userData,
      password: user.password,
      confirmPassword: user.confirmPassword,
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    };
    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

exports.addAgent = async (req, res) => {
  try {
    const agentData = req.body;
    const { id } = req.query;
<<<<<<< HEAD
    const { email, password, contactNumber, agentId, roleType, agentName } =
      agentData;

    if (id) {
      const existingAgent = await User.findById(id);
=======
    const {
      email,
      password,
      confirmPassword,
      contactNumber,
      agentId,
      roleType,
      agentName,
    } = agentData;

    if (id) {
      const existingAgent = await userSchema.findById(id);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

      if (!existingAgent) {
        return res.status(404).json({ message: "Agent not found for update" });
      }

<<<<<<< HEAD
      const existingContactAgent = await User.findOne({
=======
      const existingContactAgent = await userSchema.findOne({
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
        contact: contactNumber,
        _id: { $ne: id },
      });

<<<<<<< HEAD
      const existingEmailAgent = await User.findOne({
=======
      const existingEmailAgent = await userSchema.findOne({
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
        email: email,
        _id: { $ne: id },
      });

      if (existingContactAgent || existingEmailAgent) {
        return res
          .status(400)
          .json({ message: "Email or contact number already exists" });
      }

<<<<<<< HEAD
      const updatedAgent = await User.findByIdAndUpdate(
        id,
        {
          ...agentData,
          ...(password && { password: encryptText(password) }),
=======
      const updatedAgent = await userSchema.findByIdAndUpdate(
        id,
        {
          ...agentData,
          ...(password && { password: password }),
          ...(confirmPassword && { confirmPassword: confirmPassword }),
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
        },
        { new: true }
      );

      if (updatedAgent) {
        const emailFunction =
          roleType === "1" ? sendTeamUpdatedEmail : sendAgentUpdatedEmail;
        await emailFunction(email, password, agentName);
        return res.status(200).json({ message: "Agent updated successfully" });
      } else {
        return res.status(404).json({ message: "Agent not found" });
      }
    }

<<<<<<< HEAD
    const newAgent = new User({
      ...agentData,
      password: encryptText(password),
=======
    const newAgent = new userSchema({
      ...agentData,
      password: password,
      confirmPassword: confirmPassword,
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    });

    await newAgent.save();
    const emailFunction =
      roleType === "1" ? sendAgentCredEmail : sendTeamCredEmail;
    await emailFunction(email, password, agentName);

    return res.status(201).json({ message: "Agent added successfully" });
  } catch (err) {
    console.log("Error saving agent data:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
<<<<<<< HEAD
    const deletedAgent = await User.findByIdAndDelete(id);
=======
    const deletedAgent = await userSchema.findByIdAndDelete(id);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (err) {
    console.error("Error deleting agent:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
<<<<<<< HEAD
    const agents = await User.find();
=======
    const agents = await userSchema.find();
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

    if (agents.length === 0) {
      return res.status(404).json({ message: "No agents found" });
    }
    res
      .status(200)
      .json({ message: "Agents retrieved successfully", data: agents });
  } catch (err) {
    console.error("Error retrieving agents:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getMGagent = async (req, res) => {
  try {
    const query = { roleType: "2", brandName: "MG" };
<<<<<<< HEAD
    const mgAgents = await User.find(query);
=======
    const mgAgents = await userSchema.find(query);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    if (mgAgents.length === 0) {
      return res.status(404).json({ message: "No MG agents found" });
    }
    res.status(200).json({ message: "All MG Agents data", mgAgents });
  } catch (err) {
    console.error("Error while getting MG agents:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getMBagent = async (req, res) => {
  try {
    const query = { roleType: "2", brandName: "MB" };

<<<<<<< HEAD
    const mbAgents = await User.find(query);
=======
    const mbAgents = await userSchema.find(query);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04
    if (mbAgents.length === 0) {
      return res.status(404).json({ message: "No MG agents found" });
    }
    res.status(200).json({ message: "All MB Agents data", mbAgents });
  } catch (err) {
    console.error("Error while getting MG agents:", err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};

exports.getUserDataByBrand = async (req, res) => {
  const { brandName } = req.query;

  try {
    const query = { roleType: "1", brandName };
<<<<<<< HEAD
    const teamMembers = await User.find(query);
=======
    const teamMembers = await userSchema.find(query);
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

    // Send the response
    return res.status(200).json({ success: true, data: teamMembers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.downloadCsv = async (req, res) => {
  try {
    const data = await User.find({});

    const csvData = json2csv(data, {
      fields: [
        "brandName",
        "agentId",
        "agentName",
        "email",
        "contact",
        "roleType",
      ],
    });

    const filePath = "exportedData.csv";
    fs.writeFileSync(filePath, csvData);

    res.download(filePath, "exportedData.csv", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
<<<<<<< HEAD

exports.emailUpdate = async (req, res) => {
  const { id, email, password } = req.body;

  try {
    if (!id || !email || !password) {
      return res.status(400).send({ message: "ID and email are required" });
    }

    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).send({ message: "User not found" });
    }
    const decryptedPassword = decryptText(userData.password);
    if (password !== decryptedPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }

    userData.email = email;
    await userData.save();

    return res.status(200).send({
      message: "Email updated successfully",
      statusCode: 200,
      user: {
        id: userData._id,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.passwordUpdate = async (req, res) => {
  const { id, password } = req.body;

  try {
    if (!id || !password) {
      return res.status(400).send({ message: "ID and password are required" });
    }

    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).send({ message: "User not found" });
    }

    userData.password = encryptText(password);
    await userData.save();

    return res.status(200).send({
      message: "password updated successfully",
      user: {
        id: userData._id,
        password: userData.password,
      },
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
=======
>>>>>>> c1503c0d833e5889b7aecd7bf5d817f7f2bbbd04

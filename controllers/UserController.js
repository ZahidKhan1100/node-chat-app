const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "default_secret";

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      res.send({ message: "Email Exist" });
    } else {
      const user = new UserModel({
        name,
        email,
        password,
      });
      await user.save();
      const token = user.generateAuthToken();
      return res.status(201).send({ msg: "User added successfully", token });
    }
  } catch (error) {
    res.send({ message: error });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const existEmail = await UserModel.findOne({ email });
    if (!existEmail) {
      res.status(404).send({ message: "Email not exist" });
    } else {
      const passwordMatch = await bcrypt.compare(password, emailExist.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      } else {
        const token = jwt.sign({ _id: emailExist._id }, jwtSecret);
        return res.status(200).json({ message: "Login successful", token });
      }
    }
  } catch (error) {
    res.send({ message: "Server error" });
  }
}

module.exports = { signup, login };

import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    // destructered all request
    const { fullname, email, password } = req.body;
    // receive request shouldn't empty
    if (!fullname || !email || !password) {
      return res.status(404).json({ error: "Please input the fields" });
    }
    //generate password hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // user already exist
    const userExisted = await User.findOne({ email: email });
    if (userExisted) {
      return res.status(400).json({ error: "Email already registered" });
    }
    // create new user
    const newUser = new User({
      fullname: fullname.toLowerCase(),
      email,
      password: hashedPassword,
    });
    //save user
    await newUser.save();
    // respond to server
    return res.status(200).json({
      message: "User has been created",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
export const login = async (req, res) => {
  try {
    // destructured all request
    const { email, password } = req.body;
    // input isn't empty
    if (!email || !password) {
      return res
        .status(404)
        .json({ error: "Please input the field email and password" });
    }
    //check user by username
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "email not found" });
    }
    // check user by password
    const validPassword = await bcrypt.compare(password, user.password);
    //  compare password is correct or not
    // If correct
    if (validPassword) {
      //generate token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          picture: user.profilePicture,
          fullname: user.fullname,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET
      );
      // decoded token and send to client
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({
        message: "login berhasil",
        decoded,
        token,
      });
    }
    // if it's not correct
    if (!validPassword) {
      return res.status(401).json({ error: "Email or password is wrong" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export const deleteAllUser = async (req, res) => {
  try {
    await User.deleteMany({});
    return res.status(200).json({ message: "All Users has been deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: `${deletedUser.fullname} has been deleted` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { fullname: { $regex: req.query.search, $options: "i" } }
      : {};
    const data = await User.find(keyword).select("-password");
    return res.status(200).json({ data, length: data.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getIdUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { isAdmin });
    return res
      .status(200)
      .json({ message: `${user.fullname} Admin has been updated as admin` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

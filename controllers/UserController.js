
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../modules/User.js"

export const register = async (req, res) => {
  try {
    

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "qwer123",
      { expiresIn: "10d" }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email address or password",
      });
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword) {
      return res.status(404).json({
        message: "incorrect email address or password",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "qwer123",
      { expiresIn: "10d" }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json({
      userData,
    });
  } catch (err) {}
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;

  const userObject = typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };
  delete userObject.password;
  delete userObject.refreshToken;

  return userObject;
};

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { sub: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d" }
  );

const storeRefreshToken = async (user, refreshToken) => {
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists with that email or username" });
    }

    let avatarUrl = "";
    const avatarPath = req.file?.path || req.files?.avatar?.[0]?.path;

    if (avatarPath) {
      const uploadResult = await uploadOnCloudinary(avatarPath);

      if (!uploadResult || (!uploadResult.url && !uploadResult.secure_url)) {
        return res.status(500).json({ message: "Failed to upload avatar" });
      }

      avatarUrl = uploadResult.secure_url || uploadResult.url || "";
    }

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      avatar: avatarUrl,
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    return res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("registerUser error", error);
    return res.status(500).json({ message: "Unable to register user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({ message: "Username/email and password are required" });
    }

    const lookup = [];
    if (username) lookup.push({ username: username.trim().toLowerCase() });
    if (email) lookup.push({ email: email.trim().toLowerCase() });

    const user = await User.findOne({ $or: lookup }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("loginUser error", error);
    return res.status(500).json({ message: "Unable to login", error: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const avatarPath = req.file?.path || req.files?.avatar?.[0]?.path;

    if (!avatarPath) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const uploadResult = await uploadOnCloudinary(avatarPath);

    if (!uploadResult || (!uploadResult.url && !uploadResult.secure_url)) {
      return res.status(500).json({ message: "Failed to upload avatar" });
    }

    user.avatar = uploadResult.secure_url || uploadResult.url || "";
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "Avatar updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("updateAvatar error", error);
    return res.status(500).json({ message: "Unable to update avatar", error: error.message });
  }
};

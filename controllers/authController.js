const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");

const JWT_SECRET = process.env.JWT_SECRET || "ecommerce_catalogue_builder_jwt_secret_key_2026";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // Create organization for the new business user
    const org = await Organization.create({
      name: companyName || `${name}'s Catalogue Studio`,
      slug: (companyName || name).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      businessProfile: {
        legalName: companyName || `${name} Enterprises`,
      },
    });

    const user = await User.create({
      name,
      email,
      password,
      role: "owner",
      organizationId: org._id,
    });

    org.members.push({ user: user._id, role: "owner" });
    await org.save();

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: org._id,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
        organization: req.organization,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};

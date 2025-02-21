const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from cookies
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getUserProfile };

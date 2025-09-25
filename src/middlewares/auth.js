const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please login in!");
    }

    const decodedData = await jwt.verify(token, "DEV@Tinder790");
    const { _id } = decodedData;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };

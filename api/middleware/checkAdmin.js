const jwt = require("jsonwebtoken");
const Auth = require("../models/auth");
module.exports = async (req, res, next) => {
  try {
    //check here for admin
    console.log("This is reqest in middleware", req.body);
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SESSION_KEY);
    const authId = decodedToken.id;
    const authObj = await Auth.findById(authId).exec();
    console.log("approved",token);
    next();
  } catch {
    res.status(401).json({
      message:
        "Auhorization error! please send a valid token via authorization header!",
    });
  }
};

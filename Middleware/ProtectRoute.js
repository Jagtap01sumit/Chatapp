import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthrized" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      return res
        .status(401)
        .json({ error: "Unauthenticated-No Token Provided" });
    }
    const user = await User.findById(decodeToken.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("errror in protect routes", error);
  }
};
export default protectRoute;

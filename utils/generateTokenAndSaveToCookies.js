import jwt from "jsonwebtoken";

//generate token and save to cookies
const generateTokenAndSaveToCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //millisec
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", //prevent CSRF attacks cross-site scripting attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSaveToCookies;

import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSaveToCookies from "../utils/generateTokenAndSaveToCookies.js";
export const signupUser = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmpassword, gender } =
      req.body;

    if (password !== confirmpassword) {
      return res
        .status(400)
        .jsoN({ error: "Password don't match, try again!!" });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "username already exists" });
    } else {
      //Hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

      const newUser = new User({
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      });
      if (newUser) {
        await generateTokenAndSaveToCookies(newUser._id, res);
        await newUser.save();
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          gender: newUser.gender,
          profilePic: newUser.profilePic,
        });
      } else {
        res.status(400).json({ error: "Invalid Credentials" });
      }
    }
  } catch (error) {
    console.log("Error during signup");
    res.status(500).json({ error: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    console.log(user);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect);
    if (!user || !isPasswordCorrect) {
      return res.status(404).json({ error: "Invalid Credentials" });
    } else {
      console.log(user, "user");
      generateTokenAndSaveToCookies(user._id, res);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
      });
    }
  } catch (error) {
    console.log("Error during login user");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", { maxAge: 0 });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.log("Error during logout user");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

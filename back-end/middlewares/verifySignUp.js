// app/middlewares/verifySignUp.js
import db from "../models/index.js";
 
const ROLES = db.ROLES;
const User = db.User;
 
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        // Check if name exists
        const userByName = await User.findOne({ name: req.body.name });
        if (userByName) {
            return res
                .status(400)
                .json({ message: "Failed! Username is already in use!" });
        }
 
        // Check if email exists
        const userByEmail = await User.findOne({ email: req.body.email });
        if (userByEmail) {
            return res.status(400).json({ message: "Failed! Email is already in use!" });
        }
 
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
 
const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        const invalidRoles = req.body.roles.filter((role) => !ROLES.includes(role));
        if (invalidRoles.length > 0) {
            return res.status(400).json({
                message: `Failed! Roles [${invalidRoles.join(", ")}] do not exist!`,
            });
        }
    }
    next();
};
const checkActiveOnSignin = async (req, res, next) => {
  try {
    const rawEmail = req.body?.email;
    if (!rawEmail) {
      // Không đủ dữ liệu để kiểm tra -> để controller signin xử lý
      return next();
    }

    const email = String(rawEmail).trim().toLowerCase();

    // Chỉ lấy field cần
    const user = await User.findOne({ email }).select("isActive");
    if (!user) {
      // Không lộ thông tin user tồn tại hay không
      return next();
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
 
const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
    checkActiveOnSignin
};
 
export default verifySignUp;
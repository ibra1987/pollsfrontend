const cookie = require("cookie");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const privateKey = process.env.JWT_SECRET;

const useAuth = async (req) => {
  const cookies = cookie.parse(req.headers.cookie || "");

  const { RE_TOK } = cookies;

  if (!RE_TOK) {
    return {
      isAuth: false,
    };
  }
  try {
    const { id } = jwt.verify(RE_TOK, privateKey);

    const user = await User.findOne({ _id: id });
    if (!user) {
      return {
        isAuth: false,
      };
    }

    return {
      name: user.fullName,
      id: user._id,
      isAuth: true,
    };
  } catch (error) {
    return {
      isAuth: false,
    };
  }
};
export default useAuth;

import Token from "../../users/reset-password/[token]";

const privatekey = process.env.JWT_SECRET;
const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const connectB = require("../../../config/DBConnection");

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.redirect(307, "/users/login");
  }
  // if the link is comming from the email verification
  const { token } = req.query;

  //verify the token
  if (!token) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid Link ",
          value: false,
        },
      ],
    });
  }
  try {
    const { id } = jwt.verify(token, privatekey);
    const passResetUser = await User.findOne({ resetPassToken: token });
    if (!passResetUser) {
      throw new Error();
    }
    const newToken = jwt.sign({ id }, privatekey);
    passResetUser.resetPassToken = newToken;
    await passResetUser.save();

    return res
      .status(200)

      .json({
        success: [
          {
            msg: "Please reset your password",
            value: true,
            resetToken: newToken,
          },
        ],
      });
  } catch (error) {
    return res.status(400).json({
      errors: [
        {
          msg: "invalid Link ",
          value: false,
        },
      ],
    });
  }
};

export default connectB(handler);

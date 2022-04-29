// check the email token and sets new access token
const cookie = require("cookie");
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
          msg: "Invalid Link, please check your email box for the right link ",
          value: false,
        },
      ],
    });
  }
  try {
    const { id } = jwt.verify(token, privatekey);
    const passResetUser = await User.findOne({ resetPassToken: token });

    if (!passResetUser) {
      return res.status(400).json({
        errors: [
          {
            msg: "Link expired, please request a new one ",
            value: false,
          },
        ],
      });
    }
    const newToken = jwt.sign({ id }, privatekey);
    //await User.updateOne({ id }, { resetPassToken: "" });

    return res

      .status(200)

      .json({
        success: [
          {
            msg: "Please reset your password",
            value: true,
            token: newToken,
          },
        ],
      });
  } catch (error) {
    return res.status(500).json({
      errors: [
        {
          msg: "invalid link",
          value: false,
        },
      ],
    });
  }
};

export default connectB(handler);

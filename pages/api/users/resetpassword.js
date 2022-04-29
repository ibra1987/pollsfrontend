const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const connectB = require("../../../config/DBConnection");
const privatekey = process.env.JWT_SECRET;

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.redirect(307, "/users/resetpassword");
  }
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      errors: [
        {
          msg: "Please enter your email address",
        },
      ],
    });
  }
  // get the uset
  const user = await User.findOne({ email });

  //user does not exist
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "This is email address is not associated to any account",
        },
      ],
    });
  }

  //create a pass reset token

  const token = jwt.sign({ id: user._id }, privatekey, {
    expiresIn: 60 * 60 * 1000,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "brahim.driouch1987@gmail.com",
      pass: "vxjszhjasomjxpnn",
    },
  });

  const options = {
    from: "brahim.driouch1987@gmail.com",
    to: `${email}`,
    subject: `Hello ${user.fullName}, You can reset your password`,
    html: `please follow this link <a href="http://localhost:3000/users/reset-password/${token}">reset password</a>`,
  };

  transporter.sendMail(options, async (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        errors: [
          {
            msg: "An error occured, could not send the email",
          },
        ],
      });
    }

    await User.updateOne({ _id: user._id }, { resetPassToken: token });

    res.status(200).json({
      success: [
        {
          msg: "An email has been to sent to your email address to reset your password",
        },
      ],
    });
  });
};

export default connectB(handler);

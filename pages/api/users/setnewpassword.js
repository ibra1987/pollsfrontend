const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const connectB = require("../../../config/DBConnection");
const privateKey = process.env.JWT_SECRET;

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.redirect(307, "/users/login");
  }
  const { password, passwordConfirmation } = req.body;

  if (!password || !passwordConfirmation) {
    return res.status(400).json({
      errors: [
        {
          msg: "Please fill in all fields",
        },
      ],
    });
  }

  if (!password.length >= 8) {
    return res.status(400).json({
      errors: [
        {
          msg: "Password must be at least 8 characters",
          value: false,
        },
      ],
    });
  }
  const cookies = cookie.parse(req.headers.cookie || "");

  // Get the visitor name set in the cookie
  let { RE_TOK } = cookies;

  if (!RE_TOK) {
    return res.status(400).json({
      errors: [
        {
          msg: "An error occured, please request a new passord reset link",
          value: false,
        },
      ],
    });
  }

  const { id } = jwt.verify(RE_TOK, privateKey);

  const user = await User.find({ _id: id });
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "An error occured, please request a new passord reset link",
          value: false,
        },
      ],
    });
  }
  try {
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({
          errors: [
            {
              msg: "Could not set your new passord, please try again",
              value: false,
            },
          ],
        });
      }

      await User.updateOne({ id }, { password: hashedPassword });

      res.status(201).json({
        success: [
          {
            msg: "Your new password has been saved",

            value: true,
          },
        ],
      });
    });
  } catch (err) {
    res.json({
      serrors: [
        {
          msg: err.message,
          warning: "something went wrong",
          value: false,
        },
      ],
    });
  }
};

export default connectB(handler);

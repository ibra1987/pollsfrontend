const User = require("../../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkEmail } = require("../../../utils/helpers");
const connectB = require("../../../config/DBConnection");
const cookie = require("cookie");
const privateKey = process.env.JWT_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      //if no user found
      if (!user) {
        return res.status(404).json({
          errors: [
            {
              msg: "There is no user with this email",
            },
          ],
        });
      }

      // if there is a user

      const isCorrectPass = await bcrypt.compare(password, user.password);

      if (!isCorrectPass) {
        await User.updateOne({ email }, { $inc: { loginFails: 1 } });

        if (parseInt(user.loginFails) > 4) {
          return res.status(400).json({
            errors: [
              {
                msg: "Too many login attempts",
                loginFails: true,
                warning:
                  parseInt(user?.loginFails) > 5
                    ? "Too many attempts. Confirm your email address to set up a new passwod"
                    : "Please note that you only have 5 attempts allowed in total",
              },
            ],
          });
        }

        return res.status(400).json({
          errors: [
            {
              msg: "Incorrect Password",
              loginFails: false,
              warning:
                parseInt(user?.loginFails) > 5
                  ? "Too many attempts. Confirm your email address to set up a new passwod"
                  : "Please note that you only have 5 attempts allowed in total",
            },
          ],
        });
      }

      const token = jwt.sign({ _id: user._id }, privateKey);

      return res
        .setHeader(
          "Set-Cookie",
          cookie.serialize("access", token, {
            httpOnly: true,
            secure: false, //process.env.NODE_ENV !== "developement",
            maxAge: 60 * 60,
            path: "/",
          })
        )
        .status(200)
        .json({
          success: [
            {
              msg: "successfully loged in",
            },
          ],
        });
    } catch (error) {
      return res.status(500).json({
        errors: [
          {
            msg: "An error occured please try again ",
            err: error.message,
          },
        ],
      });
    }
  } // end if method === post

  res.redirect(307, "/users/login");
};
export default connectB(handler);

const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const connectB = require("../../../config/DBConnection");
const cookie = require("cookie");
const ObjectId = require("mongoose").Types.ObjectId;
const privateKey = process.env.JWT_SECRET;

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.redirect(307, "/users/login");
  } // end if method === post

  const cookies = cookie.parse(req.headers.cookie || "");
  let { RE_TOK } = cookies;

  if (!RE_TOK) {
    return res
      .setHeader(
        "Set-Cookie",
        cookie.serialize("RE_TOK", "", {
          httpOnly: true,
          secure: false, //process.env.NODE_ENV !== "developement",
          maxAge: 0,
          path: "/",
          sameSite: "strict",
        })
      )
      .status(200)
      .json({
        errors: [
          {
            msg: "Already logged out",
            value: false,
          },
        ],
      });
  }

  try {
    const { id } = jwt.verify(RE_TOK, privateKey);
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid request");
    }
    return res
      .setHeader(
        "Set-Cookie",
        cookie.serialize("RE_TOK", "", {
          httpOnly: true,
          secure: false, //process.env.NODE_ENV !== "developement",
          maxAge: 0,
          path: "/",
          sameSite: "strict",
        })
      )
      .status(200)
      .json({
        success: [
          {
            msg: "successfully logged out",
            value: true,
          },
          g,
        ],
      });
  } catch (error) {
    return res.status(200).json({
      errors: [
        {
          msg: error.message,
          value: false,
        },
      ],
    });
  }
};
export default connectB(handler);

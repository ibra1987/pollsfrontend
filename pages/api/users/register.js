const User = require("../../../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../../../utils/generateToken");
const { checkEmail } = require("../../../utils/helpers");
const connectB = require("../../../config/DBConnection");
const cookie = require("cookie");

const handler = async (req, res) => {
  if (!req.method === "POST") {
    return res.redirect(307, "/users/register");
  }
  const { fullName, email, emailConfirmation, password, passwordConfirmation } =
    req.body;
  if (
    !email ||
    !fullName ||
    !password ||
    !passwordConfirmation ||
    !emailConfirmation
  ) {
    return res.status(400).json({
      errors: [
        {
          msg: "please fill in all fields",
        },
      ],
    });
  } // end if not provided

  if (!checkEmail(email)) {
    return res.status(400).json({
      errors: [
        {
          msg: "Please enter a valid email address",
        },
      ],
    });
  } //end  if email is not valid

  if (email !== emailConfirmation) {
    return res.status(400).json({
      errors: [
        {
          msg: "emails do not match",
        },
      ],
    });
  } // end if emails do not match
  if (password.replace(/\s/g, "").length < 8) {
    return res.status(400).json({
      errors: [
        {
          msg: "Password must be at least 8 characters",
        },
      ],
    });
  } // end if password is not 8 charachters

  if (password !== passwordConfirmation) {
    return res.status(400).json({
      errors: [
        {
          msg: "Passwors do not match",
        },
      ],
    });
  } //end if passwords do not match

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "This email is already in use",
          },
        ],
      });
    } // end if user already exists

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const emailVerificationToken = await generateToken("id", newUser._id, "1h");
    await sendEmail({
      receiver: newUser.email,
      name: newUser.fullName,
      object: `${this.name}, please verify your email address`,
      body: {
        type: "html",
        value: `please verify your accunt to continue using our services. <a href='http://localhost:3000/users/acc-verification/${emailConfirmation}'></a> `,
      },
    });

    return res.status(201).json({
      success: [
        {
          msg: "Account created successfully, you can now log in",
          warning: "A verification link has been sent to your email account",
        },
      ],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: [
        {
          msg: "An error occured please try again ",
          err: error.message,
        },
      ],
    });
  }
};

export default connectB(handler);

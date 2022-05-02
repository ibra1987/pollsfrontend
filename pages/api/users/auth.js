import useAuth from "../../../utils/useAuth";
const connectDB = require("../../../config/DBConnection");

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.redirect(307, "/users/login");
  }

  const user = await useAuth(req);

  const code = user.isAuth ? 200 : 400;

  res.status(code).json({ user });
};

export default connectDB(handler);

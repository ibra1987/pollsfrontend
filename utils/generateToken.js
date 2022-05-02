const privateKey = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

export default function generateToken(payload, value, age) {
  const token = jwt.sign({ payload: value }, privateKey, { expiresIn: age });
  return token;
}

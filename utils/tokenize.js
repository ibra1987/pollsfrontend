const cookie = require("cookie");

export default tokenize = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  let SE_TOK_EXISTS;
  const SE_TOK = { cookies };

  if (!SE_TOK) {
    SE_TOK_EXISTS = false;
  }

  return {
    SE_TOK_EXISTS,
  };
};

const jwt = require("jsonwebtoken");
const user = require("../Schema");

const auth = async (req, resp, next) => {
  try {
    // const token=req.cookies.jwtoken;
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      throw new Error("errror");
    } else {
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      rootUser = await user.findOne({
        _id: verifyToken._id,
      });
      console.log(rootUser);
      if (!rootUser) {
        throw new Error("user Not found");
      }

      req.rootUser = rootUser;
      req.user_id = rootUser._id;
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = auth;

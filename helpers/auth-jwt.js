import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = jwt.verify(token, "token_moka");
    req.userData = { email: userData.email, userID: userData.userID };
    next();
  } catch (error) {
    return res.status(401).json({ message: "user not authenticated !! " });
  }
};

export default auth;

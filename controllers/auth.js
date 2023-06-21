import User from "../models/user.js";
import Bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
export async function signup(req, res) {
  const hashed = await Bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    email: req.body.email,
    password: hashed,
  });
  User.create(newUser)
    .then((user) => {
      const token = Jwt.sign(
        { email: user.email, userID: user._id },
        "token_moka",
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        message: "user created",
        token: token,
      });
    })
    .catch((err) => {
      return res.status(500).json({message:'Invalid Authentication credentials !'});
    });
}

export function login(req, res) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(500).json({ message: "user not found" });
      }
      return Bcrypt.compare(req.body.password, user.password).then((value) => {
        if (!value) {
          return res.status(500).json({ message: "user not found !!" });
        }
        const token = Jwt.sign(
          { email: user.email, userID: user._id },
          "token_moka",
          { expiresIn: "1d" }
        );
        return res.status(200).json({ message: "logged in", token: token });
      });
    })
    .catch((err) => {
      return res.status(500).json({message:'Invalid Authentication credentials !'});
    });
}

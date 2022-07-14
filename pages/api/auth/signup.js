import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") return;

  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/) ||
    !password ||
    !password
      .trim()
      .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await dbConnect();

  const existEmail = await User.findOne({ email });
  const existName = await User.findOne({ name });

  if (existName) {
    res.status(422).json({ message: "This name is already used" });
    return;
  }

  if (existEmail) {
    res.status(422).json({ message: "Email is an account existing" });
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password, 8),
    isAdmin: false,
  });

  const user = await newUser.save();

  res.status(201).send({
    message: "Created user!",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

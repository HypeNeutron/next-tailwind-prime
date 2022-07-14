import { getSession } from "next-auth/react";
import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(400).send({ message: `${req.method} not supported` });

  const session = await getSession({ req });
  if (!session) return res.status(401).send({ message: "signIn required" });

  const { user } = session;

  const { password, newPassword, confirmPassword } = req.body;

  if (
    !password ||
    !newPassword ||
    !confirmPassword ||
    confirmPassword !== newPassword ||
    !password
      .trim()
      .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) ||
    !confirmPassword
      .trim()
      .match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await dbConnect();

  const userUpdate = await User.findById(user._id);

  if (!bcryptjs.compareSync(password, userUpdate.password))
    res.status(422).json({ message: "Your password was incorrect" });

  userUpdate.password = bcryptjs.hashSync(confirmPassword, 8);

  await userUpdate.save();

  res.send({ message: "Your Password is successfully updated!" });
}

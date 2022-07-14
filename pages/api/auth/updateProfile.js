import { getSession } from "next-auth/react";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(400).send({ message: `${req.method} not supported` });

  const session = await getSession({ req });
  if (!session) return res.status(401).send({ message: "signIn required" });

  const { user } = session;

  const { username } = req.body;

  if (!username)
    res.status(422).json({
      message: "Validation error",
    });

  await dbConnect();

  const userUpdate = await User.findById(user._id);

  userUpdate.name = username;
  await userUpdate.save();

  res.send({
    message: "User name updated",
  });
}

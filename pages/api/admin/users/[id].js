import { getSession } from "next-auth/react";
import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin)
    return res.status(410).json({ message: "Admin Login required" });
  await dbConnect();

  if (req.method === "DELETE") {
    await User.deleteOne({ _id: req.query.id });
    res.send({ message: "delete user successful" });
  }

  if (req.method === "PATCH") {
    const { name, isAdmin } = req.body;
    const user = await User.findById(req.query.id);
    user.name = name;
    user.isAdmin = isAdmin;
    await user.save();
    res.send({ message: "Update User successfully" });
  }
}

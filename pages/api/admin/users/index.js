import { getSession } from "next-auth/react";
import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin)
    return res.status(401).send({ message: "Admin login required" });
  if (req.method !== "GET")
    return res.status(500).send({ message: "Method is not Allowed" });

  await dbConnect();
  const users = await User.find({}, "-password");
  res.send(users);
}

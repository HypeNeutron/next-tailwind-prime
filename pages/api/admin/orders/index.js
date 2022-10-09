import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import dbConnect from "../../../../utils/dbConnect";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin))
    return res.status(401).send("signIn required");

  if (req.method !== "GET")
    return res.status(401).send({ message: "Method not allowed" });

  await dbConnect();
  const orders = await Order.find({}).populate("user", "name");
  res.send(orders);
}

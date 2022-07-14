import { getSession } from "next-auth/react";
import dbConnect from "../../../utils/dbConnect";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).send("signIn required");
  const { user } = session;
  await dbConnect();
  const orders = await Order.find({ user: user._id });
  res.send(orders);
}

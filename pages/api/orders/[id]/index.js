import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import dbConnect from "../../../../utils/dbConnect";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).send("signIn required");
  await dbConnect();
  const order = await Order.findById(req.query.id);
  res.send(order);
}

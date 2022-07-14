import { getSession } from "next-auth/react";
import dbConnect from "../../../utils/dbConnect";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  const session = await getSession({ req });
  !session && res.status(401).send("signIn required");
  const { user } = session;
  await dbConnect();

  const newOrder = new Order({
    ...req.body,
    user: user._id,
  });

  const order = await newOrder.save();

  res.status(201).send(order);
}

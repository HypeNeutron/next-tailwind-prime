import { getSession } from "next-auth/react";
import Order from "../../../../models/Order";
import dbConnect from "../../../../utils/dbConnect";

export default async function handler(req, res) {
  const session = await getSession({ req });
  !session && res.status(401).send("signIn required");

  await dbConnect();
  const order = await Order.findById(req.query.id);
  !order && res.status(404).send({ message: "Error:order not found" });

  order &&
    order.isPaid &&
    res.status(400).send({ message: "Error: order is already paid" });

  const { id, status, email_address } = req.body;
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = { id, status, email_address };
  const paidOrder = await order.save();
  res.send({ message: "order paid successfully", order: paidOrder });
}

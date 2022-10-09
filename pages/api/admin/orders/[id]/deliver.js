import dbConnect from "../../../../../utils/dbConnect";
import Order from "./../../../../../models/Order";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin))
    return res.status(401).send("Error: Admin signIn required");
  await dbConnect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    res.send({
      message: "order delivered successfully",
      order: deliveredOrder,
    });
  } else {
    res.status(404).send({ message: "Error order noe found" });
  }
}

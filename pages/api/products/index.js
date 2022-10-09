import { getSession } from "next-auth/react";
import Product from "../../../models/Product";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  const session = await getSession({ req });
  !session && res.status(401).send("signIn required");
  await dbConnect();

  if (!req.body)
    return res.status(500).send({ message: "no such of payload request" });

  req.body.map(async (item) => {
    let product = await Product.findById(item._id);
    product.stock -= item.quantity;
    await product.save();
  });

  res.send({ message: "Update Stock successfully" });
}

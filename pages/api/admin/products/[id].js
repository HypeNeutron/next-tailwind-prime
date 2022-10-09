import { getSession } from "next-auth/react";
import dbConnect from "../../../../utils/dbConnect";
import Product from "./../../../../models/Product";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin))
    return res.status(401).send({ message: "Admin login require" });
  await dbConnect();

  if (req.method === "GET") {
    const product = await Product.findById(req.query.id);
    res.send(product);
  }

  if (req.method === "DELETE") {
    await Product.deleteOne({ _id: req.query.id })
      .then(() => res.send({ message: "delete product successful" }))
      .catch((err) => res.send({ message: err.message }));
    return;
  }
  
  if (req.method === "PATCH") {
    const product = await Product.findById(req.query.id);
    const { name, price, slug, category, image, brand, stock, description } =
      req.body;
    if (product) {
      product.name = name;
      product.price = price;
      product.slug = slug;
      product.category = category;
      product.image = image;
      product.brand = brand;
      product.stock = stock;
      product.description = description;
      await product.save();
      res.send({ message: "Product updated successfully" });
    } else {
      res.status(404).send({ message: "Product not found!" });
    }
  }
}

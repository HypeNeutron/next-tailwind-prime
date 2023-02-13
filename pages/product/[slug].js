import Link from "next/link";
import Image from "next/image";
import { useGlobalContext } from "../../context/context";
import { MdArrowBackIosNew } from "react-icons/md";
import Layout from "../../components/Layout";
import dbConnect, { convertDocLeanToStr } from "../../utils/dbConnect";
import Product from "../../models/Product";

export default function ProductPage({ product }) {
  const { addToCart } = useGlobalContext();

  if (!product) {
    return (
      <Layout title="Product not found">
        <center>
          <h1>Product Not Found</h1>
        </center>
      </Layout>
    );
  }

  const {
    name,
    image,
    stock,
    category,
    brand,
    rating,
    numReviews,
    description,
    price,
  } = product;

  return (
    <Layout title={name}>
      <div className="py-5 font-medium">
        <Link
          href="/"
          className="flex items-center w-[9.5rem] text-[#273244] justify-between bg-amber-400 hover:bg-amber-500 p-[0.42rem] rounded"
        >
          <MdArrowBackIosNew />
          back to products
        </Link>
      </div>

      <div className="grid md:grid-cols-4 md:gap-3 font-medium">
        <div className="md:col-span-2">
          <Image
            src={image}
            alt={name}
            width={640}
            height={640}
            layout="responsive"
            className=" rounded"
          ></Image>
        </div>

        <div className="px-2 my-5 md:my-0">
          <ul>
            <li>
              <h1 className="text-lg">{name}</h1>
            </li>
            <li>Category: {category}</li>
            <li>Brand: {brand}</li>
            <li>
              Rating {rating} of {numReviews} reviews
            </li>
            <li>Description: {description}</li>
          </ul>
        </div>

        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${price}</div>
            </div>
            <div className="mb-2 flex flex-wrap justify-between md:justify-center  lg:justify-between">
              <div>Available</div>
              <div>
                {stock > 0 ? (
                  <p>
                    {stock} in <span className="text-green-600">stock</span>
                  </p>
                ) : (
                  <p className="text-red-500">Out of stock</p>
                )}
              </div>
            </div>
            <button
              className="primary-button w-full"
              onClick={() => addToCart({ ...product, quantity: 1 })}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params: { slug } }) {
  await dbConnect();
  const product = await Product.findOne({ slug }).lean();

  return {
    props: { product: product ? convertDocLeanToStr(product) : null },
  };
}

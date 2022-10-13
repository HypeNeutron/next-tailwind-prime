import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import dbConnect, { convertDocToStr } from "./../utils/dbConnect";
import Product from "./../models/Product";

export default function Home({ products }) {
  return (
    <>
      <Layout title="Home Page">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  const products = await Product.find().lean();
  return {
    props: { products: products.map(convertDocToStr) },
  };
}

var bcrypt = require("bcryptjs");

const data = {
  users: [
    {
      name: "Om Surachet",
      email: "surachat2014@gmail.com",
      password: bcrypt.hashSync("EToAgs6#bbw7!3B^", 8),
      isAdmin: true,
      // cart: {
      //   cartItems: [
      //     {
      //       product: "62c8f508133f01a907da0a52",
      //       quantity: 3,
      //     },
      //     {
      //       product: "62c8f508133f01a907da0a53",
      //       quantity: 1,
      //     },
      //     {
      //       product: "62c8f508133f01a907da0a51",
      //       quantity: 1,
      //     },
      //   ],
      //   cartAmount: 5,
      //   cartTotal: 304,
      // },
    },

    {
      name: "Jane Foster",
      email: "user@example.com",
      password: bcrypt.hashSync("i6Y5t8FTGH**&mdZ", 8),
      isAdmin: false,
      // cart: {
      //   cartItems: [
      //     {
      //       product: "62c8f508133f01a907da0a52",
      //       quantity: 3,
      //     },
      //     {
      //       product: "62c8f508133f01a907da0a53",
      //       quantity: 1,
      //     },
      //     {
      //       product: "62c8f508133f01a907da0a51",
      //       quantity: 1,
      //     },
      //   ],
      //   cartAmount: 5,
      //   cartTotal: 304,
      // },
    },
  ],
  products: [
    {
      name: "Free Shirt",
      slug: "free-shirt",
      category: "Shirts",
      image: "/images/shirt1.jpg",
      price: 70,
      brand: "Nike",
      rating: 4.5,
      numReviews: 8,
      stock: 20,
      description: "A popular shirt",
    },
    {
      name: "Fit Shirt",
      slug: "fit-shirt",
      category: "Shirts",
      image: "/images/shirt2.jpg",
      price: 80,
      brand: "Adidas",
      rating: 5,
      numReviews: 15,
      stock: 20,
      description: "A popular shirt",
    },
    {
      name: "Slim Shirt",
      slug: "slim-shirt",
      category: "Shirts",
      image: "/images/shirt3.jpg",
      price: 90,
      brand: "Raymond",
      rating: 4.8,
      numReviews: 4,
      stock: 15,
      description: "A popular shirt",
    },
    {
      name: "Golf Pants",
      slug: "golf-pants",
      category: "Pants",
      image: "/images/pants1.jpg",
      price: 50,
      brand: "oliver",
      rating: 4.2,
      numReviews: 16,
      stock: 12,
      description: "Smart looking pants",
    },
    {
      name: "Fit Pants",
      slug: "fit-pants",
      category: "Pants",
      image: "/images/pants2.jpg",
      price: 56,
      brand: "Zara",
      rating: 4.4,
      numReviews: 6,
      stock: 3,
      description: "A popular pants",
    },
    {
      name: "Classic Pants",
      slug: "classic-pants",
      category: "Pants",
      image: "/images/pants3.jpg",
      price: 86,
      brand: "Casely",
      rating: 4.7,
      numReviews: 17,
      stock: 19,
      description: "A popular pants",
    },
  ],
};

export default data;

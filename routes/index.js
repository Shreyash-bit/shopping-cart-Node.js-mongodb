var express = require("express");
const Stripe = require("stripe");
const Cart = require("../models/cart");
var router = express.Router();

const Product = require("../models/product");
const Order = require("../models/order");

/* GET home page. */
router.get("/", async (req, res, next) => {
  // const errMsg = ""
  const successMsg = req.flash("success")[0];
  const products = await Product.find({}).lean();
  let productChunks = [];
  let chunkSize = 3;
  for (let i = 0; i < products.length; i += chunkSize) {
    productChunks.push(products.slice(i, i + chunkSize));
  }
  res.render("shop/index", {
    title: "Shopping Cart",
    products: productChunks,
    successMsg,
    noMessages: !successMsg,
  });
});

router.get("/add-to-cart/:id", async (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  const product = await Product.findById(productId);
  cart.add(product, product._id);
  req.session.cart = cart;
  console.log(req.session.cart);
  res.redirect("/");
});

router.get("/reduce/:id", (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/remove/:id", (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
});

router.get("/shopping-cart", (req, res) => {
  if (!req.session.cart) {
    return res.render("shop/shopping-cart", { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render("shop/shopping-cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get("/checkout", isLoggedIn, (req, res) => {
  if (req.session.cart.totalQty <= 0) {
    // const errMsg = req.flash('error', "No items to checkout!!!");
    return res.redirect("/");
  }
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash("error")[0];

  res.render("shop/checkout", {
    total: cart.totalPrice,
    errMsg,
    noErrors: !errMsg,
  });
});

router.post("/checkout", isLoggedIn, async function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const cart = new Cart(req.session.cart);
  const stripe = Stripe(
    "sk_test_51JMzvPSIjFuU0MC9YlWS2PD4l9xeWseI2FH0y9iASEzsH5TtrFhXm5XO1wZ7M7siJHlWRTWs3XY8ZKqe6aDlhNEd00I87PPxAA"
  );
  stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: "INR",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "My First Test Charge (created for API docs)",
    },
    // {
    //   idempotencyKey: "edqXlTXtuLRppd0j"
    // },
    function (err, charge) {
      // asynchronously called
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/checkout");
      }
      const order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address_line1,
        name: req.body.name,
        paymentId: charge.id,
      });

      order.save(function (err, result) {
        req.flash("success", "Successfully bought Product!");
        req.session.cart = null;
        res.redirect("/");
      });
    }
  );
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/user/signin");
}

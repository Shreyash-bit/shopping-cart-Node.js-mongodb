
# Node js, Mongodb, Express js Shopping Cart

![image](https://github.com/Shreyash-bit/shopping-cart-Node.js-mongodb/blob/main/preview/index%20page.jpg)

This project work with Stripe api for Nodejs. Go to http://stripe.com/ for more information

## Requirements
- mongodb 
- node.js
- account on Stripe.js (for your test purchases)

## Used middlewares
- connect-mongo
- express cookie
- nodemon

## Note:
![image](https://github.com/Shreyash-bit/shopping-cart-Node.js-mongodb/blob/main/preview/checkout.js.jpg)

 Before running the app, you should login to http://stripe.com/ and copy paste publishable key to checkout.js .

 ### Running
  * npm install
  * add stripe test key to checkout.js file (publishable not secret key for sender identification)
  * npm start / nodemon server.js (if you have nodemon installed)
  * open browser at `http://localhost:3000`

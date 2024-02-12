const { Router } = require("express");
const { passportCall } = require("../middleware/passportCall");
const { authorization } = require("../middleware/authorization.middleware");
const { userModel } = require("../models/user.model");
const ProductDaoMongo = require("../Daos/Mongo/productsDaoMongo");
const CartManagerMongo = require("../Daos/Mongo/cartsDaoMongo");
const UserManagerMongo = require("../Daos/Mongo/usersDaoMongo");
const {
  login,
  resetPasword,
  changePassword,
} = require("../controllers/views.controller.js");
const { productModel } = require("../models/products.model.js");
const UserDaoMongo = require("../Daos/Mongo/usersDaoMongo");
const jwt = require("jsonwebtoken");
const TicketDaoMongo = require("../Daos/Mongo/ticketsDaoMongo.js");
const { nanoid } = require("nanoid");
const { userService } = require("../service/service.js");

const router = Router();
const cartManagerMongo = new CartManagerMongo();
const ticketManagerMongo = new TicketDaoMongo();
const userManagerMongo = new UserDaoMongo();

router
  .get("/login", login)
  .get("/forgot-password", resetPasword)
  .get("/change-password", [], changePassword)
  .get("/register", (req, res) => {
    res.render("register", {
      showNav: true,
    });
  });

router.get("/profile", [passportCall("jwt")], async (req, res) => {
  try {
    const userManagerMongo = new UserManagerMongo();
    let serviceUsers = new UserDaoMongo();
    let email = req.user.email;
    const token = req.cookies.cookieToken;
    let user = jwt.verify(token, "secret");

    //let userCart = jwt.verify(token, 'secret')
    const idCartUser = await serviceUsers.getIdCartByEmailUser(user.email);
    res.render("profile", {
      showNav: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", [passportCall("jwt")], async (req, res) => {
  try {
    const { limit, numPage, sort } = req.params;
    let serviceProducts = new ProductDaoMongo();
    const token = req.cookies.cookieToken;
    const user = jwt.verify(token, "secret");
    const {
      docs,
      hasPrevPage,
      prevPage,
      hasNextPage,
      nextPage,
      page,
    } = await serviceProducts.get({
      limit,
      page: numPage,
      sort: { price: sort },
      lean: true,
    });

    // Convertir ObjectId a cadena en cada documento
    const products = docs.map(product => ({
      ...product,
      _id: product._id.toString(),
    }));

    res.render("index", {
      user: user,
      showNav: true,
      products: products,
      hasPrevPage,
      prevPage,
      hasNextPage,
      nextPage,
      page,
    });
  } catch (error) {
    console.log(error);
  }
});

// http://localhost:8080/products?limit=3&page (vista) http://localhost:8080/api/products
// producto
router.get("/products", async (req, res) => {
  // lógica
  const { limit, numPage, sort } = req.params;
  let serviceProducts = new ProductManagerMongo();
  const {
    docs,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    page,
  } = await serviceProducts.getProducts({
    limit,
    page: numPage,
    sort: { price: sort },
    lean: true,
  });

  res.status(200).render("products", {
    products: docs,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    page,
  });
});

// Vista del detalle del producto
router.get("/product-detail/:pid", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid);

    if (!product) {
      // Si el producto no se encuentra, puedes manejar esto de alguna manera
      // Por ejemplo, redirigir a una página de error o renderizar una página especial.
      return res.status(404).render("productNotFound", { showNav: true });
    }

    const token = req.cookies.cookieToken;
    let user = jwt.verify(token, "secret");
    const sendProduct = {
      _id: product._doc._id.toString(),
      title: product._doc.title,
      thumbnail: product._doc.thumbnail,
      description: product._doc.description,
      price: product._doc.price,
      stock: product._doc.stock,
      category: product._doc.category,
    };
    res.status(200).render("productDetail", {
      user: user,
      showNav: true,
      product: sendProduct,
    });
  } catch (error) {
    console.log(error);
    // Manejar otros errores aquí
    res.status(500).render("error", { showNav: true });
  }
});

// vista del formulario de modificación del producto
router.get("/product-edit-form/:pid", async (req, res) => {
  const product = await productModel.findById(req.params.pid);
  res.status(200).render("productEditForm", {
    showNav: true,
    product: product,
  });
});

router.get(
  "/realtimeproducts",
  [passportCall("jwt"), authorization(["ADMIN"])],
  async (req, res) => {
    res.status(200).render("realTimeProduct", {
      showNav: true,
    });
  }
);

router.get(
  "/carts/:cid",
  [passportCall("jwt"), authorization(["USER"])],
  async (req, res) => {
    let id = req.params.cid;
    let emailActive = req.query.email;
    let allCarts = await cartManagerMongo.getCartWithProducts(id);
    if (allCarts == "Carrito no encontrado") {
      res.render("productNotFound", {
        showNav: true,
      });
    } else {
      allCarts.products.forEach(producto => {
        producto.total = producto.quantity * producto.product.price;
      });
      const sumTotal = allCarts.products.reduce((total, producto) => {
        return total + (producto.total || 0); // Asegurarse de manejar casos donde total no esté definido
      }, 0);
      res.render("carts", {
        showNav: true,
        title: "Vista Carro",
        carts: allCarts,
        user: emailActive,
        calculateSumTotal: products =>
          products.reduce(
            (total, producto) => total + (producto.total || 0),
            0
          ),
      });
    }
  }
);

router.get("/checkout", async (req, res) => {
  let cart_Id = req.query.cartId;
  let purchaser = req.query.purchaser;
  let totalAmount = req.query.totalPrice;
  let newCart = await cartManagerMongo.create(purchaser);
  const cart = await cartManagerMongo.getBy({_id: cart_Id})
  for (const cartProduct of cart.products) {
    const productId = cartProduct.product._id;
    const quantityPurchased = cartProduct.quantity;
    await productModel.updateOne(
      { _id: productId },
      { $inc: { stock: -quantityPurchased } }
    );
  }
  await cartManagerMongo.removeAllProductsFromCart(cart_Id);
  const user = await userModel.findOne({ email: purchaser });
  const idCartUser = newCart._doc._id.toString();
  const newUser = await userManagerMongo.update(
    { _id: user._doc._id.toString() },
    {
      last_connection: new Date(),
      id_cart: idCartUser,
    }
  );
  if (newCart) {
    const newTicket = {
      code: nanoid(),
      purchase_datetime: Date(),
      amount: totalAmount,
      purchaser: purchaser,
      id_cart_ticket: cart_Id,
    };
    let result = await ticketManagerMongo.addTicket(newTicket);
    const newTicketId = result._id.toString();
    // Redirigir al usuario a la página del ticket recién creado
    res.redirect(`/tickets/${newTicketId}`);
  }
});

router.get("/tickets/:tid", async (req, res) => {
  let id = req.params.tid;
  let allTickets = await ticketManagerMongo.getTicketById(id);
  res.render("viewTicket", {
    title: "Vista Ticket",
    tickets: allTickets,
    showNav: true,
  });
});

router.get(
  "/users",
  [passportCall("jwt"), authorization(["ADMIN"])],
  async (req, res) => {
    try {
      const { numPage = 1, limit = 20, query = "" } = req.query;
      let {
        docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page,
        // totalPages
      } = await userModel.paginate({}, { limit, page: numPage, lean: true });
      res.status(200).render("users", {
        showNav: true,
        users: docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// chat
router.get(
  "/chat",
  [passportCall("jwt"), authorization(["USER", "USER-PREMIUM", "ADMIN"])],
  (req, res) => {
    res.render("chat", { showNav: true });
  }
);

router.get("/contacto", (req, res) => {
  res.render("contactos", { nombre: "Fede", showNav: true });
});

module.exports = router;

const { Router } = require("express");
const { userModel } = require("../../models/user.model.js");
const { createHash, isValidPasword } = require("../../utils/hash.js");
const UserDaoMongo = require("../../Daos/Mongo/usersDaoMongo.js");
const passport = require("passport");
const { generateToken } = require("../../utils/jsonwebtoken.js");
const { sendMail } = require("../../utils/sendMail.js");
const { configObject } = require("../../config/config.js");
const jwt = require("jsonwebtoken");
const { authorization } = require('../../middleware/authorization.middleware.js');
const CartDaoMongo = require("../../Daos/Mongo/cartsDaoMongo.js");

const router = Router();
const userService = new UserDaoMongo();
const cartService = new CartDaoMongo();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  const cart = await cartService.create(req.body.email)

  if (!user)
    return res
      .status(401)
      .send({ status: "error", error: "Usuario no existe" });

  if (!isValidPasword(password, user)) {
    return res
      .status(401)
      .send({ status: "error", error: "Contraseña incorrecta" });
  }
  const idCartUser = cart._doc._id.toString()
  const newUser = await userService.update(
    {_id: user._doc._id.toString()},{
      last_connection: new Date(),
      id_cart: idCartUser
    }
  );
  const token = generateToken({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    id_cart: newUser.id_cart,
  });

  const usertoken = jwt.verify(token, "secret");

  // dos formas de enviar el token
  res
    .cookie("cookieToken", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })
    .status(200)
    .send({
      status: "success",
      token: token, // ruta avanzada
      message: "loggen successfully",
    });

  // res.send('logueado')
});

// http://localhost:8080/api/sessions /register
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, id_cart } = req.body;
    // validar campos
    if (!first_name) {
      return res.send({ status: "error", error: "completar todos los campos" });
    }
    const exists = await userModel.findOne({ email });

    if (exists)
      return res
        .status(401)
        .send({
          status: "error",
          error: "El usuario con el mail ingresado ya existe",
        });

    const newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password),
      id_cart,
    };

    let result = await userModel.create(newUser);
    // validar result

    const token = generateToken({
      first_name,
      last_name,
      email,
      role: "user",
      id_cart,
    });
    res
      .cookie("cookieToken", token, {
        maxAge: 60 * 60,
        httpOnly: true,
      })
      .send({
        status: "success",
        message: "El ususario fue creado correctamente",
      });
  } catch (error) {
    console.log(error);
  }
});
//// _____________________ Github _____________________________________

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await userService.getBy({ email });

  if (!user) {
    return res.status(404).send({
      status: "error",
      error: "no se encuentra el user",
    });
  }
  // formulario ingresar el email y repetir el email
  console.log(`${configObject.url_base}/change-password`);
  const html = `
        <div><a href='${configObject.url_base}/change-password'>Cambiar contraseña</a><div> 
    `;
  sendMail({ to: user.email, subject: "cambio de contraseña", html });
  const token = generateToken({
    user: user._id,
    email: user.email,
    changeEmail: true,
  });
  res
    .cookie("cookieToken", token, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })
    .send(
      '<h2 class="text-center">El correo se a enviado, revise su casilla de correo</h2>'
    );
});

router.post("/change-password", async (req, res) => {
  try {
    const { password, passwordConfirm } = req.body;
    const { cookieToken } = req.cookies;

    console.log(cookieToken);
    console.log(password, passwordConfirm);

    const { user, email, changeEmail } = await jwt.verify(
      cookieToken,
      "secret"
    );

    if (!user || !email || !changeEmail) {
      return res.status(404).send({
        status: "error",
        error: "No se encuentra el usuario",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(404).send({
        status: "error",
        error: "Las contraseñas no coinciden",
      });
    }

    const userUpdate = await userService.update({
      uid: user,
      userToUpdate: { password: createHash(password) },
    });

    if (!userUpdate) {
      return res.status(404).send({
        status: "error",
        error: "No se encuentra el usuario",
      });
    }

    res.clearCookie("cookieToken").send({
      status: "success",
      message: "La contraseña se cambió correctamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "error",
      error: "Error al verificar el token",
    });
  }
});


router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.cookieToken  
    if(token){
      let user = jwt.verify(token, 'secret')
      const cartId = user.id_cart
      await cartService.removeAllProductsFromCart(cartId)
      // Eliminar la cookie
      res.clearCookie("cookieToken");

      // Envía una respuesta exitosa
      res.status(200).send({
        status: "success",
        message: "Logout successful",
      });
    }else{
      res.status(401).send({
        status: "error",
        error: "No hay sesión iniciada",
      });
    } 
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      error: "Error during logout",
    });
  }
});

router.delete("/user/:uid", async (req, res) => {
  const id = req.params.uid;
  const users = await userService.delete(id);
  res.send({ status: "usuario eliminado con exito", payload: users });
});

module.exports = router;

const { userService } = require("../service/service.js");
const { userModel } = require("../models/user.model.js");
const UserDto = require("../Dto/users.dto.js");
const { createError } = require("../utils/errors/CustomError.js");
const { generateUserErrorInfo } = require("../utils/errors/info.js");
const { EErrors } = require("../utils/errors/enums.js");
const multer = require("multer");
const path = require("path");
const { upload, storage } = require("../middleware/multer.js");
const UserDaoMongo = require("../Daos/Mongo/usersDaoMongo.js");
const { transport } = require("winston");
const { sendMail } = require("../utils/sendMail.js");

class UserController {
  constructor() {
    this.userService = userService;
  }

  getUsers = async (req, res) => {
    try {
      let users = await this.userService.getUsers();
      res.send({ status: "success", payload: users });
    } catch (error) {
      console.log(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      let { nombre, last_name, email } = req.body;
      if (!nombre || !last_name || !email) {
        // return res.send({status: 'error', error: 'incomplete values'})
        createError({
          name: "User creation error",
          cause: generateUserErrorInfo({ nombre, last_name, email }),
          message: "Error tyring to crearted user",
          code: EErrors.INVALID_TYPE_ERROR
        });
      }

      // console.log(newUser)
      // let result = await this.usersService.createUser()

      res.send({ status: "success", payload: "result" });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res) => {
    try {
      let { uid } = req.params;
      let userToReplace = req.body;
      if (
        !userToReplace.first_name ||
        !userToReplace.last_name ||
        !userToReplace.email
      )
        return res.send({ status: "error", error: "incomplete values" });
      let result = await this.userService.update({ uid, userToUpdate });
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.log(error);
    }
  };

  deleteUser = async (req, res) => {
    try {
      let { uid } = req.params;
      let result = await this.userService.delete(uid);
      res.send({ status: "success", payload: result });
    } catch (error) {
      console.log(error);
    }
  };

  deleteUsers = async (req, res) => {
    try {
      const currentDate = new Date();
      const cutoffDate = new Date(
        currentDate.getTime() - 2 * 24 * 60 * 60 * 1000
      );
      const result = await userService.deleteUsers({
        last_connection: { $lt: cutoffDate }
      });
      if (result.length > 0) {
        // Enviar correos electrónicos a los usuarios eliminados
        for (const userEmail of result) {
          await sendMail({
            to: userEmail,
            subject: "Eliminación de cuenta por inactividad",
            html: "Tu cuenta ha sido eliminada debido a la inactividad."
          });
        }
        res.status(200).json({ message: "Usuarios eliminados con éxito." });
      } else {
        res
          .status(500)
          .json({ message: "No se eliminaron usuarios por inactividad" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar usuarios." });
    }
  };

  premiumUser = async (req, res) => {
    const { uid } = req.params;
    const result = await this.userService.updateUser(
      { _id: uid },
      {
        role: "user-premium"
      }
    );
    res.send("usuario paso a premium");
  };

  modRole = async (req, res) => {
    const { uid } = req.params;
    const { newRole } = req.body;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(uid, { role: newRole }, { new: true });

        res.redirect('/users');
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

  subirArchivo = async (req, res) => {
    const uid = req.params.uid;

    try {
      const user = await userService.getUser(uid);
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const uploadPromise = new Promise((resolve, reject) => {
        upload.single("documento")(req, res, err => {
          if (err) {
            console.error(err);
            reject({ message: "Error al cargar el documento" });
          } else {
            resolve();
          }
        });
      });

      await uploadPromise;

      const destination = req.file.destination;
      const nombre = req.file.filename;

      user.documents.push({ name: nombre, reference: destination });

      const newUser = await userService.updateUser(
        { _id: uid },
        { documents: user.documents }
      );

      if (newUser.documents.length >= 3) {
        const userPremium = await userService.updateUser(
          { _id: uid },
          { role: "user-premium" }
        );

        res.send({ message: "Usuario pasó a premium", user: userPremium });
      } else {
        res
          .status(200)
          .json({ message: "Documento subido exitosamente", user: newUser });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
}

module.exports = new UserController();

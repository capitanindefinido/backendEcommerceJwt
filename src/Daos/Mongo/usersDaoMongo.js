const { userModel } = require("../../models/user.model");
const { userDto } = require ("../../Dto/users.dto")
// persistencia/model
class UserDaoMongo {
  constructor(){

  }
  async get() {
    // return this.model.find({})
    //return await userModel.paginate({}, { limit: 20, page: 1 });
    return await userModel.find().select('_id first_name email role')
  }
  async getBy(uid) {
    // {_id: pid} - { email }
    return this.model.findById(uid);
  }
  async getByEmail(filter){
    return this.model.find(filter)
  }
  async crate(newUser) {
    return this.model.create(newUser);
  }
  async update(uid, userToUpdate) {
    if (!uid) {
      throw new Error("El identificador del usuario es obligatorio.");
    }
    return this.model.findByIdAndUpdate(uid, userToUpdate, { new: true });
  }

  async delete(uid) {
    return this.model.findByIdAndDelete({ _id: uid });
  }

  async deleteUsers(filter){
    // Obtener usuarios que coinciden con el filtro
    const usersToDelete = await this.model.find(filter);
    // Obtener los correos electrónicos de los usuarios antes de eliminarlos
    const deletedUserEmails = usersToDelete.map(user => user.email);
    // Eliminar usuarios inactivos
    const result = await this.model.deleteMany(filter);

    if (result.deletedCount > 0) {
      // Si se eliminó al menos un usuario, devolver los correos electrónicos
      return deletedUserEmails;
    } else {
      // No se eliminaron usuarios
      return [];
    }
    //return this.model.usersMongo
  }

  async getIdCartByEmailUser(email) {
    try {
      // Buscar el usuario por correo electrónico en tu modelo de usuario
      const user = await this.model.findOne({ email });
  
      // Verificar si se encontró un usuario y si tiene un rol premium
      if (user && user.id_cart) {
        return user.id_cart;
      } else {
          return null; // O cualquier valor que indique que no se encontró un carrito
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return 'Error al obtener el rol del usuario';
    }
  };

  updateIdCartUser = async ({email, newIdCart}) => {
    try {
      const updatedUser = await this.model.findOneAndUpdate(
        { email: email },
        { $set: { id_cart: newIdCart } },
        { new: true }
      );
  
      if (updatedUser) {
        return updatedUser;
      } else {
        console.error('Usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar el id_Cart del usuario:', error);
      throw error;
    }
  };
}

module.exports = UserDaoMongo;

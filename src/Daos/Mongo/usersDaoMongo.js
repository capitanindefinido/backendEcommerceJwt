const { userModel } = require("../../models/user.model");
const { userDto } = require ("../../Dto/users.dto")
// persistencia/model
class UserDaoMongo {
  constructor() {
    this.model = userModel;
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
}

module.exports = UserDaoMongo;

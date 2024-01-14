const UserDto = require("../Dto/users.dto");

class UserRerpository {
  constructor(dao) {
    this.dao = dao;
  }

  async getUsers() {
    return await this.dao.get();
  }
  async getUser(uid) {
    return await this.dao.getBy(uid);
  }
  async createUser(user) {
    const newUser = new UserDto(user);
    return await this.dao.create(newUser);
  }
  async updateUser(uid, userToUpdate) {
    return await this.dao.update(uid, userToUpdate);
  }
  async deleteUser() {}
}

module.exports = UserRerpository;

const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

class UserService {
  constructor() {
    this.usersFilePath = path.join(__dirname, '../data/users.json');
  }

  async getAllUsers() {
    const data = await this.readUsersFile();
    return data.users.map(({ password, ...user }) => user);
  }

  async getUserById(id) {
    const data = await this.readUsersFile();
    const user = data.users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async getUserByEmail(email) {
    const data = await this.readUsersFile();
    return data.users.find(u => u.email === email);
  }

  async createUser(userData) {
    const data = await this.readUsersFile();
    const newUser = {
      id: data.users.length + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.users.push(newUser);
    await this.writeUsersFile(data);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(id, updates) {
    const data = await this.readUsersFile();
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    data.users[index] = {
      ...data.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.writeUsersFile(data);
    const { password, ...userWithoutPassword } = data.users[index];
    return userWithoutPassword;
  }

  async deleteUser(id) {
    const data = await this.readUsersFile();
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) return false;

    data.users.splice(index, 1);
    await this.writeUsersFile(data);
    return true;
  }

  async readUsersFile() {
    try {
      const data = await fs.readFile(this.usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { users: [] };
    }
  }

  async writeUsersFile(data) {
    await fs.writeFile(this.usersFilePath, JSON.stringify(data, null, 2));
  }

  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

module.exports = new UserService(); 
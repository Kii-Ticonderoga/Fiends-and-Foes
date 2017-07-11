var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  status: String
})

const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel

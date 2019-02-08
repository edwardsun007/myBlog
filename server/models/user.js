const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
  firstname: { type: String, require: true },
  lastname: { type: String, required: true},
  email: { type: String, require: true, unique: true },
  password: { type:String, require: true }
}, {timestamps: true});

userSchema.plugin(uniqueValidator, { message: '{PATH} Exists!' }); // add validator as plugin

module.exports =  mongoose.model("User", userSchema); // turn blueprint into model

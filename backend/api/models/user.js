const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: String,
    cpf: String,
    email: String,
    phone: String,
    address: {
        zipcode: String,
        street: String,
        number: String,
        neighborhood: String,
        city: String,
        state: String,
        country: String
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model("User", UserSchema);
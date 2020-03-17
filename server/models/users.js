const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema ({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    last_name: {type: String, require: true},
    identity: {type: String, require: true},
    cpf: {type: String, require: true, unique: true},
    date_of_birth: {type: Date, require: true},
    phone: {type: String, require: true},
    address: {type: mongoose.Schema.Types.ObjectId, ref: 'addresses'},
    active: {type: Boolean, require: true},
    creation_date: {type: Date, require: true},
    update_date: {type: Date, require: true},
});

module.exports = mongoose.model('users', UsersSchema);
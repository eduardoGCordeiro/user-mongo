const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema ({
    country: {type: String, require: true},
    state: {type: String, require: true},
    city: {type: String, require: true},
    neighborhood: {type: String, require: true},
    street: {type: String, require: true},
    number: {type: String, require: true},
    complement: {type: String, require: true}
});

module.exports = mongoose.model('addresses', AddressSchema);
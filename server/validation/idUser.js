const mongoose = require('mongoose');

module.exports = (id) => {

    if(mongoose.Types.ObjectId.isValid(id)){
        return {valid: true, error: ''};
    }else {
        return {valid: false, error: 'user_id enviado não é valido.'};
    }

}
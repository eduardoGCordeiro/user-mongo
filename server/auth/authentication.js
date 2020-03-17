const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = require('../models/users');
const idUserValidation = require('../validation/idUser');

const passfrase = 'eduardo';

module.exports = (req, res, next) => {
    
    try {
    
        let token = req.headers['x-access-token'];

        if(token){
            jwt.verify(token, passfrase, (error, decoded) => {

                if(error){
                    res.status(500).send( { message: 'Algo inesperado aconteceu.', error:  error} );
                }else {
            
                    let user_id = idUserValidation(decoded.data);

                    if(user_id.valid){

                        Users.findById(mongoose.Types.ObjectId(decoded.data))
                             .where({ active: true })
                             .then(user => {

                                if(user !== null){
                                    next();
                                }else {
                                    res.status(403).send(`<div style="text-align: center">
                                                            <h1>Erro: 403 </h1>
                                                            <h2>Acesso negado!</h2>
                                                          </div>`);
                                }        

                             })
                             .catch(e => {
                                 res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
                             });
            
                    }else {
                        throw('O token inserido não é válido.');
                    }
                }
            });

        }else {
            throw('parâmetro header "x-access-token" não enviado!');
        }

    }catch (e){
        res.status(500).send(`Algo inesperado aconteceu. Erro: ${e}`);
    }
};
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Users = require('./models/users');
const Address = require('./models/address');
const operators = require('./utils/operators');
const postUserValidation = require('./validation/postUser');
const idUserValidation = require('./validation/idUser');
const authentication = require('./auth/authentication');
const connectionDB = require('./connectionDB/connectionDB');

const app = express();
const port = 5000; 
const saltRounds = 10;
const passfrase = 'eduardo'

app.use(bodyParser.json());

connectionDB();

app.get('/', (req, res) => {
    
    res.status(500).send(`<div style="text-align: center">
                            <h1>Bem-vindo a nossa API.</h1>
                            <h2>API de usuários.</h2>
                          </div>`);
});


app.post('/login', (req, res) => {

    try{

        if(req.body.email){
            if(req.body.password){

                Users.findOne({
                    email: req.body.email
                }) 
                .where({ active: true })
                .then(user => {

                    if(user !== null){
                        
                        if( bcrypt.compareSync( req.body.password, user.password ) ){
                            let token = jwt.sign( { data: user._id }, passfrase, { expiresIn: '10min'} );
                            res.status(200).send( { message: 'login realizado com sucesso!', token: token } );
                        }else {
                            throw ('Senha inválida!');
                        }    

                    }else {
                        throw ('Usuário não encontrado, verifique o email.');
                    }
                })
                .catch(e => {
                    res.status(500).send( {  message: 'Algo inesperado aconteceu.', error:  e} );
                });
            }else {
                throw ('parâmetro *password* não informado!');
            }
        }else {
            throw ('parâmetro *email* não informado!');
        }

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    }

});

  
app.get('/me', (req, res) => {

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
                             .populate('address')
                             .where( {active: true} )
                             .then(user => {
                                if(user != null){
                                    res.status(200).send( {message: `Token válido!`, user} );
                                }else {
                                    res.status(200).send( {message: 'O token fornecido não corresponde a nenhum usuário.'} );
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

});


app.post('/user', authentication, (req, res) => {

    try{

        let fields = postUserValidation(req.body);
        
        if(fields.valid){

            var address = new Address({
                country: req.body.address.country,
                state: req.body.address.state,
                city: req.body.address.city,
                neighborhood: req.body.address.neighborhood,
                street: req.body.address.street,
                number: req.body.address.number,
                complement: req.body.address.complement,
            });

            address.save()
                   .then((address) => {

                        var user = new Users({
                            name: req.body.name,
                            email: req.body.email,
                            password: bcrypt.hashSync(req.body.password, saltRounds),
                            last_name: req.body.last_name,
                            identity: req.body.identy,
                            cpf: req.body.cpf,
                            date_of_birth: req.body.date_of_birth,
                            phone: req.body.phone,
                            address: address._id,
                            active: true,
                            creation_date: new Date(),
                            update_date: new Date()
                        });
                    
                        user.save()
                             .then((user) => {
                                 res.status(200).send( {message: `Usuário ${user._id} salvo com sucesso!`} );
                             })
                             .catch((error) => {
                                res.status(500).send( {message: 'Não foi possível salvar o usuário.', error:  `Erro: ${error}`} );
                             });
                                   
                   })
                   .catch((error) => {
                      res.status(500).send( {message: 'Não foi possível salvar o endereço do usuário.', error:  `Erro: ${error}`} );
                   });

        }else {
            throw(`Verifique os parâmetros inválidos${fields.error}`);
        }

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    }

});

app.get('/user/filter', (req, res) => {

    try{
        if(req.query.name){
            if(req.query.date){
                if(req.query.operator){

                    let operator = {[operators[req.query.operator]]: [req.query.date]};

                    Users.find( { name: {$regex: req.query.name, $options: 'i' }, creation_date: operator})
                         .populate('address')
                         .then(users => {
                             res.status(200).send(users);        
                         })
                         .catch(e => {
                             res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
                         });


                }else {
                    throw ('parâmetro *operator* não enviado!');
                }

            }else {

                Users.find( { name: {$regex: req.query.name, $options: 'i' }})
                 .populate('address')
                 .then(users => {
                     res.status(200).send(users);        
                 })
                 .catch(e => {
                     res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
                 });

            }

        }else {
            throw ('parâmetro *name* não enviado!');
        }

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    }
  
});


app.get('/user/:user_id', authentication, (req, res) => {

    try{
        
        let user_id = idUserValidation(req.params.user_id);

        if(user_id.valid){

            Users.findById(req.params.user_id)
                 .where( {active: true} )
                 .populate('address')
                 .then(users => {
                     res.status(200).send(users);        
                 })
                 .catch(e => {
                     res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
                 });


        }else {
            throw(user_id.error);
        }

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    };
  
});


app.patch('/user/:user_id', authentication, (req, res) => {

    try{
        
        let user_id = idUserValidation(req.params.user_id);

        if(user_id.valid){

            if(req.body.password){
                req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
            }

            Users.updateOne({_id: req.params.user_id}, {$set: req.body})
                 .then(() => {
                    res.status(200).send( {message: `Usuário ${req.params.user_id} atualizado com sucesso!`} );
                 })
                 .catch(e => {
                     res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
                 });

        }else {
            throw(user_id.error);
        }

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    };

});


app.delete('/user/:user_id', authentication, (req, res) => {


    try{
        
        let user_id = idUserValidation(req.params.user_id);

        if(user_id.valid){

            Users.updateOne({_id: req.params.user_id}, {$set: {active: false}})
                 .then(() => {
                    res.status(200).send( {message: `Usuário ${req.params.user_id} deletado com sucesso!`} );
                 })
                 .catch(e => {
                     res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
                 });

        }else {
            throw(user_id.error);
        }

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    };

});


app.get('/users', authentication, (req, res) => {
    
    try{

        if(req.query.page){

            let page = parseInt(req.query.page);
            let number_of_records = 5;

            Users.find( {} )
                 .where( {active: true} )
                 .populate('address')
                 .sort({ creation_date: 'asc'})
                 .skip((page-1) * number_of_records)
                 .limit(number_of_records)
                 .then(users => {
                     res.status(200).send(users);        
                 })
                 .catch(e => {
                     res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
                 });

        }else {
            throw ('parâmetro *page* não enviado!');
        }

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    }

});


app.get('/users/aggregate', authentication, (req, res) => {
    
    try{

        Users.aggregate()
             .match({active: false})
             .sort({creation_date: 'dsc'})
             .limit(5)
             .then(users => {
                 res.status(200).send(users);        
             })
             .catch(e => {
                 res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
             });

    }catch (e){
        res.status(500).send( {message: 'Algo inesperado aconteceu.', error:  e} );
    }

});


app.all('*', function(req, res){

    res.status(404).send(`<div style="text-align: center">
                            <h1>Erro: 404 </h1>
                            <h2>Rota inexistente. Por favor, entre em contato com o desenvolvedor.</h2>
                          </div>`);

})


app.listen(port);
console.log(`servidor iniciado na porta ${port}.`);
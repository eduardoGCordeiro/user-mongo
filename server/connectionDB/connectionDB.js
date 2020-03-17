const mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const database = 'users-mongo';  

module.exports = () => {
    mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,})
            .then(() => {
              console.log('Conexão com o banco de dados realizada com sucesso!')
            })
            .catch(error => {
              console.error(`Erro ao conectar com o banco de dados! Erro: ${error}`);
            });
};

Para instalar o projeto basta descompactar o desafio.tar.gz 
fornecido por email em uma pasta de sua preferência e digitar 
o comando: 

    npm install

Após instalar o projeto entre na pasta *server* e digite o comando:

    node server.js

**OBS: A senha de login de todos os usuários é "123".

************************** POST /login **************************

request: 
    body: json com todos o email e password do usuário,  
          onde a key é o parâmetro a ser enviado e o valor 
          o conteúdo a ser salvo no banco de dados. 
    
    ex: {
        	"email": "teste@teste10.com",
        	"password": "teste"
        }

response: 
    Sucesso:
        message: mensagem de aviso da API.
        token: token de acesso.
    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************


************************* GET /me *******************************

request: 
    headers: x-access-token (com o token gerado pela rota de login).

response: 
    Sucesso:
        message: mensagem de aviso da API.
        user: dados do usuário do token fornecido.
    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************


************************* POST /user ****************************

request: 
    headers: x-access-token (com o token gerado pela rota de login).
    
    body: json com todos os dados do usuário,  onde a key é o 
          parâmetro a ser enviado e o valor o conteúdo a ser 
          salvo no banco de dados. 
    
    body ex: {
            "name": "eduardo-teste-novo",
            "last_name": "eduardo novo",
            "email": "teste@teste5.com",
            "password": "123",
            "identity": "12.345.618-9",
            "cpf": "123.456.729-40",
            "date_of_birth": "1887-10-10",
            "phone": "(42) 999999999",
            "address": {
            	"country": "BR",
            	"state": "PR",
            	"city": "Ponta grossa",
            	"neighborhood": "centro",
            	"street": "munchen",
            	"number": "132",
            	"complement": "cavan"
            }
        }

response: 
    Sucesso:
        message: mensagem de aviso da API com o id do novo usuário.

    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.


*****************************************************************


************************* GET /user/filter **********************

request: 
    headers: x-access-token (com o token gerado pela rota de login).
    
    query params: 
            name: nome do usuário para a busca.
            date: data que irá filtrar.
            operator: operador para o filtro da data;

    url ex: http://localhost:5000/user/filter/?name=eduardo&date=2020-03-16&operator==

response: 
    Sucesso:
        array com todos os usuários correspondentes ao filtro usado.

    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************


************************ GET /user/:user_id *********************

request: 
    headers: x-access-token (com o token gerado pela rota de login).
    
    query params: 
            user_id: id do usuário que irá buscar.

    url ex: http://localhost:5000/user/5e7013814f27db2d1522fe6b

response: 
    Sucesso:
        array com o usuário correspondente ao id inserido.

    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************


*********************** PATCH /user/:user_i*d *******************

request: 
    headers: x-access-token (com o token gerado pela rota de login).
    
    query params: 
            user_id: id do usuário que irá buscar.

    body: json com todos os dados a serem atualizados,  onde a 
          key é o parâmetro a ser enviado e o valor o conteúdo a 
          ser salvo no banco de dados. 

    url ex: http://localhost:5000/user/5e7013814f27db2d1522fe6b

    body ex:{
            	"password": "teste"
            }

response: 
    Sucesso:
        message: mensagem contendo o id do usuário atualizado.

    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************


********************** DELETE /user/:user_id ********************

request: 
    headers: x-access-token (com o token gerado pela rota de login).
    
    query params: 
            user_id: id do usuário que irá buscar.

    url ex: http://localhost:5000/user/5e7013814f27db2d1522fe6b

response: 
    Sucesso:
        message: mensagem contendo o id do usuário atualizado.

    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************


********************** GET /users *******************************

request: 
    headers: x-access-token (com o token gerado pela rota de login).

    query params: 
            page: número da página a ser exibida.

    url ex: http://localhost:5000/users/?page=5

response: 
    Sucesso:
        array contendo todos os usuários da página especificada. 

    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************


********************** GET /users/aggregate *********************

request: 
    headers: x-access-token (com o token gerado pela rota de login).
    
    query params: 
            user_id: id do usuário que irá buscar.

    url ex: http://localhost:5000/user/5e7013814f27db2d1522fe6b

response: 
    Sucesso:
        array contendo todos os usuários do filtro da query 
        (será exibido 5 usuários deletados por ordem decrescente). 

    Erro: 
        message: mensagem de aviso da API.
        error: mensagem com o erro da API.

*****************************************************************

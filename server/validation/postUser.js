module.exports = (data) => {

    var valid = false;
    var error = '';

    if(!data.address){
        error += ', *endereço* do usuário não fornecido';
    }else {
        if (!data.address.country){
            error += ', parâmetro *country* não enviado';
        }
    
        if (!data.address.state){
            error += ', parâmetro *state* não enviado';
        }
    
        if (!data.address.city){
            error += ', parâmetro *city* não enviado';
        }
    
        if (!data.address.neighborhood){
            error += ', parâmetro *neighborhood* não enviado';
        }
    
        if (!data.address.street){
            error += ', parâmetro *street* não enviado';
        }
    
        if (!data.address.number){
            error += ', parâmetro *address_number* não enviado';
        }
    
        if (!data.address.complement){
            error += ', parâmetro *complement* não enviado';
        }
    }

    if (!data.name){
        error += ', parâmetro *name* não enviado';
    }

    if (!data.email){
        error += ', parâmetro *email* não enviado ';
    }

    if (!data.password){
        error += ', parâmetro *password* não enviado';
    }

    if (!data.last_name){
        error += ', parâmetro *last_name* não enviado';
    }

    if (!data.identity){
        error += ', parâmetro *identity* não enviado';
    }

    if (!data.cpf){
        error += ', parâmetro *cpf* não enviado';
    }

    if (!data.date_of_birth){
        error += ', parâmetro *date_of_birth* não enviado';
    }

    if (!data.phone){
        error += ', parâmetro *phone* não enviado';
    }

    error === '' ? valid = true : valid = false;

    return {valid: valid, error: error};
};
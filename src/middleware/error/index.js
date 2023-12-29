const { EErrors } = require("../../utils/errors/enums");


exports.errorHandleMidd = (error, req, res, next) => {
    // console.log('handle error mid',error.cause)
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            req.logger.error(`Error de tipo inválido ${error.name}`)
            return res.send({
                status: 'error', 
                error: error.name
            })
            break;
    
        default:
            req.logger.fatal(`Error fatal del server ${error.name}`)
            return res.status(500).send({status: 'error', error: 'Error de server'})
            break;
    }
}
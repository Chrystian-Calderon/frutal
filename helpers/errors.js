const createErrorFactory = function (name) {
    return class buildingError extends Error {
        constructor(message, statusCode) {
            super(message);
            this.name = name;
            this.statusCode = statusCode;
        }
    }
}

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: process.env.NODE_ENV === 'production' ? 'Error en el servidor' : err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const validateUserError = createErrorFactory('UserError');
const validatePasswordError = createErrorFactory('PasswordError');

module.exports = {validateUserError, validatePasswordError, errorHandler};
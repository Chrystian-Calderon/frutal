const { validatioUserError, validatePasswordError } = require('./errors');

const validateUser = (username) => {
    if (!username) throw new validatioUserError('usuario es requerido', 400);
    if (typeof username !== 'string') throw new validatioUserError('Usuario no valido', 400);
    if (typeof username.length < 3) throw new validatioUserError('El usuario debe ser más de 3 caracteres de longitud', 400);

    return true;
}

const validatePassword = (password) => {
    if (!password) throw new validatePasswordError('Contraseña requerida', 400);
    if (typeof password !== 'string') throw new validatePasswordError('La contraseña no es valida', 400);
    if (password.length < 6) throw new validatePasswordError('La contraseña debe ser 6 o más caracteres de longitud', 400);

    return true;
}

module.exports = {validateUser, validatePassword};
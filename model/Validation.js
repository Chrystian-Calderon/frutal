class Validation {
    static username(username) {
        if (typeof username !== 'string') throw new Error('El usuario no es una cadena');
        if (username.length < 3) throw new Error('El usuario debe ser más de 3 caracteres de longitud');
    }

    static password(password) {
        if (typeof password !== 'string') throw new Error('La contraseña no es valida');
        if (password.length < 6) throw new Error('La contraseña debe ser 6 o más caracteres de longitud');
    }
}

module.exports = Validation;
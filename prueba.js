const bcrypt = require('bcrypt');

const plainPassword = 'leonardo';

const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error al generar el hash:', err);
        return;
    }

    console.log('Hash generado:', hash);

    // Verifica la contraseña comparándola con el hash
    bcrypt.compare(plainPassword, hash, (err, result) => {
        if (err) {
            console.error('Error al comparar:', err);
            return;
        }

        if (result) {
            console.log("La contraseña es correcta.");
        } else {
            console.log("La contraseña es incorrecta.");
        }
    });
});
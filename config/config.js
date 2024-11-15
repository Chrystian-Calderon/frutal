const {
    PORT = 5000,
    SALT_ROUNDS = 10,
    SECRET_KEY = "helados!frutal#para$el%proyecto&de/grado(que)estoy=realizando ñ"
} = process.env;

module.exports = {PORT, SALT_ROUNDS, SECRET_KEY};
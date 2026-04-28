require('dotenv').config()

// Si no existe la variable PORT el servidor no arranca
if (!process.env.PORT) {
  throw new Error('El puerto no está definido en el archivo .env')
}

module.exports = {
  PORT: process.env.PORT
}
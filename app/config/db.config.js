//db.config.js
module.exports = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: 'Casa1403.',
  DB: 'db_jwtbootcamp',
  dialect: 'postgres',
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
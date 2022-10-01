module.exports = {
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'customdb',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: process.env.DB_DIALECT || 'mysql',
  port: process.env.DB_PORT || '3306',
  timezone: '+08:00',
  dialectOptions: {
    multipleStatements: true,
  },
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
}

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    underscored: true, // allows names in snake_case
    timestamps: false
  },
  logging: false,
  pool: { // Sequelize connection pool configuration
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released.
    acquire: 30000 // The maximum time, in milliseconds, that pool will try to get connection before throwing error
  },
  dialect: "postgres", // The dialect of the database you are connecting to
  dialectOptions: { // An object of additional options, which are passed directly to the connection library
    ssl: {
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
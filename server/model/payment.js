const sequelize = require("../database/dbconfig");
const Sequelize = require("sequelize");
const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    gateway: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
    },
    reference_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "payment",
  }
);
module.exports = Payment;

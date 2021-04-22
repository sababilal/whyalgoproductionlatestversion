const Sequelize = require("sequelize");
require("../database/dbconfig");

const Wishlist = sequelize.define(
  "wishlist",
  {
    id: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    date_added: {
      type: Sequelize.DATE,
    },
    quantity: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
    },
  },

  {
    timestamps: false,
    tableName: "wishlist",
  }
);

module.exports = Wishlist;

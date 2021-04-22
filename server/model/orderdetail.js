const sequelize = require("../database/dbconfig");
const Sequelize = require("sequelize");
const Invitation = require("./invitation.js");
const Orderdetail = sequelize.define(
  "order_detail",
  {
    id: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    quantity: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
    },
    unit_price: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "order_detail",
  }
);

//Associations
Orderdetail.hasMany(Invitation, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "order_detail_id",
    type: Sequelize.BIGINT(20),
    allowNull: false,
  },
});

Invitation.belongsTo(Orderdetail, {
  foreignKey: {
    name: "order_detail_id",
  },
});

module.exports = Orderdetail;

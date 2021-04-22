const Sequelize = require("sequelize");
const Discovery = require("../model/discovery");
require("../database/dbconfig");

const Why = sequelize.define(
  "why",
  {
    id: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    resource_link: {
      type: Sequelize.TEXT,
    },
  },

  {
    timestamps: false,
    tableName: "why",
  }
);

// Association Between Why Table and Discovery Table as (why_id) is foreign key in Discovery table
Why.hasMany(Discovery, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "why_id",
    type: Sequelize.BIGINT(20),
    allowNull: false,
  },
});

Discovery.belongsTo(Why, {
  foreignKey: {
    name: "why_id",
  },
});

module.exports = Why;

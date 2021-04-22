const { Sequelize } = require("sequelize");
require("../database/dbconfig.js");

const Courseprogress = sequelize.define(
  "course_progress",
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    completed_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "course_content",
    timestamps: false,
  }
);

module.exports = Courseprogress;

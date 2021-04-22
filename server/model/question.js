const sequelize = require("../database/dbconfig");
const Sequelize = require("sequelize");
const Option = require("./option.js");
const Question = sequelize.define(
  "question",
  {
    id: {
      type: Sequelize.BIGINT(20),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "question",
  }
);

//Associations

Question.hasMany(Option, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "question_id",
    type: Sequelize.BIGINT(20),
    allowNull: false,
  },
});
Option.belongsTo(Question, {
  foreignKey: {
    name: "question_id",
  },
});
module.exports = Question;

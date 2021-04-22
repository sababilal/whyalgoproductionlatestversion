const { Sequelize } = require("sequelize");
require("../database/dbconfig.js");
const Coursecontent = require("./coursecontent.js");
const Discovery = require("./discovery.js");
const Event = require("./event.js");
const Orderdetail = require("./orderdetail.js");
const Question = require("./question.js");
const Wishlist = require("./wishlist.js");

const Course = sequelize.define(
  "course",
  {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "course",
    timestamps: false,
  }
);

// One to Many relationship between Course and Coursecontent

Course.hasMany(Coursecontent, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "course_id",
    type: Sequelize.BIGINT,
    allowNull: false,
  },
});

Coursecontent.belongsTo(Course, {
  foreignKey: {
    name: "course_id",
  },
});

// One to Many relationship between Course and Discovery

Course.hasMany(Discovery, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "course_id",
    type: Sequelize.BIGINT,
    allowNull: false,
  },
});

Discovery.belongsTo(Course, {
  foreignKey: {
    name: "course_id",
  },
});

// One to Many relationship Between Event and Course
Course.hasMany(Event, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "course_id",
    type: Sequelize.BIGINT(20),
    allowNull: false,
  },
});

Event.belongsTo(Course, {
  foreignKey: {
    name: "course_id",
  },
});

//One to Many relationship between Course and Orderdetail

Course.hasMany(Orderdetail, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "course_id",
    type: Sequelize.BIGINT(20),
    allowNull: false,
  },
});
Orderdetail.belongsTo(Course, {
  foreignKey: {
    name: "course_id",
  },
});

//One to Many Relationship between Course and Question
Course.hasMany(Question, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "course_id",
    type: Sequelize.BIGINT(20),
    allowNull: false,
  },
});
Question.belongsTo(Course, {
  foreignKey: {
    name: "course_id",
  },
});

// One to Many relationship Between CART and  COURSE
Course.hasMany(Wishlist, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: {
    name: "course_id",
    type: Sequelize.BIGINT(20),
    allowNull: false,
  },
});

Wishlist.belongsTo(Course, {
  foreignKey: {
    name: "course_id",
  },
});

module.exports = Course;

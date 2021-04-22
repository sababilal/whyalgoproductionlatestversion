const Sequelize = require("sequelize");
const Order = require("../model/order")

require("../database/dbconfig");

const Event = sequelize.define(
    "event",
    {
        id: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
        },
        venue: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        time: {
            type: Sequelize.TIME,
            allowNull: false,
        },
        duration: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    
    },

    {
        timestamps: false,
        tableName: "event",
    }
);

// Association Between Event Table and Order Table as (event_id) is foreign key in Order Table
Event.hasMany(Order, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
    foreignKey: {
      name: "event_id",
      type: Sequelize.BIGINT(20),
      allowNull: false,
    },
  });
  Order.belongsTo(Event, {
    foreignKey: {
      name: "event_id",
    },
  });
  
module.exports = Event;
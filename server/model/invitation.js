const Sequelize = require("sequelize");
require("../database/dbconfig");

const Invitation = sequelize.define(
    "invitation",
    {
        id: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        coupon_code: {
            type: Sequelize.STRING,
        },
        invitation_date: {
            type: Sequelize.DATE,
        },
        expiration_date: {
            type: Sequelize.DATE,
        },
        
    },

    {
        timestamps: false,
        tableName: "invitation",
    }
);

module.exports = Invitation;
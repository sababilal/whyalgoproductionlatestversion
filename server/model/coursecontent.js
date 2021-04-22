const {Sequelize} = require('sequelize');
require('../database/dbconfig.js');
const Courseprogress=require('./courseprogress.js');


        const Coursecontent= sequelize.define('course_content',{
        id:{
            type:Sequelize.BIGINT,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        content:{
            type: Sequelize.TEXT,
            allowNull:false
        }
        },{
            tableName:'course_content',
            timestamps: false
        });
  
  // One to Many relationship between Coursecontent and Courseprogress

  Coursecontent.hasMany(Courseprogress,{
    onDelete : "RESTRICT",
    onUpdate : "RESTRICT",
    foreignKey:{
        name:"course_content_id",
        type:Sequelize.BIGINT,
        allowNull:false,
    },
});

Courseprogress.belongsTo(Coursecontent,{
    foreignKey:{
        name : "course_content_id",
    },
});      

module.exports=Coursecontent;
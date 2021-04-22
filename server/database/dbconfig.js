const {Sequelize} = require('sequelize');

     const sequelize=new Sequelize(
        'whytest','root','',{
            dialect: 'mysql',
            host: 'localhost'
    });
 
module.exports=sequelize;  // replaced dbconnect with sequelize
global.sequelize=sequelize; //added
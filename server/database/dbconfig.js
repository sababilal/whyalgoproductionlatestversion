const {Sequelize} = require('sequelize');

     const sequelize=new Sequelize(
        'sql6408019','sql6408019','UZ6s6q9DvR',{
            dialect: 'mysql',
            host: 'sql6.freemysqlhosting.net',
            port:3306
    });
 

    // const sequelize=new Sequelize(
    //     'whytest','root','',{
    //         dialect: 'mysql',
    //         host: 'localhost'
    // });

module.exports=sequelize;  // replaced dbconnect with sequelize
global.sequelize=sequelize; //added
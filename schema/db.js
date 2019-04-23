const { Sequelize } = require('sequelize');
const md5 = require('md5');

const uuid = require('uuid/v4');
require('dotenv').config();


const Conn = new Sequelize(process.env.DB_CON, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true
    }
});

const Card = Conn.define('card', {
  _id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: () => uuid()
  },
  french: {
    type: Sequelize.STRING,
    allowNull: false
  },
  english: {
    type: Sequelize.STRING,
    allowNull: false
  },
  wordType: {
    type: Sequelize.STRING,
    allowNull: false
  }

});

const User = Conn.define('user', {
  _id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: () => uuid()
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});


const Score = Conn.define('score', {
  _id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: () => uuid()
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
});


User.hasMany(Score, {foreignKey: 'userid'});
Card.hasMany(Score, {foreignKey: 'wordid'});



// const { WORD_ARR } = require('./dbinit');
// import _ from 'lodash';
// import Faker from 'faker';
//
// Conn.sync({force: true}).then(() => {
//
//  User.create({
//     username: 'jellybiens',
//     password: md5('password'),
//     admin: true
//   });
//  User.create({
//     username: 'guest',
//     password: md5('password123'),
//     admin: false
//   });
//
//   WORD_ARR.map((v, i)=>{
//
//     return Card.create({
//       french: v.french,
//       english: v.english,
//       wordType: v.wordType
//     });
//   });
//
// });

module.exports = Conn;

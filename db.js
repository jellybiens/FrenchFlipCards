import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';
import md5 from 'md5';

//TODO move to .env
const Conn = new Sequelize('postgres://fspcxkbwvrqkji:58bed6f064097aef57279df0b605ceda656ff0e66d63a6a7469ab53c42034479@ec2-54-246-92-116.eu-west-1.compute.amazonaws.com:5432/d2mi6qqntgbeu', {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true
    }
});

const Card = Conn.define('card', {
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
  score: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
});


User.hasMany(Score, {foreignKey: 'userid'});
Card.hasMany(Score, {foreignKey: 'wordid'});




// Conn.sync({force: true}).then(() => {
//
//  User.create({
//     username: 'jellybiens',
//     password: md5('password'),
//     admin: true
//   });
//
//   _.times(2, ()=>{
//     return User.create({
//       username: Faker.internet.userName(),
//       password: md5(Faker.internet.password()),
//       admin: false
//     });
//   });
//
//   let wordArr = [
//                   {"french":"aller","english":"to go","wordType":"verb"},
//                   {"french":"vouloir","english":"to want","wordType":"verb"},
//                   {"french":"etre","english":"to be","wordType":"verb"},
//                   {"french":"une tasse","english":"a cup","wordType":"noun"},
//                   {"french":"un stylo","english":"a pen","wordType":"noun"}
//                 ];
//
//   wordArr.map((v, i)=>{
//     return Card.create({
//       french: v.french,
//       english: v.english,
//       wordType: v.wordType
//     });
//   });
//
//   Score.create({
//          userid: 1,
//          wordid: 1,
//          score: 3
//        });
//        Score.create({
//               userid: 1,
//               wordid: 3,
//               score: 1
//             });
//
// });

export default Conn;

import Sequelize from 'sequelize';
import {  GraphQLObjectType,
          GraphQLID,
          GraphQLInt,
          GraphQLString,
          GraphQLBoolean,
          GraphQLList,
          GraphQLSchema,
          GraphQLNonNull } from 'graphql';
import Db from './db';
import md5 from 'md5';

const jwt = require('jsonwebtoken');

const Card = new GraphQLObjectType({
  name: 'Card',
  description: 'A word translation',
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
        resolve(card) {
          return card._id
        }
      },
      french: {
        type: GraphQLString,
        resolve(card) {
          return card.french
        }
      },
      english: {
        type: GraphQLString,
        resolve(card) {
          return card.english
        }
      },
      wordType: {
        type: GraphQLString,
        resolve(card) {
          return card.wordType
        }
      }
    }
  }

});

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This is a user of the app',
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
        resolve(user) {
          return user._id
        }
      },
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.username
        }
      },
      password: {
        type: GraphQLString,
        resolve(user) {
          return user.password
        }
      },
      admin: {
        type: GraphQLBoolean,
        resolve(user) {
          return user.admin
        }
      }
    }
  }
});


const AuthData = new GraphQLObjectType({
  name: 'AuthData',
  description: 'Authentication for a user login',
  fields: () => {
    return {
      userid: {
        type: GraphQLID,
        resolve(auth) {
          return auth.userid
        }
      },
      token: {
        type: GraphQLString,
        resolve(auth) {
          return auth.token
        }
      },
      tokenExpiration: {
        type: GraphQLString,
        resolve(auth) {
          return auth.tokenExpiration
        }
      }
    }
  }
});

const Score = new GraphQLObjectType({
  name: 'Score',
  description: 'A users familiarality with words',
  fields: () => {
    return {
      _id: {
        type: GraphQLID,
        resolve(score) {
          return score._id
        }
      },
      userid: {
        type: GraphQLID,
        resolve(score) {
          return score.userid
        }
      },
      wordid: {
        type: GraphQLID,
        resolve(score) {
          return score.wordid
        }
      },
      score: {
        type: GraphQLInt,
        resolve(score) {
          return score.score
        }
      }
    }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return{
      cardsAll: {
        type: new GraphQLList(Card),
        // args securely only permit certain types of arguments
        args: {
          _id: {
            type: GraphQLID
          },
          wordType: {
            type: new GraphQLList(GraphQLString)
          }
        },
        resolve(root, args) {
          return Db.models.card.findAll({where: args, order: Sequelize.literal('random()')})
        }
      },

      cardsFocussed: {
        type: new GraphQLList(Card),
        // args securely only permit certain types of arguments
        args: {
          wordType: {
            type: new GraphQLList(GraphQLString)
          },
          userid: {
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        //resolve(root, args) {
        //  return Db.models.card.findAll({where: args, order: Sequelize.literal('random()')})
        //}
        resolve(root, args){

          let wordTypes = args.wordType.map(wt => `'${wt}'`).join(',');

          return Db.query(`
            SELECT * FROM
            (SELECT c._id, c.french, c.english, c."wordType"
            FROM "cards" c, "scores" s
            WHERE c._id = s.wordid
            AND   s.userid = '${args.userid}'
            AND   s.score <= (SELECT avg(s.score)
                            FROM "cards" c, "scores" s
                            WHERE c._id = s.wordid
                            AND   s.userid = '${args.userid}')
            AND c."wordType" IN (${wordTypes})

            UNION

            SELECT DISTINCT _id, french, english, "wordType"
            FROM "cards"
            WHERE _id NOT IN ( SELECT wordid
                                FROM "scores"
                                WHERE userid = '${args.userid}')
            AND "wordType" IN (${wordTypes})) AS Cards
            ORDER BY random();
            `, {
              model: Db.models.card,
              mapToModel: true
            });
        }
      },

      user: {
        type: User,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, args) {
          return Db.models.user.findOne({ where: {username: args.username, password: md5(args.password)}})
          .then(res => {
              if (res == null) {
                throw new Error("Invalid username and/or password.");
              }
              return res
          });
        }
      },

      login: {
        type: AuthData,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, args) {
          return Db.models.user.findOne({ where: { username: args.username, password: md5(args.password) }})
          .then(user => {

            if(!user) throw new Error("Invalid login credentials.");
            //TODO ENV file
            const stringHash = user.admin ? 'adminTODOchangeSuperSecretKeyInENV' : 'normieTODOchangeSuperSecretKeyInENV';

            const token = jwt.sign({userid: user._id,
                                  username: user.username },
                                  stringHash,
                                 { expiresIn: '1h' }
                                );

                    return {userId: user._id,
                            token: token,
                            tokenExpiration: 1
                            };

          });
        }
      },



      users: {
        type: new GraphQLList(User),
        args: {
          username: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return Db.models.user.findAll({where: args});
        }
      },

      scores: {
        type: new GraphQLList(Score),
        args: {
          userid: {
            type: new GraphQLNonNull(GraphQLID)
          },
          wordid: {
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve(root, args) {
          return Db.models.score.findAll({where: args})
        }
      }
    }
  }
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions for updating database',
  fields(){
    return{
      addUser: {
        type: User,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          },
          admin: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve(_, args){

          return Db.models.user.findOne({where: {username: args.username}})
          .then(res => {
              if (res != null) {
                throw new Error("Username already exists.");
              }
              return Db.models.user.create({
                username: args.username,
                password: md5(args.password),
                admin: false
              });
          });
        }
      },

      addCard: {
        type: Card,
        args: {
          french: {
            type: new GraphQLNonNull(GraphQLString)
          },
          english: {
            type: new GraphQLNonNull(GraphQLString)
          },
          wordType: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args){
          return Db.models.card.create({
            french: args.french.toLowerString(),
            english: args.english.toLowerString(),
            wordType: args.wordType
          });
        }
      },

      updateScorePos: {
        type: Score,
        args: {
          userid: {
            type: new GraphQLNonNull(GraphQLID)
          },
          wordid: {
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve(_, args){
          return Db.models.score.findOne({ where: args })
            .then((obj) => {
                if(obj) { // update
                    return obj.update({ score: obj.score + 1 });
                }
                else { // insert
                    return Db.models.score.create({ userid: args.userid, wordid: args.wordid, score: 1 });
                }
            });
        }
      },

      updateScoreNeg: {
        type: Score,
        args: {
          userid: {
            type: new GraphQLNonNull(GraphQLID)
          },
          wordid: {
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve(_, args){
          return Db.models.score.findOne({ where: args })
            .then((obj) => {
                if(obj) { // update
                    return obj.update({ score: obj.score - 1 });
                }
                else { // insert
                    return Db.models.score.create({ userid: args.userid, wordid: args.wordid, score: -1 });
                }
            });
        }
      },

      addCard: {
        type: Card,
        args: {
          userid: {
            type: new GraphQLNonNull(GraphQLID)
          },
          french: {
            type: new GraphQLNonNull(GraphQLString)
          },
          english: {
            type: new GraphQLNonNull(GraphQLString)
          },
          wordType: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args){
          return Db.models.user.findOne({ where: {id: args.userid} })
            .then((obj) => {
                if(obj.admin) { // is admin
                    return Db.models.card.findOne({ where: {french: args.french} })
                          .then((res) => {
                            if(res != null){
                              throw new Error("Card already exists.");
                            }
                            else {
                              return Db.models.card.create({
                                french: args.french,
                                english: args.english,
                                wordType: args.wordType
                              });
                            }
                          })
                }
                else { // not admin
                    throw new Error("User is not admin.");
                }
            });
        }
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;

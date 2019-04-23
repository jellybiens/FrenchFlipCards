const { Sequelize } = require('sequelize');
const {  GraphQLObjectType,
          GraphQLID,
          GraphQLInt,
          GraphQLString,
          GraphQLBoolean,
          GraphQLList,
          GraphQLSchema,
          GraphQLNonNull }  = require('graphql');
const GraphQLLong  = require('graphql-type-long');
const Db = require('./db');
const md5 = require('md5');

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
        username: {
          type: GraphQLString,
          resolve(auth) {
            return auth.username
          }
        },
      admin: {
        type: GraphQLBoolean,
        resolve(auth) {
          return auth.admin
        }
      },
      token: {
        type: GraphQLString,
        resolve(auth) {
          return auth.token
        }
      },
      tokenExpiration: {
        type: GraphQLLong,
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
          },
          limit: {
            type: GraphQLInt
          }
        },
        resolve(_, args, req) {

          if(!req.isLoggedIn && !req.isAdmin){
            throw new Error('Not logged in!')
          }

          return Db.models.card.findAll({where: { wordType: args.wordType}, order: Sequelize.literal('random()'), limit: args.limit})
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
          },
          limit: {
            type: GraphQLInt
          }
        },

        resolve(_, args, req){

          if(!req.isLoggedIn && !req.isAdmin){
            throw new Error('Not logged in!')
          }

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
            ORDER BY random()
            LIMIT ${args.limit};
            `, {
              model: Db.models.card,
              mapToModel: true
            });
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
        resolve(_, args, req) {

          if(!req.isLoggedIn && !req.isAdmin){
            throw new Error('Not logged in!')
          }

          return Db.models.score.findAll({where: args})
        }
      },

      users: {
        type: new GraphQLList(User),
        args: {
          username: {
            type: GraphQLString
          }
        },
        resolve(_, args, req) {

          if(!req.isAdmin){
            throw new Error('Unauthorised!')
          }

          return Db.models.user.findAll({where: args});
        }
      },

      userLogin: {
        type: AuthData,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args) {
          return Db.models.user.findOne({ where: { username: args.username, password: md5(args.password) }})
          .then(user => {

            if(!user) throw new Error("Invalid login credentials.");

            const stringHash = user.admin ? process.env.ADMIN_TOKEN : process.env.NORMIE_TOKEN;

            const token = jwt.sign( {
                                    userid: user._id,
                                    username: user.username,
                                    admin: user.admin,
                                    },
                                    stringHash,
                                    { expiresIn: '1d' }
                                  );
                    let tokenExp = new Date();
                    tokenExp.setDate(tokenExp.getDate()+1);

                    return {
                              userid: user._id,
                              username: user.username,
                              admin: user.admin,
                              token: token,
                              tokenExpiration: Date.parse(tokenExp)
                            };

          });
        }
      },
      //create new auth token if logged in within valid timeframe of last token
      authTokenValidate: {
        type: AuthData,
        args: {
          userid: {
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve(_, args, req) {
          if(!req.isLoggedIn && !req.isAdmin){
            throw new Error('Not logged in!')
          }

          return Db.models.user.findOne({ where: { _id: args.userid }})
          .then(user => {

            if(!user) throw new Error("Not logged in.");

            const stringHash = user.admin ? process.env.ADMIN_TOKEN : process.env.NORMIE_TOKEN;

            const token = jwt.sign( {
                                    userid: user._id,
                                    username: user.username,
                                    admin: user.admin,
                                    },
                                    stringHash,
                                    { expiresIn: '1d' }
                                  );
            let tokenExp = new Date();
            tokenExp.setDate(tokenExp.getDate()+1);

                    return {
                              userid: user._id,
                              username: user.username,
                              admin: user.admin,
                              token: token,
                              tokenExpiration: Date.parse(tokenExp)
                            };

          });
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
          }
        },
        resolve(_, args, req){

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
        resolve(_, args, req){

          if(!req.isAdmin){
            throw new Error('Unauthorised!')
          }

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
        resolve(_, args, req){

          if(!req.isLoggedIn && !req.isAdmin){
            throw new Error('Not logged in!')
          }

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
        resolve(_, args, req){

          if(!req.isLoggedIn && !req.isAdmin){
            throw new Error('Not logged in!')
          }

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


    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = Schema;

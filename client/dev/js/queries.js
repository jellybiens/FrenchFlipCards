import gql from 'graphql-tag';

export const ALL_CARDS_QUERY = gql`
    query CardsQuery($wordType: [String] = ["noun", "adj", "verb"]) {
      cards: cardsAll(wordType: $wordType) {
          _id
          french
          english
          wordType
      }
    }
    `;

export const FOCUSS_CARDS_QUERY = gql`
    query FocussQuery($userid: ID!, $wordType: [String] = ["noun", "adj", "verb"]){
      cards: cardsFocussed(userid: $userid, wordType: $wordType) {
          _id
      	  french
          english
          wordType
      }
    }
    `;

export const UPDATE_SCORE_POS = gql`
    mutation updateScorePos($userid: ID!, $wordid: ID!){
      updateScorePos(userid: $userid, wordid: $wordid) {
        score
      }
    }
    `;

export const UPDATE_SCORE_NEG = gql`
    mutation updateScoreNeg($userid: ID!, $wordid: ID!){
      updateScoreNeg(userid: $userid, wordid: $wordid) {
        score
      }
    }
    `;


export const USER_LOGIN = gql`
    query userLogin($username: String!, $password: String!){
      userLogin(username: $username, password: $password) {
        userid
        username
        admin
        token
        tokenExpiration
      }
    }
    `;

export const AUTH_TOKEN_VALIDATE = gql`
    query authTokenValidate($userid: ID!){
      authTokenValidate(userid: $userid) {
        userid
        username
        admin
        token
        tokenExpiration
      }
    }
    `;

export const USER_SIGN_UP = gql`
    mutation createUser($username: String!, $password: String!){
      addUser(username: $username, password: $password){
        _id
     }
    }
    `;


export const CREATE_CARD = gql`
    mutation createCard($french: String!, $english: String!, $wordType: String!){
      addCard(french: $french, english: $english, wordType: $wordType) {
        _id
      }
    }
    `;

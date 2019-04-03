import gql from 'graphql-tag';

export const ALL_CARDS_QUERY = gql`
    query CardsQuery($wordType: [String] = ["noun", "adj", "verb"]) {
      cardsAll(wordType: $wordType) {
          id
          french
          english
      }
    }
    `;

export const FOCUSS_CARDS_QUERY = gql`
    query FocussQuery($userid: Integer!, $wordType: [String] = ["noun", "adj", "verb"]){
      cardsFocussed(userid: $userid, wordType: $wordType) {
          id
      	  french
          english
      }
    }
    `;

export const UPDATE_SCORE_POS = gql`
    mutation updateScorePos($userid: Integer!, $wordid: Integer!){
      updateScorePos(userid: $userid, wordid: $wordid) {
        score
      }
    }
    `;

export const UPDATE_SCORE_NEG = gql`
    mutation updateScoreNeg($userid: Integer!, $wordid: Integer!){
      updateScoreNeg(userid: $userid, wordid: $wordid) {
        score
      }
    }
    `;


export const USER_VALIDATION = gql`
    query user_validation($username: String!, $password: String!){
      user(username: $username, password: $password) {
        id
        username
        admin
      }
    }
    `;

export const CREATE_USER = gql`
    mutation createUser($username: String!, $password: String!){
      addUser(username: $username, password: $password, admin:false){
        id
     }
    }
    `;


export const CREATE_CARD = gql`
    mutation createCard($userid: Integer!, $french: String!, $english: String!, $wordType: String!){
      addCard(userid: $userid, french: $french, english: $english, wordType: $wordType) {
        id
      }
    }
    `;

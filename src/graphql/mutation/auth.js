/* @flow */

import gql from 'graphql-tag';

export const mSignup = gql`
  mutation SignUp($first_name: String!, $last_name: String!, $username: String!, $email: String!, $password: String!, $phone_number: String) {
    signup(input: {
      first_name: $first_name,
      last_name: $last_name,
      username: $username,
      email: $email,
      password: $password,
      phone_number: $phone_number
    }) {
      id
    }
  }
`;

export const mSignin = gql`
  mutation Signin($login: String!, $password: String!) {
    signin(input: {login: $login, password: $password}) {
      token
      refresh_token
    }
  }
`;

export const mUpdateToken = gql`
  mutation UpdateToken($refresh_token: String!) {
    token(refresh_token: $refresh_token) {
      token
      refresh_token
    }
  }
`;

export const mForgotPassword = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
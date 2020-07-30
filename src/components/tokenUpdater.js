/* @flow */

import jwtDecode from 'jwt-decode';
import React from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';


import {
  mUpdateToken,
} from '../graphql/mutation';
import {
  authUpdateToken,
  authTokenExpired,
} from '../redux/actions';


type State = {
  isLoggedin: boolean,
  token: string,
  refresh_token: string,
};


let auth = {}

const scheduleUpdateToken = (props: any) => {
  const { token, isLoggedin } = auth;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const tokenLifeTime: number = decoded.exp * 1000 - Date.now();

      // delay till 10 seconds before from expire time
      setTimeout(() => {
        if (isLoggedin) {
          updateToken(props)
        }
      }, tokenLifeTime - 10 * 1000);
    } catch (err) {
      console.log('error on schedule UpdateToken:', err)
    }
  }
}

const updateToken = async (props: any) => {
  const { refresh_token } = auth;
  const { client } = props;

  if (!client) return;

  try {
    const res: any = await client.mutate({
      mutation: mUpdateToken,
      variables: { refresh_token },
      fetchPolicy: 'no-cache'
    });
    props.authUpdateToken(res.data.token)
    scheduleUpdateToken(props)
  } catch (err) {
    console.log('error on updateToken:', err)
    props.authTokenExpired()
  }
};

class TokenUpdater extends React.Component<any, State> {

  state: State = {
    isLoggedin: false,
    token: '',
    refresh_token: '',
  }

  static getDerivedStateFromProps(props: any, state: State) {
    auth = {
      isLoggedin: props.isLoggedin,
      token: props.token,
      refresh_token: props.refresh_token,
    }
    if (!state.isLoggedin && props.isLoggedin) {
      scheduleUpdateToken(props)
    }
    return {
      ...auth,
    };
  }

  render() {
    return (
      <div>{/** Nothing to show visually here. */}</div>
    )
  };
};

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    token: state.auth.token,
    refresh_token: state.auth.refresh_token,
  }
}

export default connect(mapStateToProps, { authUpdateToken, authTokenExpired })(withApollo(TokenUpdater));
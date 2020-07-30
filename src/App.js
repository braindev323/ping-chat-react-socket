/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
// import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import config from './config';
import Header from './components/header';
import TokenUpdater from './components/tokenUpdater';
import Sidebar from './components/sidebar';
import { NotificationManager } from './components/notification';
import PostModal from './components/postmodal';
import Home from './pages/home';
import Channels from './pages/channels';
import Channel from './pages/channel';
import Explore from './pages/explore';
import Notifications from './pages/notifications';
import Profile from './pages/profile';
import EditProfile from './pages/profile-edit';
import ContentEdit from './pages/content-edit';
import PostDetail from './pages/post';
import Wallet from './pages/wallet';
import Bookmark from './pages/bookmark';
import Settings from './pages/settings';
import AuthModal from './pages/auth';
import Comment from './pages/comment';
import PingsPage from './pages/pings'
import {
  qGetCategories,
  qGetCountries,
  qGetLanguages,
  qGetUserSetting,
  qGetBlockedUsers,
} from './graphql/query';
import {
  setCategories,
  setCountries,
  setLanguages,
  setUserSetting,
  setBlockedUsers,
  setMutedUsers,
  authLogout
} from './redux/actions';

import './App.scss';


const uploadLink = createUploadLink({
  uri: `${config.server_root_url}/graphql`,
});

const httpLink = createHttpLink({
  uri: `${config.server_root_url}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = window[config.key_token];
  if (!token) {
    token = window[config.key_token] = localStorage.getItem(config.key_token);
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink, httpLink),
  cache: new InMemoryCache()
});

type State = {
  theme: string,
  isBlur: boolean,
};

class App extends React.Component<any, State> {
  state: State = {
    theme: 'dark',
    isBlur: false,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      theme: props.theme,
      isBlur: props.isAuthModalOpen || props.isSidebarOpen || props.isPostModalOpen,
    }
  }

  componentDidMount() {
    client.query({ query: qGetCategories }).then(({ data: { getCategories } }) => {
      this.props.setCategories(getCategories);
    }).catch(error => {
      console.log('Error on get categories:', error)
    });
    client.query({ query: qGetCountries }).then(({ data: { getCountries } }) => {
      this.props.setCountries(getCountries);
    }).catch(error => {
      console.log('Error on get countries:', error)
    });
    client.query({ query: qGetLanguages }).then(({ data: { getLanguages } }) => {
      this.props.setLanguages(getLanguages);
    }).catch(error => {
      console.log('Error on get languages:', error)
    });

    if (this.props.isLoggedin) {
      client.query({ query: qGetUserSetting }).then(({ data: { getUserSetting } }) => {
        this.props.setUserSetting(getUserSetting);
      }).catch(error => {
        console.log('Error on get user setting:', error)
      });
      client.query({ query: qGetBlockedUsers }).then(({ data: { getBlockedUsers } }) => {
        this.props.setBlockedUsers(getBlockedUsers.map(user => user.block));
      }).catch(error => {
        console.log('Error on get blocked users:', error)
        if (JSON.stringify(error).includes('expired')) this.props.authLogout();
      });
    }
  }

  render () {
    const { theme, isBlur } = this.state;
    if (isBlur) {
      if (document.body) {
        const body = document.body
        body.classList.add('modal-open');
        if (body.scrollHeight > window.innerWidth) {
          body.classList.add('clear-overflow');
        }
      }
    } else {
      if (document.body) {
        const body = document.body
        body.classList.remove('modal-open');
        body.classList.remove('clear-overflow');
      }
    }

    return (
      <ApolloProvider client={client}>
        <Router>
          <div className={theme}>
            <TokenUpdater />
            <Sidebar />
            <AuthModal />
            <div id='main' className={`${isBlur? 'blur': ''} ${this.props.isAuthModalOpen? 'header-blur': ''}`}>
              <Header />
              <div className='content'>
                <Switch>
                  <Route exact path='/' component={Home}/>
                  <Route exact path='/channels' component={Channels}/>
                  <Route exact path='/pings' component={PingsPage}/>
                  <Route exact path='/pings/:username' component={PingsPage}/>
                  <Route exact path='/channels/:username' component={Channel}/>
                  <Route exact path='/explore' component={Explore}/>
                  <Route exact path='/explore/:category' component={Explore}/>
                  <Route exact path='/notifications' component={Notifications}/>
                  <Route exact path='/profile' component={Profile}/>
                  <Route exact path='/profile/:username' component={Profile}/>
                  <Route exact path='/profile/:username/edit' component={EditProfile}/>
                  <Route exact path='/wallet' component={Wallet}/>
                  <Route exact path='/settings' component={Settings}/>
                  <Route exact path='/bookmark' component={Bookmark}/>
                  <Route exact path='/post/:username/:post_id' component={PostDetail}/>
                  <Route exact path='/post/:postId/edit' component={ContentEdit}/>
                  <Route exact path='/comment/:postId' component={Comment}/>
                </Switch>
              </div>
            </div>
            <PostModal />
            <NotificationManager />
            
            {/* for svg gradient */}
            <svg style={{width:0,height:0,position:'absolute'}} aria-hidden='true' focusable='false'>
              <linearGradient id='svg-gradient-primary' x1='0' y1='1' x2='1' y2='0'>
                <stop offset='0%' stopColor='var(--gradient-color-start)' />
                <stop offset='100%' stopColor='var(--gradient-color-end)' />
              </linearGradient>
              <linearGradient id='svg-gradient-secondary' x2='1' y2='0'>
                <stop offset='0%' stopColor='var(--gradient-color-start)' />
                <stop offset='100%' stopColor='var(--gradient-color-end)' />
              </linearGradient>
            </svg>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isLoggedin: state.auth.loggedin,
    isAuthModalOpen: state.auth.isModalOpen,
    isSidebarOpen: state.sidebar.isOpen,
    isPostModalOpen: state.postmodal.isOpen,
    isCalling: state.call.isCalling,
    theme: state.theme.type,
  }
}

export default connect(mapStateToProps, { setCategories, setCountries, setLanguages, setUserSetting, setBlockedUsers, setMutedUsers,authLogout })(App);

/* @flow */

import React from 'react';
import { Query } from 'react-apollo';
import _ from 'lodash';

import Spinner from '../../components/spinner';
import Post from '../../components/post';
import ProfileItem from './profile';
import {
  qSearchUsers,
  qSearchVideos,
  qSearchPhotos,
  qSearchArticles,
} from '../../graphql/query';


type Props = {
  searchkey: string,
  onChangeMenu?: (menu: string) => any
}

type State = {
  searchkey: string,
};

export default class Latest extends React.Component<Props, State> {
  state: State = {
    searchkey: '',
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.searchkey !== props.searchkey) {
      return {
        searchkey: props.searchkey,
      }
    } else {
      return null;
    }
  }

  onChangeMenu(menu: string) {
    const { onChangeMenu } = this.props;
    if (onChangeMenu) {
      onChangeMenu(menu);
    }
  }

  render() {
    const {
      searchkey,
    } = this.state;

    return (
      <div className='content'>
        <Query query={qSearchUsers} variables={{ searchkey }}>
          {({ loading, error, data }) => {
            if (loading) return (<Spinner />)
            if (error) return <div></div>

            if (data.searchUsers) {
              const profiles = _.slice(data.searchUsers, 0, 5);
              if (profiles.length > 0) {
                return (
                  <div className='profile-list'>
                    <div className='header'>
                      <div className='title'>{'Peoples and Organisations'}</div>
                      {data.searchUsers.length >= 5 &&
                        <div className='view-button' onClick={() => this.onChangeMenu('user')}>{'View more...'}</div>
                      }
                    </div>
                    <div className='profiles'>
                      {profiles.map((profile, i) => (
                        <ProfileItem key={i} profile={profile} />
                      ))}
                    </div>
                  </div>
                )
              }
            }
            return <div></div>;
          }}
        </Query>
        <Query query={qSearchVideos} variables={{ searchkey }}>
          {({ loading, error, data }) => {
            if (loading) return (<Spinner />)
            if (error) return <div></div>

            if (data.searchVideos) {
              const posts = _.slice(data.searchVideos, 0, 2);
              if (posts.length > 0) {
                return (
                  <div className='post-list'>
                    <div className='header'>
                      <div className='title'>{'Videos'}</div>
                      {data.searchVideos.length >= 2 &&
                        <div className='view-button' onClick={() => this.onChangeMenu('video')}>{'View more...'}</div>
                      }
                    </div>
                    <div className='posts'>
                      {posts.map((post, i) => (
                        <Post key={i} data={post} />
                      ))}
                    </div>
                  </div>
                )
              }
            }
            return <div></div>;
          }}
        </Query>
        <Query query={qSearchPhotos} variables={{ searchkey }}>
          {({ loading, error, data }) => {
            if (loading) return (<Spinner />)
            if (error) return <div></div>

            if (data.searchPhotos) {
              const posts = _.slice(data.searchPhotos, 0, 2);
              if (posts.length > 0) {
                return (
                  <div className='post-list'>
                    <div className='header'>
                      <div className='title'>{'Photos'}</div>
                      {data.searchPhotos.length >= 2 &&
                        <div className='view-button' onClick={() => this.onChangeMenu('image')}>{'View more...'}</div>
                      }
                    </div>
                    <div className='posts'>
                      {posts.map((post, i) => (
                        <Post key={i} data={post} />
                      ))}
                    </div>
                  </div>
                )
              }
            }
            return <div></div>;
          }}
        </Query>
        <Query query={qSearchArticles} variables={{ searchkey }}>
          {({ loading, error, data }) => {
            if (loading) return (<Spinner />)
            if (error) return <div></div>

            if (data.searchArticles) {
              const posts = _.slice(data.searchArticles, 0, 3);
              if (posts.length > 0) {
                return (
                  <div className='post-list'>
                    <div className='header'>
                      <div className='title'>{'Memos and Articles'}</div>
                      {data.searchArticles.length >= 3 &&
                        <div className='view-button' onClick={() => this.onChangeMenu('news')}>{'View more...'}</div>
                      }
                    </div>
                    <div className='posts'>
                      {posts.map((post, i) => (
                        <Post key={i} data={post} />
                      ))}
                    </div>
                  </div>
                )
              }
            }
            return <div></div>;
          }}
        </Query>
      </div>
    )
  }
}
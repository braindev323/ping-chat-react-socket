/* @flow */

import React from 'react';
import { Query } from 'react-apollo';
import _ from 'lodash';

import Spinner from '../../components/spinner';
import InfiniteScroll from '../../components/infiniteScroll';
import ProfileItem from './profile';
import {
  qSearchUsers,
} from '../../graphql/query';


type Props = {
  searchkey: string,
}

type State = {
  searchkey: string,
  profiles: Array<any>,
  hasMoreProfiles: boolean,
  loadProfiles: boolean,
};

export default class Peoples extends React.Component<Props, State> {
  state: State = {
    searchkey: '',
    profiles: [],
    hasMoreProfiles: true,
    loadProfiles: true,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.searchkey !== props.searchkey) {
      return {
        searchkey: props.searchkey,
        profiles: [],
        hasMoreProfiles: true,
        loadProfiles: true,
      }
    } else {
      return null;
    }
  }

  loadMoreProfiles = () => {
    if (!this.state.loadProfiles) {
      this.setState({
        loadProfiles: true,
      })
    }
  }

  renderProfilesLoader() {
    const {
      searchkey,
      profiles,
    } = this.state

    return (
      <Query query={qSearchUsers} variables={{ searchkey, offset: profiles.length }}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.searchUsers) {
            this.setState({
              profiles: _.concat(profiles, data.searchUsers),
              hasMoreProfiles: data.searchUsers.length === 20,
              loadProfiles: false,
            })
          } else {
            this.setState({
              loadProfiles: false,
            })
          }
          return null;
        }}
      </Query>
    )
  }

  render() {
    const {
      profiles,
      hasMoreProfiles,
      loadProfiles,
    } = this.state;

    return (
      <div className='content profile-list'>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMoreProfiles}
          hasMore={hasMoreProfiles} >

          <div className='profiles'>
            {profiles.map((profile, i) => (
              <ProfileItem key={i} profile={profile} />
            ))}
          </div>
        </InfiniteScroll>
        {loadProfiles && this.renderProfilesLoader()}

        {!loadProfiles && profiles.length === 0 &&
          <div className='not-found'>
            <h5>{'No users'}</h5>
          </div>
        }
      </div>
    )
  }
}
/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import _ from 'lodash';

import Spinner from '../../components/spinner';
import Avatar from '../../components/avatar';
import Icon from '../../components/icon';
import FloatingWrapper from '../../components/floatingwrapper';
import Searchbar from '../../components/searchbar';
import InfiniteScroll from '../../components/infiniteScroll';
import ReaderItem from './readerItem';
import {
  qGetUserReaders,
  qGetUserRecentReaders,
} from '../../graphql/query';
import {
  toggleAuthModal,
} from '../../redux/actions';


const SortMethod = {
  Latest: 0,
  Category: 1,
}

type Country = {
  id: number,
  name: string,
  country_code: string,
  dial_code: number,
}

type City = {
  id: number,
  name: string,
}

type User = {
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  level: number,
  site_url?: string,
  description: string,
  country: Country,
  city: City,
  create_date: Date,
  reading: number,
}

type State = {
  isLoggedin: boolean,
  me: ?User,
  readers: Array<User>,
  hasMoreReaders: boolean,
  loadReaders: boolean,
  sortMethod: number,
};

class Readers extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    readers: [],
    hasMoreReaders: true,
    loadReaders: true,
    sortMethod: SortMethod.Latest,
  }

  loadMoreReaders = () => {
    if (!this.state.loadReaders) {
      this.setState({
        loadReaders: true,
      })
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  renderRecentReaders() {
    const user: User = this.props.user;
    return (
      <Query query={qGetUserRecentReaders} variables={{ user_id: user.id }}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getUserRecentReaders) {
            return data.getUserRecentReaders.map((reader: User) => (
              <div key={reader.id} className='item profile'>
                <Avatar url={reader.photo} level={reader.level} size={45} />
                <div className='info'>
                  <div className='name'>{`${reader.first_name} ${reader.last_name}`}</div>
                  <div className='username lightBlue'>{`@${reader.username}`}</div>
                </div>
              </div>
            ))
          }
        }}
      </Query>
    )
  }

  renderReadersLoader() {
    const user: User = this.props.user;
    const { readers } = this.state

    return (
      <Query query={qGetUserReaders} variables={{ user_id: user.id, offset: readers.length }}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getUserReaders) {
            this.setState({
              readers: _.concat(readers, data.getUserReaders),
              hasMoreReaders: data.getUserReaders.length === 20,
              loadReaders: false,
            })
          } else {
            this.setState({
              loadReaders: false,
            })
          }
          return null;
        }}
      </Query>
    )
  }

  render() {
    const {
      readers,
      hasMoreReaders,
      loadReaders,
      sortMethod,
    } = this.state;

    return (
      <div className='page'>
        <FloatingWrapper className='left-content detail'>
          <div className='sub-header'>
            <h5 className='sub-header-title'>Recent Readers</h5>
          </div>
          {this.renderRecentReaders()}
        </FloatingWrapper>
        <div className='main-content post-list'>
          <div className='list-units'>
            <div className='unit'>
              <Icon className='icon' name={sortMethod === SortMethod.Latest? 'calendar_event': 'view_grid'} size={24} />
              <h5 className='title'>{sortMethod === SortMethod.Latest? 'Sort by Most Recent': 'Sort by Category'}</h5>
            </div>
            <Searchbar className='unit' />
          </div>
          
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMoreReaders}
            hasMore={hasMoreReaders} >

            <div className='readers'>
              {readers.map((user: User, i: number) => (
                <ReaderItem key={i} user={user} />
              ))}
            </div>
          </InfiniteScroll>
          {loadReaders && this.renderReadersLoader()}

          {!loadReaders && readers.length === 0 &&
            <div className='not-found'>
              <h5>{'No readers from this user'}</h5>
            </div>
          }
        </div>
        <div className='right-content'>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, { toggleAuthModal })(Readers);
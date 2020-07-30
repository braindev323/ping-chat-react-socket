/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import _ from 'lodash';

import defaultCover from '../../resources/image/cover.png';
import Spinner from '../../components/spinner';
import Avatar from '../../components/avatar';
import Icon from '../../components/icon';
import FloatingWrapper from '../../components/floatingwrapper';
import Searchbar from '../../components/searchbar';
import InfiniteScroll from '../../components/infiniteScroll';
import {
  formatDate,
} from '../../utils';
import {
  qGetUserReading,
  qGetUserRecentReading,
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
  reading: Array<User>,
  hasMoreReading: boolean,
  loadReading: boolean,
  sortMethod: number,
};

class Reading extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    reading: [],
    hasMoreReading: true,
    loadReading: true,
    sortMethod: SortMethod.Latest,
  }

  loadMoreReading = () => {
    if (!this.state.loadReading) {
      this.setState({
        loadReading: true,
      })
    }
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  renderRecentReading() {
    const user: User = this.props.user;
    return (
      <Query query={qGetUserRecentReading} variables={{ user_id: user.id }}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getUserRecentReading) {
            return data.getUserRecentReading.map((reading: User) => (
              <div key={reading.id} className='item profile'>
                <Avatar url={reading.photo} level={reading.level} size={45} />
                <div className='info'>
                  <div className='name'>{`${reading.first_name} ${reading.last_name}`}</div>
                  <div className='username lightBlue'>{`@${reading.username}`}</div>
                </div>
              </div>
            ))
          }
        }}
      </Query>
    )
  }

  renderReadingLoader() {
    const user: User = this.props.user;
    const { reading } = this.state

    return (
      <Query query={qGetUserReading} variables={{ user_id: user.id, offset: reading.length }}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getUserReading) {
            this.setState({
              reading: _.concat(reading, data.getUserReading),
              hasMoreReading: data.getUserReading.length === 20,
              loadReading: false,
            })
          } else {
            this.setState({
              loadReading: false,
            })
          }
          return null;
        }}
      </Query>
    )
  }

  render() {
    const {
      reading,
      hasMoreReading,
      loadReading,
      sortMethod,
    } = this.state;

    return (
      <div className='page'>
        <FloatingWrapper className='left-content detail'>
          <div className='sub-header'>
            <h5 className='sub-header-title'>Recent Reading</h5>
          </div>
          {this.renderRecentReading()}
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
            loadMore={this.loadMoreReading}
            hasMore={hasMoreReading} >

            <div className='reading'>
              {reading.map((user, i) => {
                const {
                  username,
                  first_name,
                  last_name,
                  photo,
                  cover_image,
                  level,
                  description,
                  create_date,
                } = user;
                return (
                  <div key={i} className='item' style={{ backgroundImage: `url(${cover_image || defaultCover})` }} >
                    <div className='main'>
                      <Avatar url={photo} level={level} size={45} />
                      <div className='info'>
                        <div className='name'>{`${first_name} ${last_name}`}</div>
                        <div className='username lightBlue'>{`@${username}`}</div>
                      </div>
                    </div>
                    <div className='tools'>
                      <Icon className='icon' name='share' size={24} />
                      <Icon className='icon' name='dollar_fill' size={24} />
                    </div>
                    <div className='content'>
                      <div className='title'>
                        <h4 className='about'>{`About ${first_name} ${last_name}`}</h4>
                        <span className='join'>{`Member since ${formatDate(create_date, 'MMMM YYYY')}`}</span>
                      </div>
                      <p className='description'>{description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </InfiniteScroll>
          {loadReading && this.renderReadingLoader()}

          {!loadReading && reading.length === 0 &&
            <div className='not-found'>
              <h5>{'No reading from this user'}</h5>
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

export default connect(mapStateToProps, { toggleAuthModal })(Reading);
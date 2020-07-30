/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import _ from 'lodash';

import defaultCover from '../../resources/image/cover.png';
import InfiniteScroll from '../../components/infiniteScroll';
import Spinner from '../../components/spinner';
// import Avatar from '../../components/avatar';
import Icon from '../../components/icon';
// import { formatNumber } from '../../utils';
import {
  qGetUserByUsername,
  qGetUserActivity,
  qGetBookMarkUser
} from '../../graphql/query';
import {
  toggleAuthModal,
} from '../../redux/actions';
import './index.scss';
import FloatingWrapper from '../../components/floatingwrapper';
import Searchbar from '../../components/searchbar';
import NotificationItem from '../../components/notificationsitem';


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
  country: Country,
  city: City,
}

const Menu = {
  Memos: 0,
  Reading: 1,
  Readers: 2,
}

type State = {
  isLoggedin: boolean,
  me: ?User,
  currentMenu: number,
  blockedUsers: Array<any>,
  mutedUsers: Array<any>,
  notificationsLists: Array<any>,
  hasMoreNotifications: boolean,
  loadNotifications: boolean,
  sortMethod: any,
};

const SortMethod = {
  Latest: 0,
  Category: 1,
}


class Notifications extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    currentMenu: Menu.Memos,
    blockedUsers: [],
    mutedUsers: [],
    notificationsLists: [],
    hasMoreNotifications: true,
    loadNotifications: true,
    sortMethod: SortMethod.Latest,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
      blockedUsers: props.blockedUsers,
      mutedUsers: props.mutedUsers,
    }
  }

  componentDidMount() {
    const { isLoggedin, me } = this.state;
    if (!isLoggedin && !me) {
      this.props.toggleAuthModal(true);
    }
  }

  loadMorePosts = () => {
    if (!this.state.loadNotifications) {
      this.setState({
        loadNotifications: true,
      })
    }
  }

  renderBookMarkLoader() {
    const { notificationsLists } = this.state

    return (
      <Query query={qGetBookMarkUser} variables={{ date: notificationsLists.length > 0 ? notificationsLists[notificationsLists.length - 1].original_post_date : null, isLater: false }}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getPosts) {
            this.setState({
              notificationsLists: _.concat(notificationsLists, data.getPosts),
              hasMoreNotifications: data.getPosts.length === 20,
              loadNotifications: false,
            })
          } else {
            this.setState({
              loadNotifications: false,
            })
          }
          return null;
        }}
      </Query>
    )
  }

  render() {
    const {
      isLoggedin,
      blockedUsers,
      mutedUsers,
      notificationsLists,
      hasMoreNotifications,
      loadNotifications,
      sortMethod,
    } = this.state;

    const user: ?User = this.props.user.getUserByUsername;
    const activity = this.props.activity.getUserActivity;
    if (!user || !activity) {
      return (
        <div className='not-found'>
          <h3>{'This profile is not available'}</h3>
        </div>
      )
    }

    const {
      cover_image,
    } = user;

    return (
      <div className='profile'>
        <div className='main-header' style={{ backgroundImage: `url(${cover_image || defaultCover})` }}>
          <div className='avatar-group'>
            <h3 className="name">Onomen’s Articles <Icon name={'arrow_down'} size={22} /></h3>
          </div>
          <div className="count-views">
            <div className='views'>Views</div>
            <div className='count'>4,987,374</div>
            <div className='months'>3 Months <Icon name={'arrow_down'} size={22} /></div>
          </div>
        </div>
        <div className='home page'>
          <FloatingWrapper className='left-content' />
          <div className='main-content post-list'>
            <div className='list-units'>
              <div className='unit'>
                <Icon className='icon' name={sortMethod === SortMethod.Latest ? 'calendar_event' : 'view_grid'} size={24} />
                <h5 className='title'>{sortMethod === SortMethod.Latest ? 'Sort by Most Recent' : 'Sort by Category'}</h5>
              </div>
              <Searchbar className='unit' placeholder="Search Bookmark..." />
            </div>

            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMorePosts}
              hasMore={hasMoreNotifications} >

              <div className='posts'>
                {notificationsLists.map((post, i) => {
                  if (isLoggedin && post.author) {
                    if (_.find(blockedUsers, { id: post.author.id }) || _.find(mutedUsers, { id: post.author.id })) {
                      return null;
                    }
                  }

                  return (
                    <NotificationItem key={i} data={post} showLeftline={i % 2 === 0} />
                  )
                })}
              </div>
            </InfiniteScroll>
            {loadNotifications && this.renderBookMarkLoader()}
          </div>
          <FloatingWrapper className='right-content' />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
    blockedUsers: state.auth.blockedUsers,
    mutedUsers: state.auth.mutedUsers,
  }
}

export default compose(
  connect(mapStateToProps, { toggleAuthModal }),
  graphql(qGetUserByUsername, { name: 'user', options: (props) => ({ variables: { username: _.get(props, "me.username") || "" } }) }),
  graphql(qGetUserActivity, { name: 'activity', options: (props) => ({ variables: { username: _.get(props, "me.username") || "" } }) }),
)(withRouter(Notifications));
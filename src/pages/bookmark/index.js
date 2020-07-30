/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import _ from 'lodash';

import Icon from '../../components/icon';
import InfiniteScroll from '../../components/infiniteScroll';
import Spinner from '../../components/spinner';
import FloatingWrapper from '../../components/floatingwrapper';
import Searchbar from '../../components/searchbar';
import Post from '../../components/post';
import {
  qGetBookMarkUser,
} from '../../graphql/query';
import './index.scss';


const SortMethod = {
  Latest: 0,
  Category: 1
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
  country: Country,
  city: City,
}

type State = {
  isLoggedin: boolean,
  me: ?User,
  blockedUsers: Array<any>,
  mutedUsers: Array<any>,
  bookMarks: Array<any>,
  hasMoreBookMarks: boolean,
  loadBookMarks: boolean,
  sortMethod: number,
};

class Bookmark extends React.Component<any, State> {
  state = {
    isLoggedin: false,
    blockedUsers: [],
    mutedUsers: [],
    bookMarks: [],
    hasMoreBookMarks: true,
    loadBookMarks: true,
    sortMethod: SortMethod.Latest,
    me: null,
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
    if (!this.state.loadBookMarks) {
      this.setState({
        loadBookMarks: true,
      })
    }
  }

  renderBookMarkLoader() {
    const { bookMarks } = this.state

    return (
      <Query query={qGetBookMarkUser}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getBookmarks) {
            this.setState({
              bookMarks: _.concat(bookMarks, data.getBookmarks),
              hasMoreBookMarks: data.getBookmarks.length === 20,
              loadBookMarks: false,
            })
          } else {
            this.setState({
              loadBookMarks: false,
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
      bookMarks,
      hasMoreBookMarks,
      loadBookMarks,
      sortMethod,
    } = this.state;

    return (
      <div className='home page'>
        <FloatingWrapper className='left-content'></FloatingWrapper>
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
            hasMore={hasMoreBookMarks} >

            <div className='posts'>
              {bookMarks.map((bookMark, i) => {
                const post = bookMark.post;

                if (isLoggedin && post.author) {
                  if (_.find(blockedUsers, { id: post.author.id }) || _.find(mutedUsers, { id: post.author.id })) {
                    return null;
                  }
                }

                return <Post key={i} data={post} />
              })}
            </div>
          </InfiniteScroll>
          {loadBookMarks && this.renderBookMarkLoader()}
        </div>
        <FloatingWrapper className='right-content'></FloatingWrapper>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    blockedUsers: state.auth.blockedUsers,
    mutedUsers: state.auth.mutedUsers,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, {})(Bookmark);
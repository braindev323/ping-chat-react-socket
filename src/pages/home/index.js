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
import Composer from '../../components/composer';
import {
  formatNumber,
} from '../../utils';
import {
  qGetTrendingGammatags,
  qGetPosts,
  qGetHotTopics,
} from '../../graphql/query';
import './index.scss';


const SortMethod = {
  Latest: 0,
  Category: 1,
}

type State = {
  isLoggedin: boolean,
  blockedUsers: Array<any>,
  mutedUsers: Array<any>,
  posts: Array<any>,
  hasMorePosts: boolean,
  loadPosts: boolean,
  sortMethod: number,
};

class Home extends React.Component<any, State> {
  state = {
    isLoggedin: false,
    blockedUsers: [],
    mutedUsers: [],
    posts: [],
    hasMorePosts: true,
    loadPosts: true,
    sortMethod: SortMethod.Latest,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      blockedUsers: props.blockedUsers,
      mutedUsers: props.mutedUsers,
    }
  }

  resetPosts() {
    this.setState({
      posts: [],
      hasMorePosts: true,
      loadPosts: true,
    })
  }

  loadMorePosts = () => {
    if (!this.state.loadPosts) {
      this.setState({
        loadPosts: true,
      })
    }
  }

  renderHotTopics() {
    return (
      <Query query={qGetHotTopics}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getHotTopics) {
            return data.getHotTopics.map((post) => (
              <div key={post.id} className='hot-topic' style={{backgroundImage: `url('${post.cover_image}')`}}>
                <span className='title'>{post.title}</span>
              </div>
            ))
          } else {
            return <div></div>
          }
        }}
      </Query>
    )
  }

  renderTrending() {
    return (
      <Query query={qGetTrendingGammatags}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getTrendingGammatags) {
            return data.getTrendingGammatags.map((gammatag) => (
              <div key={gammatag.id} className='item trending'>
                <div className='name blue' onClick={() => this.props.history.push('/explore?q='+gammatag.name)}>
                  <Icon className='symbol' name='gamma' size={18} />
                  {gammatag.name}
                </div>
                <div className='rate'>
                  {`${formatNumber(gammatag.rate)} Memos`}
                </div>
              </div>
            ))
          }
        }}
      </Query>
    )
  }

  renderPostsLoader() {
    const { posts } = this.state

    return (
      <Query query={qGetPosts} variables={{date: posts.length > 0? posts[posts.length-1].original_post_date: null, isLater: false}} fetchPolicy='no-cache'>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getPosts) {
            this.setState({
              posts: _.concat(posts, data.getPosts),
              hasMorePosts: data.getPosts.length === 20,
              loadPosts: false,
            })
          } else {
            this.setState({
              loadPosts: false,
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
      posts,
      hasMorePosts,
      loadPosts,
      sortMethod,
    } = this.state;

    return (
      <div className='home page'>
        <FloatingWrapper className='left-content'>
          <div className='sub-header'>
            <Icon name='fire' size={24} className='icon icon-primary' />
            <h5 className='sub-header-title'>Hot Topics</h5>
          </div>
          {this.renderHotTopics()}
        </FloatingWrapper>
        <div className='main-content post-list'>
          <div className='list-units'>
            <div className='unit'>
              <Icon className='icon' name={sortMethod === SortMethod.Latest? 'calendar_event': 'view_grid'} size={24} />
              <h5 className='title'>{sortMethod === SortMethod.Latest? 'Sort by Most Recent': 'Sort by Category'}</h5>
            </div>
            <Searchbar className='unit' />
          </div>

          {isLoggedin && <Composer onIssue={post => this.setState({ posts: _.concat([post], posts) })} /> }
          
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMorePosts}
            hasMore={hasMorePosts} >

            <div className='posts'>
              {posts.map((post, i) => {
                if (isLoggedin && post.author) {
                  if (_.find(blockedUsers, {id: post.author.id}) || _.find(mutedUsers, {id: post.author.id})) {
                    return null;
                  }
                }
                
                return (
                  <Post key={i} data={post} />
                )
              })}
            </div>
          </InfiniteScroll>
          {loadPosts && this.renderPostsLoader()}
        </div>
        <FloatingWrapper className='right-content'>
          <div className='sub-header'>
            <Icon name='chart_line' size={24} className='icon icon-primary' />
            <h5 className='sub-header-title'>Trending</h5>
          </div>
          {this.renderTrending()}
        </FloatingWrapper>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    blockedUsers: state.auth.blockedUsers,
    mutedUsers: state.auth.mutedUsers,
  }
}

export default connect(mapStateToProps, { })(Home);
/* @flow */

import React from 'react';
import { Query } from 'react-apollo';
import _ from 'lodash';

import Spinner from '../../components/spinner';
import InfiniteScroll from '../../components/infiniteScroll';
import Post from '../../components/post';
import {
  qSearchArticles,
} from '../../graphql/query';


type Props = {
  searchkey: string,
}

type State = {
  searchkey: string,
  posts: Array<any>,
  hasMorePosts: boolean,
  loadPosts: boolean,
};

export default class Articles extends React.Component<Props, State> {
  state: State = {
    searchkey: '',
    posts: [],
    hasMorePosts: true,
    loadPosts: true,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.searchkey !== props.searchkey) {
      return {
        searchkey: props.searchkey,
        posts: [],
        hasMorePosts: true,
        loadPosts: true,
      }
    } else {
      return null;
    }
  }

  loadMorePosts = () => {
    if (!this.state.loadPosts) {
      this.setState({
        loadPosts: true,
      })
    }
  }

  renderPostsLoader() {
    const {
      searchkey,
      posts,
    } = this.state

    return (
      <Query query={qSearchArticles} variables={{ searchkey, offset: posts.length }}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.searchArticles) {
            this.setState({
              posts: _.concat(posts, data.searchArticles),
              hasMorePosts: data.searchArticles.length === 20,
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
      posts,
      hasMorePosts,
      loadPosts,
    } = this.state;

    return (
      <div className='content post-list'>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMorePosts}
          hasMore={hasMorePosts} >

          <div className='posts'>
            {posts.map((post, i) => (
              <Post key={i} data={post} />
            ))}
          </div>
        </InfiniteScroll>
        {loadPosts && this.renderPostsLoader()}

        {!loadPosts && posts.length === 0 &&
          <div className='not-found'>
            <h5>{'No memos'}</h5>
          </div>
        }
      </div>
    )
  }
}
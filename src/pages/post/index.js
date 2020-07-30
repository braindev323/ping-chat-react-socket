/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Icon from '../../components/icon';
// import InfiniteScroll from '../../components/infiniteScroll';
import Spinner from '../../components/spinner';
import FloatingWrapper from '../../components/floatingwrapper';
import Searchbar from '../../components/searchbar';
// import Post from '../../components/post';
import {
  qGetHotTopics,
} from '../../graphql/query';
import {
  toggleAuthModal,
} from '../../redux/actions';
import './index.scss';


type State = {
  isLoggedin: boolean,
  me: any,
  posts: Array<any>,
  hasMoreComments: boolean,
  loadComments: boolean,
};

class PostDetail extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    posts: [],
    hasMoreComments: true,
    loadComments: true,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
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

  loadMoreComments = () => {
    if (!this.state.loadComments) {
      this.setState({
        loadComments: true,
      })
    }
  }
  
  render() {
    const {
      // isLoggedin,
      posts,
      // hasMoreComments,
      loadComments,
    } = this.state;

    return (
      <div className='post-detail'>
        <div className='page'>
          <FloatingWrapper className='left-content detail'>
          </FloatingWrapper>
          <div className='main-content'>
            {/* <Post data={post} /> */}
            <div className='list-units'>
              <Searchbar className='unit' />
            </div>
            
            {/* <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMoreComments}
              hasMore={hasMoreComments} >

              <div className='posts'>
                {posts.map((post, i) => (
                  <Comment />
                ))}
              </div>
            </InfiniteScroll>
            {loadComments && this.renderCommentsLoader()} */}

            {!loadComments && posts.length === 0 &&
              <div className='not-found'>
                <h5>{'No comments for this memo'}</h5>
              </div>
            }
          </div>
          <FloatingWrapper className='right-content'>
            <div className='sub-header'>
              <Icon name='fire' size={24} className='icon icon-primary' />
              <h5 className='sub-header-title'>Hot Topics</h5>
            </div>
            {this.renderHotTopics()}
          </FloatingWrapper>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
  }
}

export default connect(mapStateToProps, { toggleAuthModal })(withRouter(PostDetail));
/* @flow */

import React from "react";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import _, { flowRight as compose } from "lodash";

import Icon from "../../components/icon";
import Spinner from "../../components/spinner";
import FloatingWrapper from "../../components/floatingwrapper";
import Searchbar from "../../components/searchbar";
import Post from "../../components/post";
import CommentPost from "../../components/comment";
import { listToComments } from "../../utils";
import {
  qGetPostComments,
  qGetPosts,
  qGetHotTopics
} from "../../graphql/query";
import { toggleAuthModal } from "../../redux/actions";
import "./index.scss";

type Country = {
  id: number,
  name: string,
  country_code: string,
  dial_code: number
};

type City = {
  id: number,
  name: string
};

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
  city: City
};

const SortMethod = {
  Latest: 0,
  Category: 1
};

type State = {
  isLoggedin: boolean,
  me: ?User,
  blockedUsers: Array<any>,
  mutedUsers: Array<any>,
  posts: Array<any>,
  hasMorePosts: boolean,
  loadPosts: boolean,
  sortMethod: number
};

class Home extends React.Component<any, State> {
  state = {
    isLoggedin: false,
    me: null,
    blockedUsers: [],
    mutedUsers: [],
    posts: [],
    hasMorePosts: true,
    loadPosts: true,
    sortMethod: SortMethod.Latest
  };

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
      blockedUsers: props.blockedUsers,
      mutedUsers: props.mutedUsers
    };
  }

  componentDidMount() {
    const { isLoggedin, me } = this.state;
    if (!isLoggedin && !me) {
      this.props.toggleAuthModal(true);
    }
  }

  loadMorePosts = () => {
    if (!this.state.loadPosts) {
      this.setState({
        loadPosts: true
      });
    }
  };

  renderPostComments() {
    const post_id = _.get(this.props.match.params, "postId");
    return (
      <Query query={qGetPostComments} variables={{ postId: post_id }}>
        {({ loading, error, data, ...other }) => {
          if (loading) return <Spinner />;
          if (error) return <div></div>;

          if (data.getPostComments) {
            const convertToTree = listToComments(data.getPostComments);
            return this.renderComment(convertToTree);
          }
        }}
      </Query>
    );
  }

  renderComment(datas) {
    return datas.map((v, k) => (
      <div key={k}>
        <CommentPost key={k} data={v} showReply={true} showComment={false} />
        <div style={{ paddingLeft: 30 }}>
          {v.children &&
            v.children.length > 0 &&
            this.renderComment(v.children)}
        </div>
      </div>
    ));
  }

  renderHotTopics() {
    return (
      <Query query={qGetHotTopics}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <div></div>;

          if (data.getHotTopics) {
            return data.getHotTopics.map(post => (
              <div
                key={post.id}
                className="hot-topic"
                style={{ backgroundImage: `url('${post.cover_image}')` }}
              >
                <span className="title">{post.title}</span>
              </div>
            ));
          }
        }}
      </Query>
    );
  }

  renderPostsLoader() {
    const { posts } = this.state;

    return (
      <Query
        query={qGetPosts}
        variables={{
          date:
            posts.length > 0
              ? posts[posts.length - 1].original_post_date
              : null,
          isLater: false
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <div></div>;

          if (data.getPosts) {
            this.setState({
              posts: _.concat(posts, data.getPosts),
              hasMorePosts: data.getPosts.length === 20,
              loadPosts: false
            });
          } else {
            this.setState({
              loadPosts: false
            });
          }
          return null;
        }}
      </Query>
    );
  }

  render() {
    const {
      posts,
      loadPosts,
      sortMethod,
      me
    } = this.state;

    console.log("=====", this.props.postComments);

    return (
      <div className="home page">
        <FloatingWrapper className="left-content"></FloatingWrapper>
        <div className="main-content post-list">
          <div className="list-units">
            {posts && posts.length > 0 && <Post data={posts[0]} />}
            {loadPosts && this.renderPostsLoader()}

            <div className="list-units mt-2 mb-2">
              <Icon
                className="icon"
                name={
                  sortMethod === SortMethod.Latest
                    ? "calendar_event"
                    : "view_grid"
                }
                size={24}
              />
              <h5 className="title">
                {sortMethod === SortMethod.Latest
                  ? "Sort by Most Recent"
                  : "Sort by Category"}
              </h5>
            </div>
            <Searchbar className="unit" />
            <div className="comment-count">15,354 Comments</div>
          </div>
          <div className="comments xxxx">
            <CommentPost
              data={{ user: me }}
              showReply={false}
              showComment={true}
            />
            {this.renderPostComments()}
          </div>
          {/* 
          {posts && posts.length > 0 && <Post data={posts[0]} />}

          {loadPosts && this.renderPostsLoader()} */}
        </div>
        <FloatingWrapper className="right-content">
          <div className="sub-header">
            <Icon name="fire" size={24} className="icon icon-primary" />
            <h5 className="sub-header-title">Hot Topics</h5>
          </div>
          {this.renderHotTopics()}
        </FloatingWrapper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
    blockedUsers: state.auth.blockedUsers,
    mutedUsers: state.auth.mutedUsers
  };
}

export default compose(connect(mapStateToProps, { toggleAuthModal }))(Home);

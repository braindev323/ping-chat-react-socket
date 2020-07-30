/* @flow */

import React from "react";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import Spinner from "../../components/spinner";
import Avatar from "../../components/avatar";
import Icon from "../../components/icon";
import FloatingWrapper from "../../components/floatingwrapper";
import Searchbar from "../../components/searchbar";
import InfiniteScroll from "../../components/infiniteScroll";
import Post from "../../components/post";
import Composer from "../../components/composer";
import { formatDate } from "../../utils";
import { qGetUserPosts, qGetHotTopics } from "../../graphql/query";
import { toggleAuthModal } from "../../redux/actions";

const SortMethod = {
  Latest: 0,
  Category: 1
};

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
  site_url?: string,
  description: string,
  country: Country,
  city: City,
  create_date: Date
};

type State = {
  isLoggedin: boolean,
  me: ?User,
  posts: Array<any>,
  hasMorePosts: boolean,
  loadPosts: boolean,
  sortMethod: number
};

class Memo extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    posts: [],
    hasMorePosts: true,
    loadPosts: true,
    sortMethod: SortMethod.Latest
  };

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me
    };
  }

  loadMorePosts = () => {
    if (!this.state.loadPosts) {
      this.setState({
        loadPosts: true
      });
    }
  };

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
    const user: User = this.props.user;
    const { posts } = this.state;

    return (
      <Query
        query={qGetUserPosts}
        variables={{
          user_id: user.id,
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

          if (data.getUserPosts) {
            this.setState({
              posts: _.concat(posts, data.getUserPosts),
              hasMorePosts: data.getUserPosts.length === 20,
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
    const user: User = this.props.user;
    const {
      isLoggedin,
      me,
      posts,
      hasMorePosts,
      loadPosts,
      sortMethod
    } = this.state;

    return (
      <div className="page">
        <FloatingWrapper className="left-content detail">
          <div className="main">
            <Avatar url={user.photo} level={user.level} size={45} />
            <div className="info">
              <div className="name">
                {`${user.first_name} ${user.last_name}`}
                <a
                  className="btn-edit"
                  href={`/profile/${user.username}/edit`}
                  style={{ cursor: "pointer" }}
                >
                  <Icon className="icon" name="edit" size={18} />
                </a>
              </div>
              <div className="username lightBlue">{`@${user.username}`}</div>
            </div>
          </div>

          <div className="description">{user.description}</div>
          {user.site_url && (
            <div className="line">
              <Icon className="icon" name="open_link" size={24} />
              <a
                href={user.site_url}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.site_url}
              </a>
            </div>
          )}
          <div className="line">
            <Icon className="icon" name="mail" size={24} />
            <a href={`mailto:${user.email}`} className="link">
              {user.email}
            </a>
          </div>
          <div className="line">
            <Icon className="icon" name="comments" size={24} />
            <a
              href={`/ping/${user.username}`}
              className="label"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"Ping"}
            </a>
          </div>
          <div className="line">
            <Icon className="icon" name="location" size={24} />
            <span className="label">{`${
              user.city ? user.city.name : "New York"
            }, ${user.country ? user.country.name : "United States"}`}</span>
          </div>
          <div className="line">
            <Icon className="icon" name="calendar" size={24} />
            <span className="label">{`Joined: ${formatDate(
              user.create_date,
              "D MMMM YY"
            )}`}</span>
          </div>
          <div className="line">
            <Icon className="icon" name="photo" size={24} />
            <span className="label">{"View photos and videos"}</span>
          </div>
        </FloatingWrapper>
        <div className="main-content post-list">
          <div className="list-units">
            <div className="unit">
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
          </div>

          {isLoggedin && me && me.id === user.id && (
            <Composer
              onIssue={post =>
                this.setState({ posts: _.concat([post], posts) })
              }
            />
          )}

          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMorePosts}
            hasMore={hasMorePosts}
          >
            <div className="posts">
              {posts.map((post, i) => (
                <Post key={i} data={post} />
              ))}
            </div>
          </InfiniteScroll>
          {loadPosts && this.renderPostsLoader()}

          {!loadPosts && posts.length === 0 && (
            <div className="not-found">
              <h5>{"No memos from this user"}</h5>
            </div>
          )}
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
    me: state.auth.me
  };
}

export default connect(mapStateToProps, { toggleAuthModal })(withRouter(Memo));

/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { graphql, Mutation, Query } from 'react-apollo';
import _, { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';

import defaultCover from '../../resources/image/cover.png';
import Spinner from '../../components/spinner';
import Avatar from '../../components/avatar';
import Icon from '../../components/icon';
import FloatingWrapper from '../../components/floatingwrapper';
import Searchbar from '../../components/searchbar';
import InfiniteScroll from '../../components/infiniteScroll';
import Post from '../../components/post';
import {
  formatDate,
} from '../../utils';
import {
  qGetChannelByUsername,
  qGetChannelPosts,
  qGetHotChannels,
} from '../../graphql/query';
import {
  mReadChannel,
} from '../../graphql/mutation';
import {
  toggleAuthModal,
} from '../../redux/actions';
import './index.scss';


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

type ChannelData = {
  id: number,
  username: string,
  name: string,
  email: string,
  logo?: string,
  cover_image?: string,
  site_url: number,
  country: Country,
  type: number,
  description: string,
  create_date: Date,
  reading: number,
}

type State = {
  isLoggedin: boolean,
  me: ?any,
  reading: number,
  posts: Array<any>,
  hasMorePosts: boolean,
  loadPosts: boolean,
  sortMethod: number,
};

class Channel extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    reading: -1,
    posts: [],
    hasMorePosts: true,
    loadPosts: true,
    sortMethod: SortMethod.Latest,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
      reading: state.reading === -1 && props.channel.getChannelByUsername? props.channel.getChannelByUsername.reading: state.reading,
    }
  }

  loadMorePosts = () => {
    if (!this.state.loadPosts) {
      this.setState({
        loadPosts: true,
      })
    }
  }

  renderHotChannels() {
    const hotChannels: ?Array<ChannelData> = this.props.hotChannels.getHotChannels;
    if (!hotChannels) {
      return null;
    }

    return (
      <div className='channels'>
        {hotChannels.map((channel: ChannelData) => (
          <a key={channel.id} className='hot-channel' href={`/channels/${channel.username}`}>
            <img src={channel.logo} width={60} height={60} alt='logo' />
            <span className='title'>{channel.name}</span>
          </a>
        ))}
      </div>
    )
  }

  renderPostsLoader() {
    const channel: ?ChannelData = this.props.channel.getChannelByUsername;
    if (!channel) {
      return null;
    }
    const { posts } = this.state

    return (
      <Query query={qGetChannelPosts} variables={{channel_id: channel.id, date: posts.length > 0? posts[posts.length-1].original_post_date: null, isLater: false}}>
        {({ loading, error, data }) => {
          if (loading) return (<Spinner />)
          if (error) return <div></div>

          if (data.getChannelPosts) {
            this.setState({
              posts: _.concat(posts, data.getChannelPosts),
              hasMorePosts: data.getChannelPosts.length === 20,
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
    const { username } = this.props.match.params;
    const {
      isLoggedin,
      me,
      reading,
      posts,
      hasMorePosts,
      loadPosts,
      sortMethod,
    } = this.state;

    if (!username) return null;
    
    const channel: ?ChannelData = this.props.channel.getChannelByUsername;
    if (!channel) {
      return (
        <div className='not-found'>
          <h3>{'This channel is not available'}</h3>
        </div>
      )
    }

    const {
      id,
      email,
      name,
      logo,
      cover_image,
      site_url,
      country,
      description,
      create_date,
    } = channel;

    return (
      <div className='channel'>
        <div className='main-header' style={{ backgroundImage: `url(${cover_image || defaultCover})` }}>
          <Avatar url={logo} size={200} />
          <div className='name'>{`${name}`}</div>
          <div className='location'>{`${country? country.name : 'United States'}`}</div>
          <Mutation mutation={mReadChannel}>
            {(readChannelMutation, { data }) => (
              <button type='button' className='btn btn-main' onClick={() => {
                if (!isLoggedin || !me) {
                  this.props.toggleAuthModal(true);
                  return;
                }

                const newReading = 1 - reading;
                readChannelMutation({
                  variables: {
                    channel_id: id,
                    reading: newReading,
                  }
                }).then(res => {
                  channel.reading = newReading;
                  this.setState({ reading: newReading });
                  return res;
                }).catch(err => {
                });
              }}>
                {reading === 1? 'Unread': 'Read'}
              </button>
            )}
          </Mutation>
        </div>
        <div className='page'>
          <FloatingWrapper className='left-content detail'>
            <div className='main'>
              <Avatar url={logo} size={45} />
              <div className='info'>
                <div className='name'>{`${name}`}</div>
                <div className='username lightBlue'>{`@${username}`}</div>
              </div>
            </div>
            <div className='description'>{description}</div>
            {site_url &&
              <div className='line'>
                <Icon className='icon' name='open_link' size={24} />
                <a href={site_url} className='link' target='_blank' rel='noopener noreferrer'>{site_url}</a>
              </div>
            }
            {email &&
              <div className='line'>
                <Icon className='icon' name='mail' size={24} />
                <a href={`mailto:${email}`} className='link'>{email}</a>
              </div>
            }
            <div className='line'>
              <Icon className='icon' name='location' size={24} />
              <span className='label'>{`${country? country.name : 'United States'}`}</span>
            </div>
            <div className='line'>
              <Icon className='icon' name='calendar' size={24} />
              <span className='label'>{`Joined: ${formatDate(create_date, 'D MMMM YY')}`}</span>
            </div>
            <div className='line'>
              <Icon className='icon' name='photo' size={24} />
              <span className='label'>{'View photos and videos'}</span>
            </div>
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
                <h5>{'No memos from this channel'}</h5>
              </div>
            }
          </div>
          <FloatingWrapper className='right-content'>
            <div className='sub-header'>
              <Icon name='fire' size={24} className='icon icon-primary' />
              <h5 className='sub-header-title'>Hot Channels</h5>
            </div>
            {this.renderHotChannels()}
          </FloatingWrapper>
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

export default compose(
  graphql(qGetChannelByUsername, { name: 'channel', options: (props) => ({ variables: { username: props.match.params.username || '' } }) } ),
  graphql(qGetHotChannels, { name: 'hotChannels', options: (props) => ({ variables: { username: props.match.params.username || '' } }) } ),
  connect(mapStateToProps, { toggleAuthModal }),
)(withRouter(Channel));
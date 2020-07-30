/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { withApollo, Mutation } from 'react-apollo';

import Icon from '../../icon';
import Avatar from '../../avatar'
import defaultCover from '../../../resources/image/cover.png';
import {
  toggleAuthModal,
} from '../../../redux/actions';
import {
  qIsReadingUser,
  qIsReadingChannel,
} from '../../../graphql/query';
import {
  mReadUser,
  mReadChannel,
} from '../../../graphql/mutation';
import './index.scss';


type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  level: number,
  reading: number,
}

type Channel = {
  id: number,
  name: string,
  username: string,
  logo: string,
  cover_image?: string,
  reading: number,
}

type Post = {
  id: number,
  author: ?User,
  channel: ?Channel,
}

type State = {
  isLoggedin: boolean,
  me: ?User,
  reading: number,
};

class ProfileModal extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    reading: -1,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  componentDidMount() {
    this.checkIsReading();
  }

  checkIsReading = async () => {
    const {
      client,
      post: {
        author,
        channel,
      }
    } = this.props;

    if (!client || (!author && !channel) || (author && channel)) {
      return;
    }

    try{
      const readingData = await this.props.client.query({
        query: author? qIsReadingUser: qIsReadingChannel,
        variables: author? { user_id: author.id } : { channel_id: channel.id },
        fetchPolicy: 'no-cache',
      })

      this.setState({
        reading: author? readingData.data.isReadingUser: readingData.data.isReadingChannel
      })
    } catch (e) {
      console.log('error on getting read state', e)
    }
  }

  onPing = () => {

  }

  render() {
    const {
      isLoggedin,
      me,
      reading,
    } = this.state;

    const {
      post,
      downside,
    } = this.props;

    const {
      author,
      channel,
    }: Post = post;

    if ((!author && !channel) || (author && channel)) {
      return null;
    }

    return (
      <div className={`profile-modal ${downside? 'down': 'up'}`}>
        <div className='top-tag'></div>
        {channel &&
          <div className='wrapper' style={{ backgroundImage: `url('${channel.cover_image || defaultCover}')` }}>
            <div className='profile'>
              <Avatar url={channel.logo} size={45} />
              <div className='info'>
                <div className='name'>{channel.name}</div>
                <div className='username lightBlue'>{`@${channel.username}`}</div>
              </div>
            </div>
            <div className='action-group'>
              <div className='d-flex flex-row'>
                <div className='action' onClick={this.onPing}>
                  <Icon className='icon' name='comments' size={24} />
                  <span className='label'>Ping</span>
                </div>
                <a className='action' href={`/channels/${channel.username}`}>
                  <Icon className='icon' name='profile' size={24} />
                  <span className='label'>View Profile</span>
                </a>
              </div>
              {reading !== -1 &&
                <Mutation mutation={mReadChannel}>
                  {(readChannelMutation, { data }) => (
                    <button className='btn-main' onClick={() => {
                      if (!isLoggedin || !me) {
                        this.props.toggleAuthModal(true);
                        return;
                      }

                      const newReading = reading === 1? 0: 1;
                      readChannelMutation({
                        variables: {
                          channel_id: channel.id,
                          reading: newReading,
                        }
                      }).then(res => {
                        this.setState({ reading: newReading });
                        return res;
                      }).catch(err => {
                      });
                    }}>
                      {`${reading === 1? 'Stop': 'Start'} Reading`}
                    </button>
                  )}
                </Mutation>
              }
            </div>
          </div>
        }
        {author &&
          <div className='wrapper' style={{ backgroundImage: `url('${author.cover_image || defaultCover}')`}}>
            <div className='profile'>
              <Avatar url={author.photo} level={author.level} size={45} />
              <div className='info'>
                <div className='name'>{`${author.first_name} ${author.last_name}`}</div>
                <div className='username lightBlue'>{`@${author.username}`}</div>
              </div>
            </div>
            <div className='action-group'>
              <div className='d-flex flex-row'>
                <div className='action' onClick={this.onPing}>
                  <Icon className='icon' name='comments' size={24} />
                  <span className='label'>Ping</span>
                </div>
                <a className='action' href={`/profile/${author.username}`}>
                  <Icon className='icon' name='profile' size={24} />
                  <span className='label'>View Profile</span>
                </a>
              </div>
              {reading !== -1 && (!me || me.id !== author.id) &&
                <Mutation mutation={mReadUser}>
                  {(readUserMutation, { data }) => (
                    <button className='btn-main' onClick={() => {
                      if (!isLoggedin || !me) {
                        this.props.toggleAuthModal(true);
                        return;
                      }

                      const newReading = reading === 1? 0: 1;
                      readUserMutation({
                        variables: {
                          user_id: author.id,
                          reading: newReading,
                        }
                      }).then(res => {
                        this.setState({ reading: newReading });
                        return res;
                      }).catch(err => {
                      });
                    }}>
                      {`${reading === 1? 'Stop': 'Start'} Reading`}
                    </button>
                  )}
                </Mutation>
              }
            </div>
          </div>
        }
        <div className='bottom-tag'></div>
      </div>
    )
  };
};

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, { toggleAuthModal })(withApollo(ProfileModal))
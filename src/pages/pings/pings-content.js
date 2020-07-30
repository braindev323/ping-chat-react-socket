/* @flow */

import React from 'react'
import './pings-content.scss'
import Icon from '../../components/icon'
import Avatar from '../../components/avatar'
import PingMessages from './ping-messages'
import VideoCalling from './components/video'
import TypeMessage from '../../components/type-message'
import io from 'socket.io-client';
import config from '../../config'
import { connect } from 'react-redux';
import { openCalling, closeCalling } from './../../redux/actions/call';
import { ChatContentType, CallType, ChatChannelType } from './../../constants';
import { withApollo } from 'react-apollo';
import { mUpload } from './../../graphql/mutation/upload';
import pingSound from '../../resources/ping.mp3'
var SOCKET_KEY_USER_LOGIN = 'socket:key:user:login';
var SOCKET_KEY_CHAT_MESSAGE = 'socket:key:chat:message';
var SOCKET_KEY_CHAT_HISTORY = 'socket:key:chat:history';

var SOCKET_EVENT_CHAT_MESSAGE = 'socket:event:chat:message';
var SOCKET_EVENT_CHAT_READ = 'socket:event:chat:read';
var SOCKET_EVENT_CHAT_TYPING = 'socket:event:chat:typing';

var SOCKET_KEY_CALL_OFFER = 'socket:key:call:offer';
var SOCKET_KEY_CALL_ANSWER = 'socket:key:call:answer';
var SOCKET_KEY_CALL_CLOSE = 'socket:key:call:close';

var SOCKET_EVENT_CALL_OFFER = 'socket:event:call:offer';
var SOCKET_EVENT_CALL_ANSWER = 'socket:event:call:answer';
var SOCKET_EVENT_CALL_CLOSE = 'socket:event:call:close';

var channel_type = ChatChannelType.Private;
var content_type = ChatContentType.Text;
var disconnectedByError = false;

type State = {}

class PingsContent extends React.Component<any, State>{
  state: State = {
    messages: [],
    contactInfo: {},
    socket: {},
    readyCalling: false,
    callRoomId: '',
    receiving: false,
    calling: false,
    isFocus: false
  }

  componentWillUnmount() {
    this.state.socket.close();
    window.removeEventListener('blur', this.handleActivity)
    document.removeEventListener('blur', this.handleActivity)
    window.removeEventListener('focus', this.handleActivity)
    document.removeEventListener('focus', this.handleActivity)
    document.removeEventListener('visibilitychange', this.handleActivity)
  }

  componentDidMount() {
    document.addEventListener('visibilitychange', this.handleActivity)
    document.addEventListener('blur', () => this.handleActivity(false))
    window.addEventListener('blur', () => this.handleActivity(false))
    window.addEventListener('focus', () => this.handleActivity(true))
    document.addEventListener('focus', () => this.handleActivity(true))

    let scopeThis = this;
    var socket = io(config.server_root_url, {
      transports: ['websocket'],
    });
    this.setState({ socket });
    socket.on('connect', () => {
      socket.emit(SOCKET_KEY_USER_LOGIN,
        this.getToken(),
        (error, res) => {
          if (error) {
            console.error(error);
            disconnectedByError = true;
            socket.close();
          } else {
            console.log("Socket connected", res)

          }
        });
    });

    socket.on('disconnect', () => {
      if (!disconnectedByError) {
        console.log('Connection lost from server.');
      }
      console.log("disconnect")
      disconnectedByError = false;
    });

    //on get new messages from socket
    socket.on(SOCKET_EVENT_CHAT_MESSAGE, (message) => {
      scopeThis.receivedStatus(message.channel, message.id,);
      scopeThis.readStatus(message.channel, message.id);
      console.log('received')
      if (!scopeThis.state.isFocus) new Audio(pingSound).play()
      if (+scopeThis.state.contactInfo.id === +message.channel)
        scopeThis.addNewMessage(message);
    });

    //on read status from socket
    socket.on(SOCKET_EVENT_CHAT_READ, (response) => {
      console.log('read status :', response);
    });

    //on received status from socket
    socket.on('chat:room:listen:received:status', (response) => {
      console.log('recieved status :', response);
    });

    //on typing status from socket
    socket.on(SOCKET_EVENT_CHAT_TYPING, (response) => {
      console.log('typing status :', response);
    });

    //get call offer from socket
    socket.on(SOCKET_EVENT_CALL_OFFER, function (response) {
      console.log('received call offer ', response);
      scopeThis.setState({ callRoomId: response.offer, receiving: true });
      scopeThis.props.openCalling(CallType.Video);
    });

    //get call answer from socket
    socket.on(SOCKET_EVENT_CALL_ANSWER, function (response) {
      console.log('received call answer ', response);
      scopeThis.props.closeCalling();
      scopeThis.setState({ readyCalling: true });
    });

    //get call close from socket
    socket.on(SOCKET_EVENT_CALL_CLOSE, function (response) {
      console.log('received call close ', response);
      scopeThis.props.closeCalling();
      scopeThis.setState({ readyCalling: false, callRoomId: '', receiving: false, calling: false });
    });
  }

  handleActivity = (forcedFlag) => {
    if (typeof forcedFlag === 'boolean') {
      return this.setState({ isFocus: forcedFlag })
    }
    return this.setState({ isFocus: !document.hidden })
  }

  async componentWillReceiveProps(next) {
    if (next.selectedContact !== this.props.selectedContact && next.selectedContact) {
      if (next.selectedContact.account) {
        var messages = await this.getHistory(next.selectedContact.account.id, channel_type)
        this.setState({ messages, contactInfo: next.selectedContact.account });
      }
    }
    if (next.token !== this.props.token) {
      const { socket } = this.state
      socket.close();
      socket.on('connect', () => {
        socket.emit(SOCKET_KEY_USER_LOGIN,
          next.token,
          (error, res) => {
            if (error) {
              console.error(error);
              disconnectedByError = true;
              socket.close();
            } else {
              console.log("Socket Re connected", res)

            }
          });
      });
    }
  }

  getToken() {
    let token = localStorage.getItem(config.key_token);
    return token;
  }

  getHistory = (channel, type) => {
    const { socket } = this.state;
    return new Promise((resolve, reject) => {
      socket.emit(SOCKET_KEY_CHAT_HISTORY, { channel, type }, (error, messages) => {
        if (error) {
          console.log('gettingHistory error :', error);
          reject(error);
        } else {
          resolve(messages);
        }
      });
    })
  }

  receivedStatus = (channel_id, message_id) => {
    const { socket } = this.state;
    socket.emit('chat:room:send:read:status', { channel_id, message_id }, (response) => {
      console.log('read status emitted :', response);
    });
  }

  readStatus = (channel_id, message_id) => {
    const { socket } = this.state;
    socket.emit('chat:room:send:received:status', { channel_id, message_id }, (response) => {
      console.log('received status emitted :', response)
    });
  }

  typingStatus = (channel_id, is_typing_val) => {
    const { socket } = this.state;
    socket.emit('chat:room:send:typing:status', { channel_id, is_typing: is_typing_val }, (response) => {
      console.log('send typing status emitted :', response)
    });
  }

  onlineStatus = (user_type, user_id) => {
    const { socket } = this.state;
    socket.emit('chat:user:check:online:status', { user_type, user_id }, (response) => {
      console.log('user check online emitted :', response)
    });
  }

  deleteMessage = (channel_id, message_id) => {
    const { socket } = this.state;
    console.log('deleted', channel_id, message_id)
    socket.emit('chat:room:delete', { channel_id, message_id }, (response) => {
      console.log('delete message emitted :', response)
    });
  }

  sendMessage = (msg) => {
    const { contactInfo, socket } = this.state;
    const scopeThis = this;
    const message_content = msg;
    if (!message_content) {
      return alert('message content is empty')
    }
    content_type = ChatContentType.Text
    socket.emit(SOCKET_KEY_CHAT_MESSAGE, {
      channel: contactInfo.id,
      content: {
        text: message_content,
        type: content_type,
      },
      type: channel_type,
    }, (error, message) => {
      content_type = ChatContentType.Text;
      if (error) {
        console.error(error);
      } else {
        scopeThis.addNewMessage(message)
      }
    });
  }

  addNewMessage = (message) => {
    console.log(message)
    this.setState((state) => {
      var msgs = state.messages;
      msgs.unshift(message);
      return { messages: msgs };
    });
  }


  callOffer(channel, offerVal) {
    const { socket } = this.state;
    socket.emit(SOCKET_KEY_CALL_OFFER, {
      channel,
      offer: offerVal,
      type: channel_type,
    }, function (error, message) {
      if (error) {
        console.error('offer emit error :', error);
      } else {
        console.log('call offer emit :', message)
      }
    });
  }

  callAnswer(channel, answerVal) {
    const { socket } = this.state;
    socket.emit(SOCKET_KEY_CALL_ANSWER, {
      channel,
      answer: answerVal,
      type: channel_type,
    }, function (error, message) {
      if (error) {
        console.error('answer emit error :', error);
      } else {
        console.log('answer emit :', message)
      }
    });
  }

  callClose(channel) {
    const { socket } = this.state;

    socket.emit(SOCKET_KEY_CALL_CLOSE, {
      channel,
      type: channel_type,
    }, function (error, message) {
      if (error) {
        console.error('close emit error :', error);
      } else {
        console.log('close emit :', message)
      }
    });
  }

  onClickClose = () => {
    const { contactInfo: { id } } = this.state;
    this.props.closeCalling();
    this.callClose(id);
    this.setState({ readyCalling: false, callRoomId: '', receiving: false, calling: false });
  }
  videoCall = () => {
    const { contactInfo: { id } } = this.state;
    this.props.openCalling(CallType.Video);
    let callRoomId = `from${this.props.myInfo.id}to${id} `;
    this.setState({ callRoomId, calling: true });
    this.callOffer(id, callRoomId);
  }

  connect = () => {
    this.callAnswer(this.state.contactInfo.id, null);
    this.props.closeCalling();
    this.setState({ readyCalling: true });
  }

  upload = (contentType, file) => {
    const { contactInfo, socket } = this.state;
    const { client } = this.props;
    let scopeThis = this;
    var fMsg = {
      content: {
        audio: null,
        image: null,
        text: null,
        type: contentType === ChatContentType.Image ? ChatContentType.Video : contentType,
        video: null,
      }
    }
    scopeThis.addNewMessage(fMsg)
    client.mutate({
      mutation: mUpload,
      variables: { file },
      fetchPolicy: "no-cache"
    }).then((res) => {
      const { url } = res.data.upload;
      socket.emit(SOCKET_KEY_CHAT_MESSAGE, {
        channel: contactInfo.id,
        content: {
          image: contentType === ChatContentType.Image ? url : null,
          video: contentType === ChatContentType.Video ? url : null,
          audio: contentType === ChatContentType.Audio ? url : null,
          type: contentType,
        },
        type: channel_type,
      }, (error, message) => {
        if (error) console.log(error);
        else {
          console.log("success attach file emit :", message)
          var msgs = scopeThis.state.messages;
          msgs.shift();
          scopeThis.setState({ messages: msgs })
          scopeThis.addNewMessage(message)
        }
      });
    })
      .catch((err) => console.log(err))
  }

  render() {
    const { contactInfo, messages, readyCalling, callRoomId, receiving, calling, isFocus } = this.state;
    const { isMediaCalling } = this.props;
    return (
      <div className="pings-content">
        <div className="barContent">
          <div className="user-info">
            <div className="user-ctn">
              <div className="avt">
                {/* <img src={AvtImg} alt="" /> */}
                <Avatar url={contactInfo.photo} size={200} />
              </div>
              <div className="user-detail">
                <h3>{contactInfo.first_name} {contactInfo.last_name} <span>@therealjohndoe</span></h3>
                <p>Manhattan, U.S.A</p>
              </div>
            </div>
          </div>
          <div className="actions-call">
            <div className="icon-wrap"><Icon name="phone_wifi" className="icon" size={24} /></div>
            <div className="icon-wrap" onClick={this.videoCall}><Icon name='camera' className='icon' size={24} /></div>
            <div className="icon-wrap"><Icon name='group' className='icon' size={24} /></div>
          </div>
          <div className="right-options">
            <p>Reading </p>
          </div>
        </div>

        {
          isMediaCalling &&
          <div className="call-buttons">
            {calling && <button onClick={this.onClickClose} >Cancel</button>}
            {receiving && <button onClick={this.connect}>Answer</button>}
            {receiving && <button onClick={this.onClickClose} >Decline</button>}
          </div>
        }
        <PingMessages messages={messages} />
        <TypeMessage sendMessage={this.sendMessage} typingStatus={(tval) => this.typingStatus(contactInfo.id, tval)} upload={this.upload} />
        {readyCalling && <VideoCalling roomId={callRoomId} onClose={this.onClickClose} />}
      </div >
    )
  }
}

function mapStateToProps(state) {
  return {
    isMediaCalling: state.call.isCalling,
    callType: state.call.callType,
    myInfo: state.auth.me,
    selectedContact: state.contacts.selectedContact,
    token: state.auth.token
  }
}

export default connect(mapStateToProps, { openCalling, closeCalling })(withApollo(PingsContent));
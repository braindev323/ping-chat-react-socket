/* @flow */

import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Searchbar from "../../components/searchbar";
import Icon from "../../components/icon";
import Verified from "../../resources/image/pings/Verified.svg";
import Verified1 from "../../resources/image/pings/Verified1.svg";
import activePing from "../../resources/image/pings/active-ping.svg";
import {
  changeTheme,
} from '../../redux/actions';
import { selectContact } from './../../redux/actions/contacts';
import Spinner from './../../components/spinner/index';
import AvtImg from '../../resources/image/avatar.png'
import io from 'socket.io-client';
import config from '../../config'
import { ChatChannelType } from "../../constants";
var channel_type = ChatChannelType.Private;
type State = {
  theme: string,
};
var SOCKET_KEY_USER_LOGIN = 'socket:key:user:login';
var SOCKET_KEY_CHAT_HISTORY = 'socket:key:chat:history';
var socket;
class PingsBar extends React.Component<any, State> {
  state: State = {
    theme: "dark",
    oldMsgs: {}
  };

  static getDerivedStateFromProps(props: any, state: State) {
    let newState: any = {
      theme: props.theme,
    };

    return newState;
  }

  componentDidMount() {
    let scopeThis = this;
    socket = io(config.server_root_url, {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      socket.emit(SOCKET_KEY_USER_LOGIN,
        this.getToken(),
        (error, res) => {
          if (error) {
            console.error(error);
            socket.close();
          } else {
            scopeThis.props.myContacts.forEach(({ account: { id } }) => {
              socket.emit(SOCKET_KEY_CHAT_HISTORY, { channel: id, type: channel_type }, (error, messages) => {
                if (error) {
                  console.log('gettingHistory error :', error);
                } else {
                  let ms = messages;
                  let lastMsg = ms.shift();
                  scopeThis.setState((state) => { return { oldMsgs: { ...state.oldMsgs, [id]: lastMsg.content } } })
                }
              });
            });

          }
        });
    });
  }
  componentWillReceiveProps(next) {
    if (next.token !== this.props.token) {
      const { socket } = this.state
      socket.close();
      socket.on('connect', () => {
        socket.emit(SOCKET_KEY_USER_LOGIN,
          next.token,
          (error, res) => {
            if (error) {
              console.error(error);
              socket.close();
            } else {
              console.log("Socket Re connected", res)

            }
          });
      });
    }
  }
  componentWillUnmount() {
    socket.close();
  }
  getToken() {
    let token = localStorage.getItem(config.key_token);
    return token;
  }
  switchTheme = () => {
    const theme = this.state.theme === "dark" ? "light" : "dark";
    this.props.changeTheme(theme);
  };

  onClickContact = (username) => {
    this.props.selectContact(this.props.contactByUsername[username])
    if (username) this.props.history.push(`/pings/${username}`)
  };
  renderLastMsg = (content) => {
    return content && (content.text || (content.image && "Image...") || (content.video && "Video...") || (content.audio && "Audio..."))
  }
  renderContact = (({ account, id }) => {
    const { theme, oldMsgs } = this.state;
    return <div
      onClick={() => this.onClickContact(account.username)}
      key={id}
      className="ping-item"
    >
      <div className="ping-info">
        <div className="avatar">
          <img src={account.photo || AvtImg} alt="user" className="user" />
          <img
            className="verified"
            src={theme ? Verified1 : Verified}
            alt="verified"
          />
        </div>
        <div className="message">
          <p>
            <b className="username">{account.first_name} {account.last_name}</b>{" "}
            <span className="active">Active</span>
          </p>
          <p>{this.renderLastMsg(oldMsgs[account.id])}</p>
        </div>
      </div>
      <div className="unread-message">
        <img src={activePing} alt="active-ping" />
        <span>1 Unread Ping</span>
      </div>
    </div>
  });

  render() {
    const { myContacts, selectedContact, fetchingContacts } = this.props;
    const { oldMsgs } = this.state;
    return (
      <div className="pings-bar">
        <div className="search list-units">
          <Searchbar placeholder="Search Pings…" className="unit" />
          <div className="unit">
            <Icon className="icon" name="calendar_event" size={24} />
            <h5 className="title">Sort by Most Recent</h5>
          </div>
        </div>
        {fetchingContacts && <Spinner />}
        {myContacts.length && selectedContact && myContacts.map(this.renderContact)}
        {!selectedContact && !fetchingContacts && <div className="add_contact">Please add to contact</div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    theme: state.theme.type,
    myContacts: state.contacts.myContacts,
    selectedContact: state.contacts.selectedContact,
    contactByUsername: state.contacts.contactByUsername,
    token: state.auth.token
  }
}

export default connect(mapStateToProps, { changeTheme, selectContact })(withRouter(PingsBar));
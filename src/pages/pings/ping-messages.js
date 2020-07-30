/* @flow */

import React from 'react'
import './ping-messages.scss'
import _ from 'lodash';
import moment from 'moment';
import { ChatContentType } from './../../constants';
import dotMenu from "../../resources/image/pings/baseline-more_vert-24px.svg";
import axios from 'axios';
import { validURL } from './helpers/index';
import ChatVideoPlayer from './components/chatVideoPlayer/index';
import ChatAudioPlayer from './components/chatAudioPlayer/index';
type State = {

};
let fetching = false;
const textEditList = [{ label: 'Edit', value: 'edit' }, { label: 'Copy', value: 'copy' }, { label: 'Quote', value: 'quote' }, { label: 'Share', value: 'share' }, { label: 'Select Messages', value: 'select' }, { label: 'Erase', value: 'erase' }]
const fileEditList = [{ label: 'Open', value: 'open' }, { label: 'Save as', value: 'saveas' }, { label: 'Share', value: 'share' }, { label: 'Erase', value: 'erase' }]

class PingMessages extends React.Component<any, State> {
  state = {
    isShowingDotMenu: false,
    dotMenuId: null,
    openEditPanel: false,
    dotMenuPanId: null,
  }

  componentWillMount() {
  }
  componentWillReceiveProps(next) {
    var scopeThis = this;
    if (next.messages.length !== this.props.messages) {
      if (next.messages.length > 1)
        setTimeout(() => {
          scopeThis.scrollToBottom();
        }, 200);
    }
  };


  scrollToBottom() {
    var listHeight = document.querySelector('.ping-messages #list ul');
    if (listHeight) {
      var messagesWrapperHeight = listHeight.clientHeight;
      document.querySelector('#list').scrollTo(0, messagesWrapperHeight)
    }
  }

  getChatHeight() {
    var listHeight = document.querySelector('.ping-messages #list ul');
    if (listHeight)
      return listHeight.clientHeight;
    return 0
  }

  checkPanOverFlow = (message) => {
    if (message.content.type === ChatContentType.Text && message.content.text.length < 15) return true;
    return false;
  }

  isSender = (message) => {
    return message.user_id === message.content.user_id;
  }
  showDotMenu = (id) => {
    this.setState({ isShowingDotMenu: true, dotMenuId: id })
  }
  hideDotMenu = () => {
    this.setState({ isShowingDotMenu: false, dotMenuId: null })
  }
  openEditMenu = (id) => {
    setTimeout(() => {
      this.setState({ openEditPanel: true, dotMenuPanId: id })
    }, 200);
  }
  onClickEditList = (listVal) => {
    const { dotMenuPanId } = this.state;
    console.log(dotMenuPanId, listVal)
    this.setState({ openEditPanel: false, dotMenuPanId: null })
  }
  renderEditList = (kind) => {
    switch (kind) {
      case ChatContentType.Text:
        return textEditList.map((e) => <div key={e.value} onClick={() => this.onClickEditList(e.value)} >{e.label}</div>);
      case ChatContentType.Audio:
        return fileEditList.map((e) => <div key={e.value} onClick={() => this.onClickEditList(e.value)} >{e.label}</div>);
      case ChatContentType.Video:
        return fileEditList.map((e) => <div key={e.value} onClick={() => this.onClickEditList(e.value)} >{e.label}</div>);
      case ChatContentType.Image:
        return fileEditList.map((e) => <div key={e.value} onClick={() => this.onClickEditList(e.value)} >{e.label}</div>);
      default:
        return textEditList.map((e) => <div key={e.value} onClick={() => this.onClickEditList(e.value)} >{e.label}</div>);
    }
  }

  onBlurEditPan = (event) => {
    this.setState((state) => { if (state.openEditPanel) return { openEditPanel: false, dotMenuPanId: null } })
  }

  getWebPreview = (url) => {
    const cacheData = this.getWebPreviewFromCache(url);
    if (cacheData) return JSON.parse(cacheData);
    if (fetching) return;
    const scopeThis = this;
    const key = "1fd85e51d4ff39e253ece2cb808d51ce";
    var data = JSON.stringify({ q: url, key });

    var config = {
      method: 'post',
      url: 'http://api.linkpreview.net',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    fetching = true;
    axios(config)
      .then(function (response) {
        console.log(response.data);
        scopeThis.saveWebPreviewToCache(url, JSON.stringify(response.data))
        fetching = false
        return response.data;
      })
      .catch(function (error) {
        fetching = false
        console.log(error);
      })

  }

  saveWebPreviewToCache = (key, data) => {
    localStorage.setItem(key, data);
  }

  getWebPreviewFromCache = (key) => {
    return localStorage.getItem(key)
  }
  setPlayer = (player) => {
    console.log('player', player)
    this.player = player
  }

  calculateDateOffset = (dateTST) => {
    var today = new Date();
    var a = moment(today);
    var b = moment(dateTST);
    var diffD = a.diff(b, 'days');
    return diffD === 0 ? "Today" : diffD === 1 ? "Yesterday" : moment(dateTST).format('DD MMM YYYY')

  }
  hrefTo = (link) => {
    window.open(link)
  }
  renderMessage = (message, index) => {
    const { isShowingDotMenu, dotMenuId, openEditPanel, dotMenuPanId } = this.state
    const {
      messages,
    } = this.props;
    return (<li key={message.id} >
      {messages[index + 1] && (moment(message.create_date).format('DD MMM YYYY') !== moment(messages[index + 1].create_date).format('DD MMM YYYY')) && <p className="date-show">{this.calculateDateOffset(message.create_date)}</p>}

      <div className={`line-msg ${this.isSender(message) ? 'reply' : 'msg'}`} onMouseOver={() => this.showDotMenu(message.id)} onMouseLeave={() => this.hideDotMenu(message.id)}>
        <div className={`info ${message.content.type === ChatContentType.Audio ? 'audio-info' : ''}`} >
          {message.content.type === ChatContentType.Text && (validURL(message.content.text) ?
            <div className="text web-preview" onClick={() => this.hrefTo(message.content.text)} >

              {this.getWebPreview(message.content.text) && this.getWebPreview(message.content.text).image && <img src={this.getWebPreview(message.content.text).image} className="web-image" alt="webimage" />}
              <div className="web-preview-inner">
                {this.getWebPreview(message.content.text) && <div className="web-description-wrap">
                  <div className="web-title">{this.getWebPreview(message.content.text).title}</div>
                  <div className="web-description">{this.getWebPreview(message.content.text).description}</div>
                </div>}
                <p className="web-link">
                  {message.content.text}
                </p>
              </div>
            </div>
            : <p className="text">{message.content.text}</p>)}
          {message.content.type === ChatContentType.Video && <ChatVideoPlayer url={message.content.video} progressClass="video-reply-progress" className='video-container-overlay' />}
          {message.content.type === ChatContentType.Image && <img src={message.content.image} className="image-render" alt="chatimage" />}
          {message.content.type === ChatContentType.Audio && <ChatAudioPlayer url={message.content.audio} progressClass="reply-progress" className="audio-render" />}
          {message.content.type === ChatContentType.File && <p className="text">{message.content.file}</p>}
          {isShowingDotMenu && dotMenuId === message.id && <div className="dot-menu" onClick={() => this.openEditMenu(message.id)}><img src={dotMenu} alt="editMEnu" /></div>}
          {openEditPanel && dotMenuPanId === message.id && <div className={`dot-edit-pan ${!this.isSender(message) && this.checkPanOverFlow(message) ? 'pan-overflow' : ''}`} >
            {this.renderEditList(message.content.type)}
          </div>}
          <p className="dtime">{moment(message.create_date).format('hh:mm')}</p>

        </div>
      </div>
    </li>
    )
  }



  render() {
    const {
      messages,
    } = this.props;
    return (
      <div className="ping-messages" onClick={this.onBlurEditPan} >
        <div className="msg-content" id="list">
          <ul>
            {messages.map(this.renderMessage)}
          </ul>
        </div>
      </div>
    )
  }
}

export default PingMessages;
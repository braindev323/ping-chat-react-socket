/* @flow */

import React from 'react'
import './index.scss'
import Icon from '../icon'
import Picker, { SKIN_TONE_DARK } from 'emoji-picker-react';
import { ChatContentType } from './../../constants';
import Hover from '../hover';

type State = {
  newMsg: string,
  fetchingLocation: boolean,
}

class TypeMessage extends React.Component<any, State> {
  state: State = {
    newMsg: '',
    fetchingLocation: false,
    showEmojiState: false
  }

  componentDidMount() {
    document.querySelector('aside.emoji-picker-react input.emoji-search').placeholder = "Search"
    document.querySelector('aside.emoji-picker-react input.emoji-search').parentElement.classList.add('wrap-input')
  }

  onChangeMessage = (e: any) => {
    this.setState({ newMsg: e.target.value });
    this.props.typingStatus(e.target.value);
  }

  clearInput = () => {
    this.setState({ newMsg: '' })
  }

  newMessage = (e: any) => {
    e.preventDefault();
    this.props.sendMessage(this.state.newMsg);
    this.clearInput();
    this.setState({ showEmojiState: false })
  }

  sendLocation = () => {
    this.setState({
      fetchingLocation: true
    });
    if (!navigator.geolocation) {
      return alert('GeoLocation not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      // todo send location
      console.log(pos)
    }, () => {
      alert('Unable to fetch location');
    });
  };

  onEmojiClick = (event, emojiObject) => {
    this.setState((state) => { return { newMsg: state.newMsg + emojiObject.emoji } });
  };

  showEmojiBox = () => {
    this.setState((state) => { return { showEmojiState: !state.showEmojiState } })
  }

  onFileChange = (e) => {
    let type = null;
    switch (e.target.name) {
      case "video":
        type = ChatContentType.Video;
        break;
      case "image":
        type = ChatContentType.Image;
        break;
      case "audio":
        type = ChatContentType.Audio;
        break;
      case "file":
        type = ChatContentType.File;
        break;
      default:
        type = 0
    }
    this.props.upload(type, e.target.files[0])
  }

  render() {
    const { newMsg, showEmojiState } = this.state;
    return (
      <div className="type-message">
        <div className={showEmojiState ? 'show' : 'hide'}>
          <Picker onEmojiClick={this.onEmojiClick} skinTone={SKIN_TONE_DARK} disableSkinTonePicker preload />
        </div>
        <div className="actions">
          <Hover className="file-upload" onHover={<div>Add a video</div>}>
            <label htmlFor="video-input">
              <Icon
                name='play_fill'
                size={20}
                className="icon"
              />
            </label>

            <input id="video-input" name="video" type="file" accept="video/mp4,video/x-m4v,video/*" onChange={this.onFileChange} />
          </Hover>

          <Hover className="file-upload" onHover={<div>Add an image</div>}>
            <label htmlFor="image-input">
              <Icon
                name='photo'
                size={20}
                className="icon"
              />
            </label>
            <input id="image-input" name="image" type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onFileChange} />
          </Hover>

          <Hover className="file-upload" onHover={<div>Upload Files</div>}>
            <div className="file-upload">
              <label htmlFor="file-input">
                <Icon
                  name='upload'
                  size={20}
                  className="icon"
                />
              </label>
              <input id="file-input" name="file" type="file" onChange={this.onFileChange} />
            </div>
          </Hover>
          <Hover className="file-upload" onHover={<div>Add an audio</div>}>
            <div className="file-upload">
              <label htmlFor="audio-input">
                <Icon
                  name='sound_on'
                  size={20}
                  className="icon"
                />
              </label>
              <input id="audio-input" name="audio" type="file" accept=".mp3,audio/*" onChange={this.onFileChange} />
            </div>
          </Hover>
      
          <Hover className="file-upload" onHover={<div>Share Location</div>}>
            <Icon
              name='location'
              size={20}
              className="icon"
              onClick={this.sendLocation}
            />
          </Hover>
          <Hover className="file-upload" onHover={<div>Attach link</div>}>
            <Icon
              name='link'
              size={20}
              classN
              ame="icon"
            />
          </Hover>
          <Hover className="file-upload" onHover={<div>Add an emoji</div>}>
            <Icon
              name='emoji'
              size={20}
              className="icon"
              onClick={this.showEmojiBox}
            />
          </Hover>

        </div>
        <form className="input-text" onSubmit={(e) => this.newMessage(e)} >
          <input type="text" placeholder="Type your message here…" value={newMsg} onChange={this.onChangeMessage} />
          <button type="submit">
            < Icon name="send" className="icon" size={20} />
          </button>
        </form>
      </div >
    )
  }
}

export default TypeMessage;
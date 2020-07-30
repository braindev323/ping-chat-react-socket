/* @flow */

import React from 'react';

import Icon from '../icon';
import VideoPlayer from '../videoPlayer';


type Props = {
  className?: string,
  onApply?: (url: string) => any,
};

type State = {
  url: string,
  isValid: boolean,
};

export default class VideoImporter extends React.Component<Props, State> {
  state: State = {
    url: '',
    isValid: false,
  }

  onChange = async (e: any) => {
    const url = e.target.value;
    this.setState({
      url,
      isValid: false,
    });
  }
  
  onApply = () => {
    const {
      url,
      isValid,
    } = this.state;

    if (url && isValid && this.props.onApply) {
      this.props.onApply(url);
    }
  }

  onReady = () => {
    this.setState({
      isValid: true,
    })
  }

  render() {
    const {
      className,
    } = this.props;

    const {
      url,
      isValid,
    } = this.state;

    return (
      <div className={`video-importer ${className || ''}`}>
        <div className='main-input'>
          <Icon className='icon' name='link' size={20} />
          <input
            type='text'
            name='url'
            placeholder='Paste Video URL here'
            value={url}
            onChange={this.onChange} />
          <div className={`apply ${url && isValid? '': 'disable'}`} onClick={this.onApply}>
            <span>apply</span>
          </div>
        </div>
        {url &&
          <div className='video-preview'>
            <div className={`video-wrapper main-ratio ${isValid? '': 'hide'}`}>
              <VideoPlayer url={url} onReady={() => this.setState({isValid: true})} onError={() => this.setState({isValid: false})} />
            </div>
          </div>
        }
      </div>
    )
  };
};
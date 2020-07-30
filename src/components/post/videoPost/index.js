/* @flow */

import React from 'react';

import VideoPlayer from '../../videoPlayer';
import Icon from '../../icon';
import Header from '../header';
import Content from '../content';
import './index.scss';

type Props = {
  data: any,
};

type State = {
  load_video: boolean,
  playing: boolean,
};

export default class VideoPost extends React.Component<Props, State> {
  state: State = {
    load_video: false,
    playing: false,
  }

  render() {
    const {
      cover_image,
      media: {
        videos,
      },
    } = this.props.data;

    const {
      load_video,
      playing,
    } = this.state;

    if (!videos || videos.length < 1) {
      return null;
    }

    return (
      <div className='post post-video main-ratio'>
        <div className='post-wrapper'>
          {load_video?
            <div className='video-preview main-ratio'>
              <VideoPlayer url={videos[0].url} onChangeState={playing => this.setState({playing})} />
            </div>
          :
            <div className='image-wrapper'>
              {(videos[0].thumb_url || cover_image) &&
                <img className='content' src={videos[0].thumb_url || cover_image} alt='Full preview' />
              }
            </div>
          }
          <div className={`post-content ${load_video? 'playing': ''}`}>
            {!load_video &&
              <div className='video-button'>
                <Icon className='icon' name='play' size={80} onClick={() => this.setState({load_video: true})} />
              </div>
            }
            {(!load_video || !playing) &&
              <Header post={this.props.data} />
            }
            {(!load_video || !playing) &&
              <Content post={this.props.data} />
            }
          </div>
        </div>
      </div>
    )
  };
};
/* @flow */

import React from 'react';
import { Decoder, tools, Reader } from 'ts-ebml';

import Icon from '../icon';
import {
  formatTime,
} from '../../utils';


const RecordLimitDuration = 300;

type Props = {
  className?: string,
  onApply?: (url: string, file: File) => any,
  onCancel?: () => any,
};

type State = {
  url: string,
  recording: boolean,
  stopRecord: boolean,
  playing: boolean,
  ended: boolean,
  duration: number,
  played: number,
};

export default class VideoCapture extends React.Component<Props, State> {
  state: State = {
    url: '',
    recording: false,
    stopRecord: false,
    playing: false,
    ended: false,
    duration: 0,
    played: 0,
  }

  player: ?HTMLVideoElement;
  mediaRecorder: ?window.MediaRecorder;
  stream: any;
  recordedChunks: any = [];
  startedAt: number = 0;
  endedAt: number = 0;
  
  counterTimer: ?IntervalID;
  limitTimer: ?TimeoutID;

  toggleRecord = () => {
    const {
      recording,
    } = this.state;

    if (recording) {
      this.stopRecord();
    } else {
      this.startRecord();
    }
  }

  startRecord() {
    this.recordedChunks = [];
    this.mediaRecorder && this.mediaRecorder.start();
    const player = this.player;
    if (player) {
      player.srcObject = this.stream;
      player.play();
    }
    this.startedAt = new Date().getTime();
    this.counterTimer = setInterval(() => {
      this.setState({duration: this.state.duration + 1});
    }, 1000);
    this.limitTimer = setTimeout(() => {
      this.stopRecord();
    }, RecordLimitDuration * 1000);
    
    this.setState({
      recording: true,
      playing: false,
      ended: false,
      duration: 0,
      played: 0,
    });
  }

  stopRecord() {
    if (this.player) this.player.srcObject = null;
    this.mediaRecorder && this.mediaRecorder.stop();
    this.endedAt = new Date().getTime();
    clearInterval(this.counterTimer);
    clearTimeout(this.limitTimer);
    
    this.setState({
      recording: false,
      playing: false,
      ended: false,
      duration: (this.endedAt - this.startedAt) / 1000,
      played: 0,
    });
  }

  playPause = () => {
    const {
      playing,
    } = this.state;

    if (playing) {
      this.player && this.player.pause();
    } else {
      this.player && this.player.play();
    }
  }

  stopCamera() {
    this.stream && this.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  
  onApply = () => {
    const {
      url,
      recording,
    } = this.state;

    if (recording) return;

    this.stopCamera();

    if (url && this.props.onApply) {
      this.props.onApply(url, new File(this.recordedChunks, 'capture.webm', {type: 'video/webm;'}));
    }
  }

  onCancel = () => {
    this.stopCamera();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  onReady = (player: ?HTMLVideoElement) => {
    if (!player) return;

    this.player = player;
    player.addEventListener('play', () => {
      this.setState({ playing: true, ended: false })
    });
    player.addEventListener('pause', () => {
      this.setState({ playing: false })
    });
    player.addEventListener('ended', () => {
      this.setState({ playing: false, ended: true })
    });
    player.addEventListener('timeupdate', () => {
      if (this.state.playing) {
        this.setState({ played: player.currentTime })
      }
    });

    navigator.mediaDevices && navigator.mediaDevices.getUserMedia({ audio: true, video:true })
    .then((stream: any) => {
      this.stream = stream;
      const mediaRecorder = new window.MediaRecorder(stream, { mimeType: 'video/webm;' });
      this.mediaRecorder = mediaRecorder;
      player.srcObject = stream;
      player.play();

      mediaRecorder.ondataavailable = (e: any) =>  {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      const readAsArrayBuffer = function(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onloadend = () => { resolve(reader.result); };
          reader.onerror = (e) => { reject(e); };
        });
      }

      mediaRecorder.addEventListener('stop', async () => {
        const decoder = new Decoder();
        const reader = new Reader();
        reader.drop_default_duration = false;

        const buffer = await readAsArrayBuffer(new Blob(this.recordedChunks))
        const elms = decoder.decode(buffer);
        elms.forEach((elm) => reader.read(elm));
        reader.stop();
        const metadataBuf = tools.makeMetadataSeekable(reader.metadatas, reader.duration, reader.cues);
        this.recordedChunks = [metadataBuf, buffer && buffer.slice(reader.metadataSize)];

        const url = URL.createObjectURL(new Blob(this.recordedChunks));
        player.src = url;
        this.setState({ url, recording: false })
      });
    });
  }

  render() {
    const {
      className,
    } = this.props;

    const {
      url,
      recording,
      playing,
      ended,
      duration,
      played,
    } = this.state;

    return (
      <div className={`video-capture ${className || ''}`}>
        <div className='video-preview main-ratio'>
          <div className='content'>
            <video className='player' ref={this.onReady}></video>
            {/* {recording && */}
              <div className={`record-mark ${recording? '': 'disable'}`}>
                <span className='title'>REC</span>
                <div className='mark'></div>
              </div>
            {/* } */}
            <div className='controls'>
              <div className={`icon ${recording? 'stop': 'start'}`} onClick={this.toggleRecord}></div>
              {!recording && url &&
                <Icon className='icon' name={ended? 'replay': playing? 'pause': 'play'} size={24} onClick={this.playPause} />
              }
              {recording || !url?
                <time className='duration' dateTime={`P${Math.round(duration)}S`}>
                  {formatTime(duration)}
                </time>
              :
                <time className='duration' dateTime={`P${Math.round(played)}S`}>
                  {formatTime(played)}
                </time>
              }
              <div className='separater'>/</div>
              {recording || !url?
                <time className='duration' dateTime={`P${Math.round(RecordLimitDuration)}S`}>
                  {formatTime(RecordLimitDuration)}
                </time>
              :
                <time className='duration' dateTime={`P${Math.round(duration)}S`}>
                  {formatTime(duration)}
                </time>
              }
              <div className='actions'>
                <div className={`apply ${url? '': 'disable'}`} onClick={this.onApply}>
                  <span>Apply</span>
                </div>
                <div className='cancel' onClick={this.onCancel}>
                  <span>Cancel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };
};
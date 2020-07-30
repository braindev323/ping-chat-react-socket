/* @flow */

import * as React from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

import Duration from './duration';
import './../../styles/chat.scss';
import './../../styles/range.scss';
import Icon from './../../../../components/icon';

const SEEK_STEP = 10; // in seconds

type Props = {
  url: string,
  // renderHeader: () => React.Node,
  // renderFooter: () => React.Node,
  onReady?: () => any,
  onDuration?: (duration: number) => any,
  onError?: (e: any) => any,
  onChangeState?: (playing: boolean) => any,
};

type State = {
  url: string,
  pip: boolean,
  playing: boolean,
  loading: boolean,
  controls: boolean,
  light: boolean,
  volume: number,
  muted: boolean,
  slider_active: boolean,
  played: number,
  loaded: number,
  duration: number,
  playbackRate: number,
  loop: boolean,
  seeking: boolean,
  end: boolean,
  focused: boolean,
  isFullScreen: boolean
};

class VideoPlayer extends React.Component<Props, State> {
  state: State = {
    url: '',
    pip: false,
    playing: false,
    loading: false,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    slider_active: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
    end: false,
    focused: false,
    isFullScreen: false,
  };

  player: ReactPlayer = null;

  wrapper: ?HTMLDivElement;

  focusTimer: ?TimeoutID;
  loopInterval = null;
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.url !== state.url) {
      return {
        url: props.url,
        loading: true,
        played: 0,
        loaded: 0,
        pip: false,
      }
    } else {
      return null;
    }
  }

  componentDidMount() {
    if (screenfull.enabled) {
      screenfull.on('change', event => {
        this.setState({ isFullScreen: screenfull.isFullscreen })
      });
    }
    window.addEventListener('scroll', this.onWindowScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onWindowScroll);
    if (this.loopInterval)
      clearInterval(this.loopInterval);
  }


  playPause = () => {
    if (!this.loopInterval)
      this.progressLoop();
    if (!this.state.loading)
      this.setState({ playing: !this.state.playing }, () => this.state.playing ? this.player.play() : this.player.pause())
  }
  stop = () => {
    this.setState({ played: 0, playing: false })
  }
  replay = () => {
    this.progressLoop();
    this.player.play();
    this.setState({ playing: true, end: false });
  }
  // toggleControls = () => {
  //     const url = this.state.url
  //     this.setState({
  //     controls: !this.state.controls,
  //     url: null
  //     }, () => this.load(url))
  // }
  // toggleLight = () => {
  //     this.setState({ light: !this.state.light })
  // }
  // toggleLoop = () => {
  //     this.setState({ loop: !this.state.loop })
  // }
  setVolume = (e: any) => {
    this.setState({ muted: e.target.value === 0, volume: parseFloat(e.target.value) })
  }
  toggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }
  // setPlaybackRate = e => {
  //     this.setState({ playbackRate: parseFloat(e.target.value) })
  // }
  // togglePIP = () => {
  //     this.setState({ pip: !this.state.pip })
  // }
  toggleFullscreen = () => {
    if (screenfull.enabled) {
      // screenfull.toggle(findDOMNode(this))
    }
  }

  // reset timer for auto hiding controls
  resetFocusTimer = () => {
    clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => {
      this.setState({ focused: false });
    }, 3000);
  }

  onReady = () => {
    const { onReady } = this.props;
    this.setState({
      loading: false,
    })
    if (onReady) {
      onReady();
    }
  }
  onError = (e: any) => {
    const { onError } = this.props;

    console.log('Error on video playing: ', e)
    if (onError) {
      onError(e);
    }
  }
  onPlay = () => {
    this.setState({ playing: true });
    this.player.play();
    if (this.props.onChangeState) {
      this.props.onChangeState(true)
    }
  }
  onPause = () => {
    this.setState({ playing: false });
    this.player.pause();
    if (this.props.onChangeState) {
      this.props.onChangeState(false)
    }
  }

  onWindowScroll = (e: any) => {
    const docViewTop = 80;
    const docViewBottom = window.innerHeight;

    if (this.wrapper) {
      const wrapperElement = this.wrapper;
      const elemTop = wrapperElement.getBoundingClientRect().top;
      const elemBottom = elemTop + wrapperElement.offsetHeight;

      if ((elemBottom > docViewBottom) || (elemTop < docViewTop)) {
        if (this.state.playing) {
          this.setState({ playing: false });
          if (this.props.onChangeState) {
            this.props.onChangeState(false)
          }
        }
      }
    }
  }
  onSeekForward = (e: any) => {
    let newSeekValue = this.state.played + SEEK_STEP / this.state.duration;
    newSeekValue = newSeekValue > 1 ? 0.9999 : newSeekValue;
    this.setState({ played: this.state.played + SEEK_STEP / this.state.duration });
    this.player.currentTime = newSeekValue;
    this.resetFocusTimer();
  }
  onSeekRewind = (e: any) => {
    let newSeekValue = this.state.played - SEEK_STEP / this.state.duration;
    newSeekValue = newSeekValue < 0 ? 0 : newSeekValue;
    this.setState({ played: this.state.played - SEEK_STEP / this.state.duration });
    this.player.currentTime = newSeekValue;
  }
  onSeekMouseDown = (e: any) => {
    this.setState({ seeking: true })
  }
  onSeekChange = (e: any) => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp = (e: any) => {
    this.setState({ seeking: false })
    this.player.currentTime = parseFloat(e.target.value)
  }
  onProgress = (state: any) => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onEnded = () => {
    if (this.loopInterval)
      clearInterval(this.loopInterval);
    this.setState({
      playing: this.state.loop,
      end: !this.state.loop
    })
    if (this.props.onChangeState) {
      this.props.onChangeState(this.state.loop)
    }
  }
  onDuration = (duration: number) => {
    duration = this.player.duration
    const { onDuration } = this.props;

    if (duration === Infinity) {
      const timer = setInterval(() => {
        const duration = this.player.getDuration();
        if (duration !== Infinity) {
          clearInterval(timer);

          this.setState({ duration })
          if (onDuration) {
            onDuration(duration);
          }
        }
      }, 500)
      return;
    }

    this.setState({ duration })
    if (onDuration) {
      onDuration(duration);
    }
  }

  setWrapper = (wrapper: ?HTMLDivElement) => {
    this.wrapper = wrapper
    this.player = wrapper
  }

  setPlayer = (player: ReactPlayer) => {
    this.player = player
  }

  renderCenterControls = () => {
    return (
      <div className='controls' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', zIndex: 10 }} onClick={e => { e.stopPropagation(); }}>
        {/* <Icon className='icon' name='rewind' size={40} onClick={() => this.onSeekRewind()}></Icon> */}
        {this.state.end ?
          <Icon className='icon' name='replay' size={40} onClick={() => this.replay()} style={{ margin: '0 10px' }}></Icon>
          :
          <Icon className='icon' name={this.state.playing ? 'pause' : 'play'} size={40} onClick={() => this.playPause()} style={{ margin: '0 10px' }}></Icon>
        }
        {/* <Icon className='icon' name='forward' size={40} onClick={() => this.onSeekForward()}></Icon> */}
      </div>
    )
  }

  renderSeekbar = () => {
    const { played, loaded, muted, volume, slider_active, playing, duration, isFullScreen } = this.state
    return (
      <div className={`tools ${slider_active ? 'volume-slider-active' : ''}`} onClick={e => { e.stopPropagation(); }}>
        {/* <Icon className='icon' name={playing ? 'pause' : 'play'} size={24} onClick={() => this.playPause()} style={{ margin: '0 5px 0 0' }}></Icon>
        <div onMouseEnter={() => this.setState({ slider_active: true })} onMouseLeave={() => this.setState({ slider_active: false })} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '0 5px' }}>
          <Icon className='icon' name={muted ? 'sound_off' : 'sound_on'} size={24} onClick={() => this.toggleMuted()}></Icon>
          <div className='volume_control' style={{ flex: 1, alignItems: 'center', margin: '0 0 0 5px' }}>
            <progress className='volumebar' min={0} max={1} value={muted ? 0 : volume} />
            <input type='range' min={0} max={1} step='any' value={muted ? 0 : volume} onChange={this.setVolume}></input>
          </div>
        </div> */}
        <div className='duration' style={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <Duration className='duration' seconds={duration * (1 - played)} />
          <div className={this.props.progressClass} style={{ position: 'relative', margin: '6px 0', flex: 1, height: 6 }}>
            <progress className='loadingbar' min={0} max={1} value={loaded} />
            <progress className='playingbar' min={0} max={1} value={played} />
            <input
              type='range' min={0} max={1} step='any' value={played}
              onMouseDown={this.onSeekMouseDown}
              onMouseUp={this.onSeekMouseUp}
              onTouchStart={this.onSeekMouseDown}
              onTouchEnd={this.onSeekMouseUp}
              onChange={this.onSeekChange}
            />
          </div>
          {/* <Duration className='duration' seconds={duration - played} /> */}
        </div>
        {/* <Icon className='icon' name={isFullScreen ? 'fullscreen_off' : 'fullscreen_on'} size={24} onClick={() => this.toggleFullscreen()}></Icon> */}
      </div>
    )
  }
  progressLoop() {
    var thisScope = this;
    this.loopInterval = setInterval(function () {
      if (!thisScope.state.loading)
        thisScope.setState({ played: (thisScope.player.currentTime / thisScope.player.duration), loaded: thisScope.player.buffered.end(0) / thisScope.player.duration })
    });
  }
  render() {
    const { url, playing, controls, light, volume, muted, loop, playbackRate, pip, focused } = this.state
    // const {
    //   renderHeader,
    //   renderFooter,
    // } = this.props;
    const { className } = this.props;
    return (
      <>
        <video src={url}
          onCanPlay={this.onReady}
          className={className}
          ref={this.setWrapper}
          onClick={e => { e.stopPropagation(); }}
          onEnded={this.onEnded}
          onDurationChange={this.onDuration}
        >
          {/* <ReactPlayer           
                pip={pip}
          
          controls={controls}
          light={light}
          loop={loop}
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          onReady={this.onReady}
          onStart={() => console.log('onStart')}
          onPlay={this.onPlay}
          onPause={this.onPause}
          onEnablePIP={() => this.setState({ pip: true })}
          onDisablePIP={() => this.setState({ pip: false })}
          // onBuffer={() => console.log('onBuffer')}
          // onSeek={e => console.log('onSeek', e)}         
          onError={this.onError}
          onProgress={this.onProgress}         
        /> */}

        </video>
        <div className='ping-player-wrapper' onMouseMove={() => this.setState({ focused: true })} onMouseLeave={() => this.setState({ focused: false })}>
          <div className='mask' onClick={() => this.playPause()}>
            {this.state.loading ?
              <div style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div className='spinner-border' role='status'></div>
              </div>
              : (focused || !playing) && this.renderCenterControls()}
          </div>
          {/*!playing && renderHeader()*/}
          {/* {!playing && renderFooter()} */}
          {url && this.renderSeekbar()}
        </div>
      </>
    )
  }
}

export default VideoPlayer;
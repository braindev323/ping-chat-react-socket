/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Mutation, Query } from 'react-apollo';
import _ from 'lodash';
import GoogleMap from 'google-map-react';

import Icon from '../icon';
import Spinner from '../../components/spinner';
import Dropdown from '../../components/dropdown';
import ImageImporter from './imageImporter';
import VideoImporter from './videoImporter';
import VideoCapture from './videoCapture';
import VideoPlayer from '../videoPlayer';
import config from '../../config';
import {
  qSearchGammatag,
} from '../../graphql/query';
import {
  mAddGammatag,
  mUpload,
  mPost,
} from '../../graphql/mutation';
import {
  addNotification,
} from '../../redux/actions';
import {
  isURL,
} from '../../utils.js';
import {
  PostType,
} from '../../constants';
import './index.scss';


const MediaType = {
  Video: 0,
  Photo: 1,
}

const SourceType = {
  LocalFile: 0,
  URL: 1,
}

const IMAGE_LIMIT = 4;
const VIDEO_LIMIT_DURATION = 300;
const GAMMATAG_LIMIT = 5;

type State = {
  isLoggedin: boolean,
  me: ?any,

  title: string,
  description: string,
  type: number,
  original_url: string,
  category_id: number,
  gammatags: Array<string>,
  images: Array<any>,
  videos: Array<any>,
  location: any,
  link: string,

  showImageImporter: boolean,
  showVideoImporter: boolean,
  showVideoCapture: boolean,
  videoDurationLimited: boolean,
  gammatag: string,
  newGammatag: string,
  active_menu: number,
  selectedImage: number,
  uploading: boolean,
};

class Composer extends React.Component<any, State> {
  defaultState: any = {
    title: '',
    description: '',
    type: PostType.Unknown,
    original_url: '',
    category_id: -1,
    gammatags: [],
    images: [],
    videos: [],
    location: null,
    link: '',

    showImageImporter: false,
    showVideoImporter: false,
    showVideoCapture: false,
    videoDurationLimited: false,
    gammatag: '',
    newGammatag: '',
    active_menu: -1,
    selectedImage: 0,
    uploading: false,
  }

  state: State = {
    isLoggedin: false,
    me: null,

    ...this.props.defaultValues ? this.props.defaultValues : this.defaultState,
  }

  hasCameraDevice: boolean = false;

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  isMenuAvailable(menuIndex: number) {
    const { type, images, showVideoCapture } = this.state;

    if (type === PostType.Unknown) {
      return !showVideoCapture;
    } else if (type === menuIndex) {
      if (type === PostType.Photo && images.length < IMAGE_LIMIT)
        return true;
    }
    
    return false;
  }

  showMenu = (menuIndex: number) => {
    if (this.isMenuAvailable(menuIndex)) {
      this.setState({ active_menu: menuIndex });
    }
  }

  closeMenu = () => {
    this.setState({ active_menu: -1 });
  }

  onFileInputChange = ( event: any, type: number, mutation: any ) => {
    const {
      target: {
        validity,
        files: [file],
      }
    } = event;
    
    if (validity.valid) {
      const {
        videos,
        images,
      } = this.state;

      switch (type) {
      case MediaType.Video:
        this.setState({
          type: PostType.Video,
          videos: _.concat(videos, {
            source: SourceType.LocalFile,
            file,
            url: URL.createObjectURL(file),
            mutation,
          }),
          showImageImporter: false,
          showVideoImporter: false,
          showVideoCapture: false,
        });
        break
      case MediaType.Photo:
        this.setState({
          type: PostType.Photo,
          images: _.concat(images, {
            source: SourceType.LocalFile,
            file,
            url: URL.createObjectURL(file),
            mutation,
          }),
          showImageImporter: false,
          showVideoImporter: false,
          showVideoCapture: false,
        });
        break
      default:
        break
      }
    }

    this.closeMenu();
  };

  showAttachImage = () => {
    this.setState({ showImageImporter: true });
    this.closeMenu();
  }

  onAttachImage = (url: string) => {
    const {
      images,
    } = this.state;

    this.setState({
      type: PostType.Photo,
      images: _.concat(images, {
        source: SourceType.URL,
        url,
      }),
      showImageImporter: false,
    });
  }

  cancelImage = (index: number) => {
    let { images, selectedImage } = this.state;
    _.pullAt(images, index);

    this.setState({
      type: images.length > 0? PostType.Photo: PostType.Unknown,
      images,
      selectedImage: selectedImage > images.length - 1? images.length - 1: selectedImage,
    });
  }

  showAttachVideo = () => {
    this.setState({ showVideoImporter: true });
    this.closeMenu();
  }

  onAttachVideo = (url: string) => {
    const {
      videos,
    } = this.state;

    this.setState({
      type: PostType.Photo,
      videos: _.concat(videos, {
        source: SourceType.URL,
        url,
      }),
      showVideoImporter: false,
    });
  }

  async detectCameraDevices() {
    const mediaDevices = navigator.mediaDevices;
    if (mediaDevices) {
      const devices = await mediaDevices.enumerateDevices();
      const cameraDevices = _.filter(devices, { 'kind': 'videoinput' });
      this.hasCameraDevice = cameraDevices.length > 0;
    }
  }

  showCaptureVideo = async () => {
    const browserSupportCaptureVideo = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    if (browserSupportCaptureVideo) {
      await this.detectCameraDevices();
      if (this.hasCameraDevice) {
        const cameraPermission = await navigator.permissions.query({name:'camera'});
        if (cameraPermission.state === 'granted' || cameraPermission.state === 'prompt') {
          this.setState({ showVideoCapture: true });
        } else if (cameraPermission.state === 'denied') {
          this.props.addNotification('warn', 'Please allow camera permission to capture video.');
        }

        cameraPermission.onchange = async () => {
          const newPermission = await navigator.permissions.query({name:'camera'});
          if (newPermission.state === 'denied') {
            this.props.addNotification('warn', 'Please allow camera permission to capture video.');
            this.setState({ showVideoCapture: false });
          }
        };
      } else {
        this.props.addNotification('danger', 'Please connect webcamera to capture video');
      }
    } else {
      this.props.addNotification('danger', 'This browser doesn\'t support video capture');
    }

    this.closeMenu();
  }

  addVideo (url: string, file: File, mutation: any) {
    const {
      videos,
    } = this.state;

    this.setState({
      type: PostType.Video,
      videos: _.concat(videos, {
        source: SourceType.LocalFile,
        file,
        url,
        mutation,
      }),
      showImageImporter: false,
      showVideoImporter: false,
      showVideoCapture: false,
    });
  }

  onVideoDuration = (duration: number) => {
    const { videos } = this.state;
    if (videos[0].source === SourceType.LocalFile) {
      this.setState({
        videoDurationLimited: duration > VIDEO_LIMIT_DURATION,
      })
    }
  }

  cancelVideo = () => {
    this.setState({
      type: PostType.Unknown,
      videos: [],
      videoDurationLimited: false,
    });
  }

  addGammatag = (tag) => {
    let { gammatags } = this.state;
    if (!gammatags.includes(tag) && gammatags.length < GAMMATAG_LIMIT) {
      gammatags.push(tag);
    }

    this.setState({
      gammatags,
      gammatag: '',
      newGammatag: '',
    });
  }

  insertGammatag = async (mutation: any ) => {
    const { newGammatag } = this.state;
    if (newGammatag && newGammatag.length > 0) {
      try {
        await mutation({
          variables: { name: newGammatag },
        });
      } catch (err) {
        console.log(`Error on adding gammatag: ${newGammatag}`, err);
      }

      this.addGammatag(newGammatag);
    }
  }

  cancelGammatag = (gammatag) => {
    let { gammatags } = this.state;
    const index = gammatags.indexOf(gammatag);
    if (index > -1) gammatags.splice(index, 1);

    this.setState({
      gammatags,
    });
  }

  validateInput() {
    const {
      title,
      description,
      // type,
      original_url,
      category_id,
      // gammatags,
      // images,
      // videos,
      // location,
      // link,

      videoDurationLimited,
    } = this.state;

    let isValid = true;
    const errors = [];

    if (!title || title.length < 3 || title.length > 256) {
      isValid = false;
      errors.push('Title should be longer than 3 characters');
    }

    if (description && description.length > 256) {
      isValid = false;
      errors.push('Description should be shorter than 256 characters');
    }

    if (category_id < 0) {
      isValid = false;
      errors.push('Category is required');
    }

    if (!!original_url && !isURL(original_url)) {
      isValid = false;
      errors.push('Citation url is invalid');
    }

    if (videoDurationLimited) {
      isValid = false;
      errors.push('Cannot upload video file which is longer than 5 minutes');
    }

    if (errors.length > 0) {
      this.props.addNotification('danger', errors.join('\n'));
    }
    return isValid;
  }

  resetState() {
    this.setState({
      ...this.defaultState,
    });
  }

  issuePost = async (mutation: any) => {
    if (!this.validateInput()) {
      return;
    }

    this.setState({
      uploading: true,
    })

    const {
      me,

      title,
      description,
      type,
      original_url,
      category_id,
      gammatags,
      images,
      videos,
      location,
      link,
    } = this.state;

    try {
      switch(type) {
      case PostType.Photo:
        for (let i=0; i<images.length; i++) {
          if (images[i].source === SourceType.LocalFile) {
            const { data: { upload } } = await images[i].mutation({
              variables: { file: images[i].file },
              fetchPolicy: 'no-cache',
            });
            images[i].url = upload.url;
          }
        }
        break;
      case PostType.Video:
        for (let i=0; i<videos.length; i++) {
          if (videos[i].source === SourceType.LocalFile) {
            const { data: { upload } } = await videos[i].mutation({
              variables: { file: videos[i].file },
              fetchPolicy: 'no-cache',
            });
            videos[i].url = upload.url;
            videos[i].thumb_url = upload.thumbUrl;
          }
        }
        break;
      default:
        break;
      }

      const newPost = {
        title,
        description,
        type: type === PostType.Unknown? PostType.Article: type,
        original_url,
        original_post_date: new Date(),
        category_id,
        gammatags,
        images: _.map(images, 'url'),
        videos: _.map(videos, video => _.pick(video, ['url', 'thumb_url'])),
        location,
        link,
      };

      const { data: { userPost } } = await mutation({
        variables: newPost,
        fetchPolicy: 'no-cache',
      });
      if(userPost) {
        this.props.addNotification('success', 'Successfully issued');
        if (this.props.onIssue) {
          this.props.onIssue({
            id: userPost,
            ...newPost,
            category: _.find(this.props.categories, { id: newPost.category_id }),
            author: me,
            gammatags: newPost.gammatags.join(','),
            media: {
              images: newPost.images,
              videos: newPost.videos,
            },
            rate: {
              like: 0,
              dislike: 0,
              status: 0,
            },
            reply: {
              count: 0,
              status: 0,
            },
            bookmark: 0,
          })
        }
        this.resetState();
      } else {
        this.props.addNotification('danger', 'Failed to issue \nTry again later');
        this.setState({
          uploading: false,
        })
      }
    } catch (error) {
      console.log('Error on post: ', error)
      this.props.addNotification('danger', 'Failed to issue \nTry again later');
      this.setState({
        uploading: false,
      })
    }
  }

  render() {
    const {
      title,
      description,
      original_url,
      category_id,
      gammatags,
      images,
      videos,
      location,
      // link,
      gammatag,
      newGammatag,
      showImageImporter,
      showVideoImporter,
      showVideoCapture,
      videoDurationLimited,
      active_menu,
      selectedImage,
      uploading,
    } = this.state;

    return (
      <div className='composer'>
        <div className='main'>
          <input
            className='title'
            type='text'
            name='title'
            placeholder='Memo Title...'
            value={title}
            onChange={(e) => this.setState({ title: e.target.value })} />
          <div className='category'>
            <Dropdown
              items={this.props.categories}
              renderItem={category => (
                <span>{category? category.name: ''}</span>
              )}
              selectedItem={_.find(this.props.categories, {'id': category_id})}
              onChange={category => this.setState({category_id: category.id})}/>
          </div>
        </div>
        <textarea
          className='description'
          name='description'
          rows={5}
          placeholder='Memo...'
          value={description}
          onChange={(e) => this.setState({ description: e.target.value })} />
        
        {showImageImporter &&
          <ImageImporter onApply={this.onAttachImage} />
        }

        {showVideoImporter &&
          <VideoImporter onApply={this.onAttachVideo} />
        }

        {showVideoCapture &&
          <Mutation mutation={mUpload} fetchPolicy='no-cache'>
            { (uploadMutation, { loading }) => (
              <VideoCapture onApply={(url, file) => this.addVideo(url, file, uploadMutation)} onCancel={() => this.setState({ showVideoCapture: false })} />
            ) }
          </Mutation>
        }

        {images.length > 0 &&
          <div className='image-preview'>
            {images.length === 1?
              <div className='image-wrapper main-ratio'>
                <img className='content' src={images[0].url} alt='To upload' />
                <div className='cancel' onClick={(e:any) => {e.stopPropagation(); this.cancelImage(0)}}>
                  <Icon className='icon' name='close' size={20} />
                </div>
              </div>
            :
              <div className='main-ratio'>
                <div className='content'>
                  <div className='background' style={{backgroundImage: `url(${images[selectedImage].url})`}}></div>
                  <div className='wrapper'>
                    <div className='preview'>
                      <div className='image-wrapper main-ratio'>
                        <img className='content' src={images[selectedImage].url} alt='Preview' />
                      </div>
                    </div>
                    <div className='thumbnail-list'>
                      {images.map((image, index) => (
                        <div key={index} className='thumbnail'>
                          <div key={index} className={`image-wrapper main-ratio ${selectedImage === index? 'active': ''}`} onClick={() => this.setState({selectedImage: index})}>
                            <img className='content' src={images[index].url} alt='thumbnail' />
                            <div className='cancel' onClick={(e:any) => {e.stopPropagation(); this.cancelImage(index)}} >
                              <Icon className='icon' name='close' size={20} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
        {videos.length > 0 &&
          <div className='video-preview'>
            <div className='video-wrapper main-ratio'>
              <VideoPlayer url={videos[0].url} onDuration={this.onVideoDuration} />
              {videoDurationLimited &&
                <div className='video-notify'>
                  {'Video duration should be shorter than 5 minutes'}
                </div>
              }
              <div className='cancel' onClick={(e:any) => {e.stopPropagation(); this.cancelVideo()}}>
                <Icon className='icon' name='close' size={20} />
              </div>
            </div>
          </div>
        }
        {!!title &&
          <div className='additions'>
            <input
              className='item'
              type='text'
              name='original_url'
              placeholder='Enter Citation URL...'
              value={original_url}
              onChange={(e: any) => this.setState({ original_url: e.target.value })} />
            <div className='item tag-input'>
              <input
                className='input'
                type='text'
                placeholder='Enter γTag Title...'
                value={gammatag}
                onChange={(e: any) => this.setState({ gammatag: e.target.value })} />
              {gammatag &&
                <div className='auto-complete'>
                  <Query query={qSearchGammatag} variables={{ name: gammatag }}>
                    {({ loading, error, data }) => {
                      if (loading) return (<Spinner />)
                      if (error) return <div></div>

                      if (data.searchGammatag && data.searchGammatag.length > 0) {
                        return data.searchGammatag.map((gammatag, index) => (
                          <div key={index} className='list-item' onClick={() => this.addGammatag(gammatag.name)}>
                            <Icon className='gamma' name='gamma' size={16} />
                            <span className='name'>{gammatag.name}</span>
                          </div>
                        ))
                      } else {
                        return (
                          <div className='error'>
                            <span className='title'>{'Not found'}</span>
                          </div>
                        )
                      }
                    }}
                  </Query>
                </div>
              }
            </div>
            <Mutation mutation={mAddGammatag}>
              {(addGammatagMutation, { loading }) => (
                <div className='item add-tag'>
                  <input
                    className='input'
                    type='text'
                    placeholder='Add γ Tag...'
                    maxLength={20}
                    value={newGammatag}
                    onChange={(e: any) => this.setState({ newGammatag: e.target.value.toLowerCase() })} />
                  {!!newGammatag &&
                    <div className='apply' onClick={() => this.insertGammatag(addGammatagMutation)}>
                      <span>add</span>
                    </div>
                  }
                </div>
              )}
            </Mutation>
          </div>
        }
        {gammatags.length > 0 &&
          <div className='gammatags'>
            {gammatags.map((gammatag, index) => (
              <div key={index} className='gammatag'>
                <Icon className='gamma' name='gamma' size={16} />
                <span className='tag-name'>{gammatag}</span>
                <div className='cancel' onClick={(e:any) => {e.stopPropagation(); this.cancelGammatag(gammatag)}}>
                  <Icon className='icon' name='close' size={16} />
                </div>
              </div>
            ))}
          </div>
        }
        <div className='footer'>
          <div className='left'>
            <Icon
              name='play_fill'
              size={20}
              className={`icon ${this.isMenuAvailable(PostType.Video)? '': 'disable'}`}
              onClick={() => this.showMenu(PostType.Video)}/>
            <Icon
              name='photo'
              size={20}
              className={`icon ${this.isMenuAvailable(PostType.Photo)? '': 'disable'}`}
              onClick={() => this.showMenu(PostType.Photo)}/>
            <Icon
              name='vote'
              size={20}
              className={`icon ${this.isMenuAvailable(PostType.Poll)? '': 'disable'}`}
              onClick={() => this.showMenu(PostType.Poll)}/>
            <Icon
              name='location'
              size={20}
              className={`icon ${this.isMenuAvailable(PostType.Location)? '': 'disable'}`}
              onClick={() => this.showMenu(PostType.Location)}/>
            <Icon
              name='link'
              size={20}
              className={`icon ${this.isMenuAvailable(PostType.Link)? '': 'disable'}`}
              onClick={() => this.showMenu(PostType.Link)}/>
            <Mutation mutation={mUpload} fetchPolicy='no-cache'>
              { (uploadMutation, { loading }) => (
                <div className='inputs hidden'>
                  <input id='video_picker' type='file' accept='video/*' value='' onChange={event => this.onFileInputChange(event, MediaType.Video, uploadMutation)}></input>
                  <input id='image_picker' type='file' accept='image/*' value='' onChange={event => this.onFileInputChange(event, MediaType.Photo, uploadMutation)}></input>
                </div>
              ) }
            </Mutation>
          </div>
          <div className='right'>
            <span className='character-status'>{`${description.length} Characters`}</span>
            {!!title &&
              <Mutation mutation={mPost} fetchPolicy='no-cache'>
                { (postMutation, { loading }) => (
                  <div className='issue' onClick={() => this.issuePost(postMutation)}>
                    <span>{'Issue'}</span>
                    <Icon name='send' size={24} className={`icon`} />
                  </div>
                ) }
              </Mutation>
            }
          </div>
        </div>
        {active_menu > 0 &&
          <div className='menu-container'>
            <div className='mask' onClick={this.closeMenu}></div>
            {active_menu === PostType.Video &&
              <div className='menu video-menu'>
                <a className='menu-item' href='https://www.google.com/videohp' target='_blank' rel='noopener noreferrer'>
                  <div className='menu-icon'><div className='icon record'></div></div>
                  <div className='label blue'>Search Online</div>
                </a>
                <label className='menu-item' onClick={this.showCaptureVideo}>
                  <div className='menu-icon'><Icon className='icon' name='play_fill' size={20} /></div>
                  <div className='label'>Capture Video</div>
                </label>
                <label className='menu-item' htmlFor='video_picker'>
                  <div className='menu-icon'><Icon className='icon' name='upload' size={20} /></div>
                  <div className='label'>Upload from Computer</div>
                </label>
                <div className='menu-item' onClick={this.showAttachVideo}>
                  <div className='menu-icon'><Icon className='icon' name='link' size={20} /></div>
                  <div className='label'>Attach link</div>
                </div>
              </div>
            }
            {active_menu === PostType.Photo &&
              <div className='menu photo-menu'>
                <a className='menu-item' href='https://www.google.com/imghp' target='_blank' rel='noopener noreferrer'>
                  <div className='menu-icon'><Icon className='icon' name='globe' size={20} /></div>
                  <div className='label blue'>Search Online</div>
                </a>
                <label className='menu-item' htmlFor='image_picker'>
                  <div className='menu-icon'><Icon className='icon' name='upload' size={20} /></div>
                  <div className='label'>Upload from Computer</div>
                </label>
                <div className='menu-item' onClick={this.showAttachImage}>
                  <div className='menu-icon'><Icon className='icon' name='link' size={20} /></div>
                  <div className='label'>Attach link</div>
                </div>
              </div>
            }
            {active_menu === PostType.Poll &&
              <div className='menu poll-menu'>
                <div className='menu-item'>
                  <div className='menu-icon'><Icon className='icon' name='document_outline' size={20} /></div>
                  <div className='label'>Create Multi Choice Poll</div>
                </div>
                <div className='menu-item'>
                  <div className='menu-icon'><Icon className='icon' name='vote' size={20} /></div>
                  <div className='label'>Create Strawpoll</div>
                </div>
              </div>
            }
            {active_menu === PostType.Location &&
              <div className='menu map-menu'>
                <div className='header'>
                  <div className='location'>
                    <Icon className='icon' name='location' size={20} />
                    <input
                      className='address'
                      type='text'
                      name='location'
                      placeholder='Location...'
                      value={(location && location.address) || ''}
                      readOnly />
                  </div>
                  <Icon className='icon apply' name='checkbox_circle_fill' size={20} />
                </div>
                <div className='map_area'>
                  <GoogleMap
                    bootstrapURLKeys={{ key: config.google_api_key}}
                    center={[0, 0]} 
                    yesIWantToUseGoogleMapApiInternals 
                    zoom={0.4} >
                  </GoogleMap>
                </div>
              </div>
            }
            {active_menu === PostType.Link &&
              <div className='menu link-menu'>
                <a className='menu-item' href='https://news.google.com/' target='_blank' rel='noopener noreferrer'>
                  <div className='menu-icon'><Icon className='icon' name='globe' size={20} /></div>
                  <div className='label blue'>Search Online</div>
                </a>
                <div className='menu-item'>
                  <div className='menu-icon'><Icon className='icon' name='link' size={20} /></div>
                  <div className='label'>Attach link</div>
                </div>
              </div>
            }
          </div>
        }
        {uploading &&
          <div className='uploading'>
            <div className='mask' onClick={this.closeMenu}>
              <Spinner size='large' />
            </div>
          </div>
        }
      </div>
    )
  };
};

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
    categories: state.common.categories,
  }
}

export default connect(mapStateToProps, { addNotification })(Composer)
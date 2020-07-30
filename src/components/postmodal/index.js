/* @flow */

import React from 'react';
import { connect } from 'react-redux';


import ProfileModal from './profile';
import ShareModal from './share';
import ActionModal from './action';
import ContentOptions from './contentOptions';
import {
  closePostModal,
} from '../../redux/actions';
import {
  PostModalType,
} from '../../constants';
import './index.scss';


type State = {
  isOpen: boolean,
  post: any,
  modalType: number,
  target: ?HTMLDivElement,
};

class PostModal extends React.Component<any, State> {
  state: State = {
    isOpen: false,
    post: null,
    modalType: 0,
    target: null,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isOpen: props.isOpen,
      post: props.post,
      modalType: props.modalType,
      target: props.target,
    }
  }

  close = () => {
    this.props.closePostModal();
  }

  render() {
    const {
      isOpen,
      post,
      modalType,
      target,
    } = this.state;

    let fixedStyle = {};
    let needDownStyle = false;

    if (target) {
      const top = target.getBoundingClientRect().top;
      const left = target.getBoundingClientRect().left;
      const width = target.offsetWidth;
      const height = target.offsetHeight;
      fixedStyle = {
        top, left, width, height,
      }

      if (modalType === PostModalType.Profile && top < 200) {
        needDownStyle = true;
      }
      if (modalType === PostModalType.Share && top < 140) {
        needDownStyle = true;
      }
    }

    return (
      <div className={`post-modal ${isOpen? 'show': ''}`}>
        <div className='modal-outter' onClick={this.close}></div>
        <div className='content'>
        {isOpen &&
          <div className='wrapper'>
            <div className='target' style={fixedStyle}>
              <div className='container'>
                {modalType === PostModalType.Profile &&
                  <ProfileModal post={post} downside={needDownStyle} />
                }
                {modalType === PostModalType.Share &&
                  <ShareModal post={post} downside={needDownStyle} />
                }
                {modalType === PostModalType.More &&
                  <ActionModal post={post} />
                }
                {modalType === PostModalType.ContentOptions &&
                  <ContentOptions post={post} />
                }
              </div>
            </div>
          </div>
        }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.postmodal.isOpen,
    post: state.postmodal.post,
    modalType: state.postmodal.modalType,
    target: state.postmodal.target,
  }
}

export default connect(mapStateToProps, { closePostModal })(PostModal);
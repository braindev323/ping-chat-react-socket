/* @flow */

import React from 'react';
import { connect } from 'react-redux';
// import { Mutation } from 'react-apollo';
import { /* Link, */withRouter } from 'react-router-dom';

import Icon from '../../icon';
// import Checkbox from '../../form/checkbox';
import Toggle from '../../form/toggle';
// import {
//   mBlockUser,
//   mReportPost,
// } from '../../../graphql/mutation';
import {
  toggleAuthModal,
  closePostModal,
  blockUser,
} from '../../../redux/actions';
import './index.scss';


const ReportType = {
  HateCrime: 0,
  ChildEndangerment: 1,
  CopyrightClaim: 2,
  PromoteViolence: 3,
  Other: 4,
}

type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  level: number,
  reading: number,
}

type Channel = {
  id: number,
  name: string,
  username: string,
  logo: string,
  cover_image?: string,
  reading: number,
}

type Post = {
  id: number,
  author: ?User,
  channel: ?Channel,
  report: number,
}

type State = {
  isLoggedin: boolean,
  me: ?User,
  openReportMenu: boolean,
  reportReasonType: number,
  otherReason: string,
  checkValidation: boolean,
  setNotification: boolean
};

class ActionModal extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    openReportMenu: false,
    reportReasonType: -1,
    otherReason: '',
    checkValidation: false,
    setNotification: false,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  handleReasonInput = (e) => {
    const value = e.target.value;

    this.setState({
      otherReason: value,
    })
  }

  validateReportForm = () => {
    this.setState({
      checkValidation: true,
    });
    const {
      reportReasonType,
      otherReason,
    } = this.state;

    const isVaildForm = reportReasonType > -1 && (reportReasonType !== ReportType.Other || !!otherReason);
    return isVaildForm;
  }

  render() {
    const post: Post = this.props.post;

    const {
      author,
      channel,
    } = post;

    const {
      isLoggedin,
      me,
      setNotification
    } = this.state;


    if ((!author && !channel) || (author && channel)) {
      return null;
    }

    const checkUserIsPost = isLoggedin && author && me && author.id === me.id;

    return (
      <div className={`action-modal`}>
        <div className='wrapper'>
          {
            checkUserIsPost &&
            <div className='item' onClick={() => {
                this.props.closePostModal();
                this.props.history.push(`/post/:postId/edit`);
                }}>
              <Icon className='icon' name='edit' size={24} />
              <span className='label'>Edit Post</span>
            </div>
          }
          {checkUserIsPost &&
            <div className='item'>
              <div className="mr-4">
                <Icon className='icon' name='bell' size={24} />
                <span className='label'>Notification For Post</span>
              </div>
              <div className="d-flex">
                <span className='label mr-1'>{setNotification ? 'ON' : 'OFF'}</span>
                <Toggle value={setNotification} onChange={value => this.setState({ setNotification: value })} />
              </div>
            </div>
          }
          {checkUserIsPost &&
            <div className='item'>
              <Icon className='icon' name='delete' size={24} />
              <span className='label'>Delete Post</span>
            </div>
          }
          {/* {author &&
            <Mutation mutation={mBlockUser}>
              {(blockUserMutation, { data }) => (
                <div className='item' onClick={() => {
                  if (!isLoggedin || !me) {
                    this.props.toggleAuthModal(true);
                    return;
                  }

                  blockUserMutation({
                    variables: {
                      block_id: author.id,
                    }
                  }).then(res => {
                    this.props.blockUser(author);
                    this.props.closePostModal();
                  }).catch(err => {
                  });
                }}>
                  <Icon className='icon' name='block' size={24} />
                  <span className='label'>Block User</span>
                </div>
              )}
            </Mutation>
          } */}

        </div>
      </div>
    )
  };
};

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, { toggleAuthModal, closePostModal, blockUser })(withRouter(ActionModal))
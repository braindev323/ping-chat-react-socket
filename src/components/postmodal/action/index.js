/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';

import Icon from '../../icon';
import Checkbox from '../../form/checkbox';
import {
  mBlockUser,
  mReportPost,
} from '../../../graphql/mutation';
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

const ReportReasons = [
  'Hate Crime',
  'Child Endangerment',
  'Copyright Claim',
  'Promote Violence',
]


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
};

class ActionModal extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    openReportMenu: false,
    reportReasonType: -1,
    otherReason: '',
    checkValidation: false,
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
      openReportMenu,
      reportReasonType,
      otherReason,
      checkValidation,
    } = this.state;

    if ((!author && !channel) || (author && channel)) {
      return null;
    }

    return (
      <div className={`action-modal`}>
        <div className='wrapper'>
          {/* {channel &&
          } */}
          {author &&
            <div className='item'>
              <Icon className='icon' name='mike_off' size={24} />
              <span className='label'>Mute User</span>
            </div>
          }
          {author &&
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
          }
          <div className='item'>
            <Icon className='icon' name='link_copy' size={24} />
            <span className='label'>Copy Memo Link</span>
          </div>
          <div className='item'>
            <Icon className='icon' name='embed' size={24} />
            <span className='label'>Embed Memo</span>
          </div>
          <div className='item' onClick={() => this.setState({openReportMenu: !this.state.openReportMenu})}>
            <Icon className='icon' name='report' size={24} />
            <span className='label'>Report Memo</span>
            <Icon className='icon arrow' name={openReportMenu? 'arrow_up': 'arrow_down'} size={24} />
          </div>
          {openReportMenu &&
            <Mutation mutation={mReportPost}>
              {(reportPostMutation, { data }) => (
                <div className='report-form'>
                  <Checkbox
                    id='hate_crime'
                    className='report-option'
                    label='Hate Crime'
                    value={reportReasonType === ReportType.HateCrime}
                    onChange={value => value && this.setState({reportReasonType: ReportType.HateCrime})} />
                  <Checkbox
                    id='child_endangerment'
                    className='report-option'
                    label='Child Endangerment'
                    value={reportReasonType === ReportType.ChildEndangerment}
                    onChange={value => value && this.setState({reportReasonType: ReportType.ChildEndangerment})} />
                  <Checkbox
                    id='copyright_claim'
                    className='report-option'
                    label='Copyright Claim'
                    value={reportReasonType === ReportType.CopyrightClaim}
                    onChange={value => value && this.setState({reportReasonType: ReportType.CopyrightClaim})} />
                  <Checkbox
                    id='promote_violence'
                    className='report-option'
                    label='Promote Violence'
                    value={reportReasonType === ReportType.PromoteViolence}
                    onChange={value => value && this.setState({reportReasonType: ReportType.PromoteViolence})} />
                  <Checkbox
                    id='other'
                    className='report-option'
                    label='Other'
                    value={reportReasonType === ReportType.Other}
                    onChange={value => value && this.setState({reportReasonType: ReportType.Other})} />
                  <div className='form-group'>
                    <input
                      id='other-reason'
                      name='reason'
                      type='text'
                      className={`form-control ${!checkValidation || reportReasonType !== ReportType.Other || !!otherReason? '': 'is-invalid'}`}
                      placeholder='Specify'
                      disabled={reportReasonType !== ReportType.Other}
                      maxLength={50}
                      value={reportReasonType === ReportType.Other? otherReason: ''}
                      onChange={this.handleReasonInput} />
                    <div className="invalid-feedback">{'Specified reason is required'}</div>
                  </div>
                  <button type='button' className='btn btn-main btn-report' onClick={() => {
                    if (!this.validateReportForm()) {
                      return;
                    }

                    if (!isLoggedin || !me) {
                      this.props.toggleAuthModal(true);
                      return;
                    }

                    const reason = reportReasonType !== ReportType.Other? ReportReasons[reportReasonType]: otherReason;
                    reportPostMutation({
                      variables: {
                        post_id: post.id,
                        reason,
                      }
                    }).then(res => {
                      post.report = 1;
                      this.props.closePostModal();
                    }).catch(err => {
                    });
                  }}
                  >REPORT</button>
                </div>
              )}
            </Mutation>
          }
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

export default connect(mapStateToProps, { toggleAuthModal, closePostModal, blockUser })(ActionModal)
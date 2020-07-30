/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import _ from 'lodash';

import Icon from '../../icon';
import {
  toggleAuthModal,
  openPostModal,
  addNotification,
} from '../../../redux/actions';
import {
  mRatePost,
} from '../../../graphql/mutation';
import {
  PostModalType,
} from '../../../constants';
import './index.scss';


type State = {
  isLoggedin: boolean,
  me: any,
  like: number,
};

class Tools extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    like: -1,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
      like: state.like === -1 ? _.get(props.post, "rate.status") : state.like,
    }
  }

  wrapper: ?HTMLDivElement = null;

  openShareModal = () => {
    this.props.openPostModal(this.props.post, PostModalType.Share, this.wrapper);
  }

  ratePost = async (newRate: number) => {
    const {
      client,
      post,
    } = this.props;

    if (!client) return;

    await client.mutate({
      mutation: mRatePost,
      variables: { post_id: post.id, rate: newRate },
      fetchPolicy: 'no-cache',
    })
  }

  toggleThumbup = async () => {
    const {
      isLoggedin,
      me,
      like,
    } = this.state;
    const { post } = this.props;

    if (!isLoggedin || !me) {
      this.props.toggleAuthModal(true);
      return;
    }
    if (post.author && post.author.id === me.id) {
      this.props.addNotification('danger', `Can't rate your own post`)
      return;
    }

    const newRate = like === 1 ? 0 : 1;

    try {
      await this.ratePost(newRate);

      if (like === 2) {
        post.rate.dislike -= 1;
      }
      post.rate.like += like === 1 ? -1 : 1;
      post.rate.status = newRate;

      this.setState({
        like: newRate
      })
    } catch (e) {
      console.log('error on thumb up', e)
    }
  }

  toggleThumbdown = async () => {
    const {
      isLoggedin,
      me,
      like,
    } = this.state;
    const { post } = this.props;

    if (!isLoggedin || !me) {
      this.props.toggleAuthModal(true);
      return;
    }
    if (post.author && post.author.id === me.id) {
      this.props.addNotification('danger', `Can't rate your own post`)
      return;
    }

    const newRate = like === 2 ? 0 : 2;

    try {
      await this.ratePost(newRate);

      if (like === 1) {
        post.rate.like -= 1;
      }
      post.rate.dislike += like === 2 ? -1 : 1;
      post.rate.status = newRate;

      this.setState({
        like: newRate
      })
    } catch (e) {
      console.log('error on thumb down', e)
    }
  }

  render() {
    const {
      like,
    } = this.state;

    const {
      gammatags,
      rate,
    } = this.props.post;
    const Gammatags = _.compact(gammatags.split(','))

    return (
      <div className='tools' ref={wrapper => this.wrapper = wrapper}>
        <Icon className='icon' name='share' size={24} onClick={this.openShareModal} />
        <Icon className='icon' name='dollar_fill' size={24} />
        <div className=''>
          <Icon className='icon' name={like === 1 ? 'heart_fill' : 'heart_outline'} size={24} onClick={this.toggleThumbup} />
          <span className='rate-count'>{_.get(rate, "like", 0) - _.get(rate, "dislike", 0)}</span>
          <Icon className='icon' name={like === 2 ? 'thumb_down' : 'thumb_down_outline'} size={24} onClick={this.toggleThumbdown} />
        </div>
        {Gammatags.map((gammatag, index) => (
          <a href={`/explore?q=${gammatag}`} key={index} className='gammatag'>
            <Icon className='gamma' name='gamma' size={16} />
            <span className='tag-name'>{gammatag}</span>
          </a>
        ))}
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

export default connect(mapStateToProps, { toggleAuthModal, openPostModal, addNotification })(withApollo(Tools));
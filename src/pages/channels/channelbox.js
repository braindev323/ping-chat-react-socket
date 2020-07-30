/*@flow*/

import React from 'react';
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';

import Icon from '../../components/icon';
import {
  mReadChannel,
} from '../../graphql/mutation';
import {
  toggleAuthModal,
} from '../../redux/actions';
import './index.scss'


type State = {
  isLoggedin: boolean,
  reading: number,
}

class ChannelBox extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    reading: this.props.data? this.props.data.reading: -1,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
    };
  }

  render() {
    const {
      id,
      username,
      name,
      logo,
    } = this.props.data;

    const {
      isLoggedin,
      reading,
    } = this.state;

    return (
      <div className='channel-box'>
        <div className='wrapper'>
          <img className='logo' src={logo} alt='logo' width={100} height={100} />
          {isLoggedin &&
            <Mutation mutation={mReadChannel}>
              {(readChannelMutation, { data }) => (
                <div className={`mask ${reading === 1? 'show': ''}`} onClick={() => {
                  if (!isLoggedin) {
                    this.props.toggleAuthModal(true);
                    return;
                  }

                  const newReading = 1 - reading;
                  readChannelMutation({
                    variables: {
                      channel_id: id,
                      reading: newReading,
                    }
                  }).then(res => {
                    this.props.data.reading = newReading;
                    this.setState({ reading: newReading });
                    return res;
                  }).catch(err => {
                  });
                }}>
                  {reading === 1? 
                    <Icon className='icon' name='check' size={60} />
                  :
                    <Icon className='icon' name='add' size={60} />
                  }
                </div>
              )}
            </Mutation>
          }
        </div>
        <a className='name' href={`/channels/${username}`}>{name}</a>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
  }
}

export default connect(mapStateToProps, { toggleAuthModal, })(ChannelBox);
/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';

import Avatar from '../../components/avatar';
import {
  mReadUser,
} from '../../graphql/mutation';
import {
  toggleAuthModal,
} from '../../redux/actions';


type User = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  photo?: string,
  level: number,
  create_date: Date,
  reading: number,
}

type State = {
  isLoggedin: boolean,
  me: ?User,
  reading: number,
  submitting: boolean,
};

class ReaderItem extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    reading: 0,
    submitting: false,
  }

  constructor(props: any) {
    super(props);

    this.state.reading = props.user.reading;
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    };
  }

  render() {
    const {
      isLoggedin,
      me,
      reading,
      submitting,
    } = this.state;
    
    const {
      id,
      username,
      first_name,
      last_name,
      photo,
      level,
    } = this.props.user;

    return (
      <div className='item' >
        <div className='main'>
          <Avatar url={photo} level={level} size={45} />
          <div className='info'>
            <div className='name'>{`${first_name} ${last_name}`}</div>
            <div className='username lightBlue'>{`@${username}`}</div>
          </div>
        </div>
        <Mutation mutation={mReadUser}>
          {(readUserMutation, { data }) => (
            <div className='tools'>
              <div className='read-button' onClick={() => {
                if (!isLoggedin || !me) {
                  this.props.toggleAuthModal(true);
                  return;
                }

                if (submitting) return;

                this.setState({ submitting: true });

                const newReading = 1 - reading;
                readUserMutation({
                  variables: {
                    user_id: id,
                    reading: newReading,
                  }
                }).then(res => {
                  this.props.user.reading = newReading;
                  this.setState({ reading: newReading, submitting: false });
                  return res;
                }).catch(err => {
                  this.setState({
                    submitting: false
                  });
                });
              }}>
                {reading? 'Unread': 'Read'}
              </div>
            </div>
          )}
        </Mutation>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, { toggleAuthModal })(ReaderItem);
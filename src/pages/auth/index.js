/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import Login from './login';
import Signup from './signup';
import ForgotPassword from './forgotpassword';

import './index.scss';
import {
  toggleAuthModal,
} from '../../redux/actions';


type State = {
  isOpen: boolean,
  modalType: number,
};

class AuthModal extends React.Component<any, State> {
  state: State = {
    isOpen: false,
    modalType: 0,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isOpen: props.isOpen,
      modalType: props.modalType,
    }
  }

  close = () => {
    this.props.toggleAuthModal(false);
  }

  render() {
    const {
      isOpen,
      modalType,
    } = this.state;

    return (
      <div className={`modal auth-modal ${isOpen? 'show': ''}`}>
        <div className="modal-outter" onClick={this.close}>
        </div>
        <div className="modal-dialog modal-dialog-centered">
          {modalType === 1?
            <Signup />
          : modalType === 2?
            <ForgotPassword />
          :
            <Login />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.auth.isModalOpen,
    modalType: state.auth.modalType,
    theme: state.theme.type,
  }
}

export default connect(mapStateToProps, { toggleAuthModal })(AuthModal);
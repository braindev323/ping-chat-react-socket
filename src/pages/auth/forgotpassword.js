/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';

import logoWhite from '../../resources/image/logoWhite.png';
import logoBlue from '../../resources/image/logoBlue.png';
import Icon from '../../components/icon';
import {
  mForgotPassword,
} from '../../graphql/mutation';
import {
  changeAuthModalType,
  addNotification,
} from '../../redux/actions';


type FormField = {
  isValid: boolean,
  value: string,
  errorMsg: string,
}

type State = {
  email: FormField,
  checkValidation: boolean,
  errorResponse: string,
  theme: string,
};

class ForgotPassword extends React.Component<any, State> {
  defaultState: any = {
    email: {
      isValid: false,
      value: '',
      errorMsg: 'Email is required',
    },
    checkValidation: false,
    errorResponse: '',
  }

  state: State = {
    ...this.defaultState,
    theme: 'dark',
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      theme: props.theme,
    };
  }

  handleUserInput = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    
    let field = this.state[fieldName];
    field.value = value;

    switch(fieldName) {
    case 'email':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'Email is required';
      } else {
        field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); // eslint-disable-line
        field.errorMsg = field.isValid? '' : 'Incorrect email format';
      }
      break;
    default:
      break;
    }
    this.setState({
      [fieldName]: field,
    });
  }

  validateForm = () => {
    this.setState({
      checkValidation: true,
    });
    const isVaildForm = this.state.email.isValid;
    return isVaildForm;
  }

  resetState() {
    this.setState({
      ...this.defaultState,
    });
  }

  gotoSignin = () => {
    this.props.changeAuthModalType(0);
  }

  gotoForgotPassword = () => {
  }

  gotoTerms = () => {
  }

  onClickFBButton = () => {
  }

  onClickGoogleButton = () => {
  }

  onRequestSuccess = (data) => {
    this.resetState();
  }

  render() {
    const {
      email,
      checkValidation,
      theme,
    } = this.state;

    return (
      <div className='forgotpassword-modal modal-content'>
        <div className='close-button' onClick={this.gotoSignin}>
          <Icon className='icon-close' name='arrow_left' size={24} />
        </div>
        <Mutation mutation={mForgotPassword}>
          {(forgotPasswordMutation, { data }) => (
            <div className='content-wrapper d-flex flex-column'>
              <div className='logo'>
                <img src={theme === 'dark' ? logoWhite : logoBlue} alt='logo' />
              </div>
              <div className='welcome'>
                Enter your email and we send you a password reset link.
              </div>
              <div className='form-group'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  className={`form-control ${!checkValidation || email.isValid? '': 'is-invalid'}`}
                  placeholder='Email'
                  required
                  value={email.value}
                  onChange={this.handleUserInput} />
                <div className="invalid-feedback">{email.errorMsg}</div>
              </div>
              <div className='buttons d-flex justify-content-center'>
                <button type='button' className='btn btn-main' onClick={() => {
                  if (!this.validateForm()) {
                    return;
                  }
                  forgotPasswordMutation({
                    variables: {
                      email: email.value,
                    }
                  }).then(res => {
                    this.onRequestSuccess(res.data.forgotPassword)
                    return res;
                  }).catch(err => {
                    if (err.graphQLErrors) {
                      err.graphQLErrors.forEach(error => {
                        this.props.addNotification('danger', error.message);
                      })
                    } else {
                      this.props.addNotification('danger', 'Failed to submit \nPlease try again');
                    }

                    this.setState({
                      errorResponse: err.message,
                    });
                  });
                }}>Send request</button>
              </div>
              <div className='terms'>
                <span onClick={this.gotoTerms}>Term of use. Privacy policy</span>
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
    theme: state.theme.type,
  }
}

export default connect(mapStateToProps, { changeAuthModalType, addNotification })(ForgotPassword);
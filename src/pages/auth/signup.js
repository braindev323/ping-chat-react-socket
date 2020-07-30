/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Mutation } from 'react-apollo';

import logoWhite from '../../resources/image/logoWhite.png';
import logoBlue from '../../resources/image/logoBlue.png';
import iphone from '../../resources/image/iPhone.png';
import apple from '../../resources/image/app_store.png';
import google from '../../resources/image/google_play.png';
import Checkbox from '../../components/form/checkbox';
import Icon from '../../components/icon';
import {
  mSignup,
} from '../../graphql/mutation';
import {
  changeAuthModalType,
  addNotification,
  toggleAuthModal,
} from '../../redux/actions';


type FormField = {
  isValid: boolean,
  value: string,
  errorMsg: string,
}

type State = {
  first_name: FormField,
  last_name: FormField,
  username: FormField,
  email: FormField,
  password: FormField,
  phone_number: FormField,
  agree_terms: boolean,
  checkValidation: boolean,
  errorResponse: string,
  theme: string,
};

class Signup extends React.Component<any, State> {
  defaultState: any = {
    first_name: {
      isValid: false,
      value: '',
      errorMsg: 'First name is required',
    },
    last_name: {
      isValid: false,
      value: '',
      errorMsg: 'Last name is required',
    },
    username: {
      isValid: false,
      value: '',
      errorMsg: 'Username is required',
    },
    email: {
      isValid: false,
      value: '',
      errorMsg: 'Email is required',
    },
    password: {
      isValid: false,
      value: '',
      errorMsg: 'Password is required',
    },
    phone_number: {
      isValid: false,
      value: '',
      errorMsg: 'Phone number is required',
    },
    agree_terms: false,
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
    case 'first_name':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'First name is required';
      } else {
        if (value.length > 15) {
          field.isValid = false;
          field.errorMsg = 'First name shouldn\'t be longer than 15';
        } else {
          field.isValid = true;
          field.errorMsg = '';
        }
      }
      break;
    case 'last_name':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'Last name is required';
      } else {
        if (value.length > 15) {
          field.isValid = false;
          field.errorMsg = 'Last name shouldn\'t be longer than 15';
        } else {
          field.isValid = true;
          field.errorMsg = '';
        }
      }
      break;
    case 'username':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'Username or email is required';
      } else {
        if (value.length < 4 || value.length > 20) {
          field.isValid = false;
          field.errorMsg = 'Username should be long from 4 to 20';
        } else {
          field.isValid = value.match(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
          field.errorMsg = field.isValid? '' : 'Username shouldn\'t contain special characters';
        }
      }
      break;
    case 'email':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'Email is required';
      } else {
        field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); // eslint-disable-line
        field.errorMsg = field.isValid? '' : 'Incorrect email format';
      }
      break;
    case 'password':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'Password is required';
      } else {
        if (value.length < 6 || value.length > 30) {
          field.isValid = false;
          field.errorMsg = 'Password should be long from 6 to 30';
        } else {
          field.isValid = true;
          field.errorMsg = '';
        }
      }
      break;
    case 'phone_number':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'Phone number is required';
      } else {
        field.isValid = value.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/); // eslint-disable-line
        field.errorMsg = field.isValid? '' : 'Incorrect phone number format';
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

    const {
      first_name,
      last_name,
      username,
      email,
      password,
      phone_number,
      agree_terms,
    } = this.state;
    const isVaildForm = first_name.isValid && last_name.isValid && username.isValid && email.isValid && password.isValid && phone_number.isValid && agree_terms;
    return isVaildForm;
  }

  resetState() {
    this.setState({
      ...this.defaultState,
    });
  }

  handleChange = (key, target) => {
    this.setState({ [key]: target.target.value })
  }

  gotoLogin = () => {
    this.props.changeAuthModalType(0);
  }

  gotoTerms = () => {
  }

  onClickFBButton = () => {
  }

  onClickGoogleButton = () => {
  }

  onSignupSuccess = (data) => {
    this.resetState();
    
    setTimeout(() => {this.props.toggleAuthModal(false)}, 100);
  }

  render() {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      phone_number,
      agree_terms,
      checkValidation,
      theme,
    } = this.state;

    return (
      <div className='signup-modal d-flex'>
        <div className='mobile-suggest'>
          <img className='screenshot' src={iphone} alt='screenshot' />
          <div className='appstore-buttons'>
            <img src={apple} alt='app store' />
            <img src={google} alt='google play store' />
          </div>
        </div>
        <div className='modal-content'>
          <Mutation mutation={mSignup}>
            {(signupMutation, { data }) => (
              <div className='content-wrapper d-flex flex-column'>
                <div className='logo'>
                  <img src={theme === 'dark' ? logoWhite : logoBlue} alt='logo' />
                </div>
                <div className='welcome'>
                  Please complete to create your account.
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <input
                      id='first_name'
                      name='first_name'
                      type='text'
                      className={`form-control ${!checkValidation || first_name.isValid? '': 'is-invalid'}`}
                      placeholder='First name'
                      required
                      value={first_name.value}
                      onChange={this.handleUserInput} />
                    <div className="invalid-feedback">{first_name.errorMsg}</div>
                  </div>
                  <div className='form-group col-md-6'>
                    <input
                      id='last_name'
                      name='last_name'
                      type='text'
                      className={`form-control ${!checkValidation || last_name.isValid? '': 'is-invalid'}`}
                      placeholder='Last name'
                      required
                      value={last_name.value}
                      onChange={this.handleUserInput} />
                    <div className="invalid-feedback">{last_name.errorMsg}</div>
                  </div>
                </div>
                <div className='form-group'>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    className={`form-control ${!checkValidation || username.isValid? '': 'is-invalid'}`}
                    placeholder='Username'
                    required
                    value={username.value}
                    onChange={this.handleUserInput} />
                  <div className="invalid-feedback">{username.errorMsg}</div>
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
                <div className='form-group'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    className={`form-control ${!checkValidation || password.isValid? '': 'is-invalid'}`}
                    placeholder='Password'
                    required
                    value={password.value}
                    onChange={this.handleUserInput} />
                  <div className="invalid-feedback">{password.errorMsg}</div>
                </div>
                <div className='form-group'>
                  <input
                    id='phone_number'
                    name='phone_number'
                    type='tel'
                    className={`form-control ${!checkValidation || phone_number.isValid? '': 'is-invalid'}`}
                    placeholder='Phone number'
                    required
                    value={phone_number.value}
                    onChange={this.handleUserInput} />
                  <div className="invalid-feedback">{phone_number.errorMsg}</div>
                </div>
                <div className='form-group'>
                  <Checkbox id='agree_terms' className='col-auto' label='I agree with terms and conditions' value={agree_terms} onChange={value => this.setState({agree_terms: value})} />
                </div>
                <div className='have-account text-center'>
                  Aleady have an account?  <label className='to-login' onClick={this.gotoLogin}>{'Login'}</label>
                </div>
                <div className='buttons d-flex justify-content-center'>
                  <button type='button' className='btn btn-main' onClick={() => {
                    if (!this.validateForm()) {
                      return;
                    }
                    signupMutation({
                      variables: {
                        first_name: first_name.value,
                        last_name: last_name.value,
                        username: username.value,
                        email: email.value,
                        password: password.value,
                        phone_number: phone_number.value,
                      }
                    }).then(res => {
                      this.props.addNotification('success', 'Signup success! \nPlease check our verificatin email in your mail box');
                      this.onSignupSuccess(res.data.signup)
                      return res;
                    }).catch(err => {
                      if (err.graphQLErrors) {
                        err.graphQLErrors.forEach(error => {
                          this.props.addNotification('danger', error.message);
                        })
                      } else {
                        this.props.addNotification('danger', 'Failed to signup \nPlease try again');
                      }

                      this.setState({
                        errorResponse: err.message,
                      });
                    });
                  }}>Sgin up</button>
                </div>
                <p className='text-or'>Or</p>
                <div className='social-buttons'>
                  <Icon className='icon-button' name='google' size={38} onClick={this.onClickGoogleButton} />
                  <Icon className='icon-button' name='facebook' size={38} onClick={this.onClickFBButton} />
                </div>
              </div>
            )}
          </Mutation>
          <div className='terms'>
            <span onClick={this.gotoTerms}>Term of use. Privacy policy</span>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    theme: state.theme.type,
  }
}

export default connect(mapStateToProps, { changeAuthModalType, addNotification, toggleAuthModal })(Signup);
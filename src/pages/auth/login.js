/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { ApolloConsumer, Mutation } from 'react-apollo';

import logoWhite from '../../resources/image/logoWhite.png';
import logoBlue from '../../resources/image/logoBlue.png';
import Checkbox from '../../components/form/checkbox';
import Icon from '../../components/icon';
import {
  mSignin,
} from '../../graphql/mutation';
import {
  qMe,
} from '../../graphql/query';
import {
  authLogin,
  setUserData,
  changeAuthModalType,
  toggleAuthModal,
  addNotification,
} from '../../redux/actions';


type FormField = {
  isValid: boolean,
  value: string,
  errorMsg: string,
}

type State = {
  username: FormField,
  password: FormField,
  remember_me: boolean,
  checkValidation: boolean,
  errorResponse: string,
  theme: string,
};

class Login extends React.Component<any, State> {
  defaultState: any = {
    username: {
      isValid: false,
      value: '',
      errorMsg: 'Username or email is required',
    },
    password: {
      isValid: false,
      value: '',
      errorMsg: 'Password is required',
    },
    remember_me: false,
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
    case 'username':
      if (!value || value.length === 0) {
        field.isValid = false;
        field.errorMsg = 'Username or email is required';
      } else if (value.indexOf('@') > -1) {
        // check email validation
        field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i); // eslint-disable-line
        field.errorMsg = field.isValid? '' : 'Incorrect email format';
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
    const isVaildForm = this.state.username.isValid && this.state.password.isValid;
    return isVaildForm;
  }

  resetState() {
    this.setState({
      ...this.defaultState,
    });
  }

  gotoSignup = () => {
    this.props.changeAuthModalType(1);
  }

  gotoForgotPassword = () => {
    this.props.changeAuthModalType(2);
  }

  gotoTerms = () => {
  }

  onClickFBButton = () => {
  }

  onClickGoogleButton = () => {
  }

  onLoginSuccess = async (signinData: any, client: any) => {
    this.props.authLogin(signinData);
    try {
      const { data: { me } } = await client.query({
        query: qMe,
      });
      this.props.setUserData(me);

      this.resetState();
      this.props.toggleAuthModal(false);
      
      setTimeout(() => {window.location.reload()}, 100);
    } catch (err) {
      this.setState({
        errorResponse: err.message,
      });
      this.props.addNotification('danger', 'Failed to login \nPlease try again');
    }
  }

  render() {
    const {
      username,
      password,
      remember_me,
      checkValidation,
      theme,
    } = this.state;

    return (
      <div className='login-modal modal-content'>
        <ApolloConsumer>
          {client => (
            <Mutation mutation={mSignin}>
              {(signinMutation, { data }) => (
                <div className='content-wrapper d-flex flex-column'>
                  <div className='logo'>
                    <img src={theme === 'dark' ? logoWhite : logoBlue} alt='logo' />
                  </div>
                  <div className='welcome'>
                    Welcome back! Please login to your account.
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
                    <Checkbox id='remember_me' className='col-auto' label='Remember me' value={remember_me} onChange={value => this.setState({remember_me: value})} />
                    <label className='float-right forgot-password' onClick={this.gotoForgotPassword}>{'Forgot Password'}</label>
                  </div>
                  <div className='buttons d-flex justify-content-between'>
                    <button type='button' className='btn btn-main' onClick={() => {
                      if (!this.validateForm()) {
                        return;
                      }
                      signinMutation({
                        variables: {
                          login: username.value,
                          password: password.value,
                        },
                      }).then(res => {
                        this.onLoginSuccess(res.data.signin, client)
                        return res;
                      }).catch(err => {
                        if (err.graphQLErrors) {
                          err.graphQLErrors.forEach(error => {
                            this.props.addNotification('danger', error.message);
                          })
                        } else {
                          this.props.addNotification('danger', 'Failed to login \nPlease try again');
                        }

                        this.setState({
                          errorResponse: err.message,
                        });
                      });
                    }}>Login</button>
                    <button type='button' className='btn btn-main-outline' onClick={this.gotoSignup}>Sgin up</button>
                  </div>
                  <p className='text-or'>Or</p>
                  <div className='social-buttons'>
                    <Icon className='icon-button' name='google' size={38} onClick={this.onClickGoogleButton} />
                    <Icon className='icon-button' name='facebook' size={38} onClick={this.onClickFBButton} />
                  </div>
                </div>
              )}
            </Mutation>
          )}
        </ApolloConsumer>
        <div className='terms'>
          <span onClick={this.gotoTerms}>Term of use. Privacy policy</span>
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

export default connect(mapStateToProps, { authLogin, setUserData, changeAuthModalType, toggleAuthModal, addNotification })(Login);
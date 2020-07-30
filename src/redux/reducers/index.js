/* @flow */

import { combineReducers } from 'redux';

import auth from './auth';
import common from './common';
import notification from './notification';
import postmodal from './postmodal';
import sidebar from './sidebar';
import theme from './theme';
import call from './call';
import contacts from './contacts';

export default combineReducers ({
  auth,
  common,
  notification,
  postmodal,
  sidebar,
  theme,
  call,
  contacts,
})
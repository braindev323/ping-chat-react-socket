/* @flow */

import {
  SET_CONTACTS,
  SELECT_CONTACT
} from '../type';

export const setContacts = (myContacts: array) => {
  return {
    type: SET_CONTACTS,
    data: { myContacts }
  }
}

export const selectContact = (contact: object) => {
  return {
    type: SELECT_CONTACT,
    data: { contact }
  }
}
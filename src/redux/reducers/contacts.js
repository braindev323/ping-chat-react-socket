/* @flow */

import {
  SET_CONTACTS,
  SELECT_CONTACT
} from '../type';


const INITIAL = {
  myContacts: [],
  selectedContact: {},
  contactByUsername: {}
}

export default (state: any = INITIAL, action: any) => {
  switch (action.type) {
    case SET_CONTACTS: {
      const { myContacts } = action.data;
      const contactByUsername = myContacts.reduce((sum, contact) => Object.assign(sum, { [contact['account']['username']] : contact }), {})
      return { ...state, myContacts, contactByUsername };
    }
    case SELECT_CONTACT: {
      const { contact } = action.data;
      return { ...state, selectedContact: contact }
    }

    default:
      return state;
  }
}
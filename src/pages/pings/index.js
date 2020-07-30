/* @flow */

import React from 'react'
import './index.scss'
import PingsBar from './pings-bar';
import PingsContent from './pings-content'
import { setContacts, selectContact } from './../../redux/actions/contacts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { qGetMyContacts } from './../../graphql/query/contacts';
import { toggleAuthModal } from './../../redux/actions/auth';

type State = {
  title: string,
};

class PingsPage extends React.Component<any, State> {
  state: State = {
    title: "",
    fetchingContacts: false
  }

  componentWillMount() {
    const { setContacts, selectContact, isLoggedin } = this.props;
    const { username } = this.props.match.params;
    if (!isLoggedin) this.props.toggleAuthModal(true);
    this.setState({ fetchingContacts: true })
    var scopeThis = this;
    this.props.client.query({
      query: qGetMyContacts,
      fetchPolicy: 'no-cache',
    }).then((res) => {
      const contacts = res.data.getMyContacts;
      setContacts(contacts)
      const selectedContact = username ? contacts.find((contact) => contact.account.username === username) : contacts[0];
      selectContact(selectedContact);
      scopeThis.setState({ fetchingContacts: false })
    }).catch((err)=>scopeThis.setState({ fetchingContacts: false }))
  }

  componentWillReceiveProps(next) {
    if (!this.props.isLoggedin)
      this.props.toggleAuthModal(true);
  }

  render() {
    return (
      <div className="pings-page page">
        <div className="layout-main">
          <PingsBar fetchingContacts={this.state.fetchingContacts} />
          <PingsContent />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    myInfo: state.auth.me,
    myContacts: state.contacts.myContacts,
    selectedContact: state.contacts.selectedContact,
    isLoggedin: state.auth.loggedin,
  }
}

export default connect(mapStateToProps, { setContacts, selectContact, toggleAuthModal })(withApollo(PingsPage));
/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import logoWhite from '../../resources/image/logoWhite.png';
import Avatar from '../avatar';
import MenuItem from './menuItem';
import Icon from '../../components/icon';
import {
  authLogout,
  toggleSidebar,
  toggleAuthModal,
} from '../../redux/actions';
import './index.scss';


type Country = {
  id: number,
  name: string,
  country_code: string,
  dial_code: number,
}

type City = {
  id: number,
  name: string,
}

type User = {
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  phone_number?: string,
  signup_type: number,
  level: number,
  site_url?: string,
  country: Country,
  city: City,
}

type State = {
  isOpen: boolean,
  isPrevOpen: boolean,
  isLoggedin: boolean,
  me: ?User,
};

class Sidebar extends React.Component<any, State> {
  state: State = {
    isOpen: false,
    isPrevOpen: false,
    isLoggedin: false,
    me: null,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isOpen: props.isOpen,
      isPrevOpen: state.isOpen,
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  toggleSign = () => {
    this.props.toggleSidebar(false);
    if (this.state.isLoggedin) {
      this.props.authLogout();
      this.props.history.push('/'); // go to home page
    } else {
      this.props.toggleAuthModal(true);
    }
  }

  checkAuth = (e: any) => {
    if (!this.state.isLoggedin) {
      e.preventDefault();
      this.props.toggleAuthModal(true);
    }

    this.closeSidebar();
  }

  closeSidebar = () => {
    this.props.toggleSidebar(false);
  }

  render() {
    const {
      isOpen,
      isPrevOpen,
      isLoggedin,
      me,
    } = this.state;

    return (
      <div className={`sidebar ${isOpen? 'active': isPrevOpen? 'inactive' : ''}`}>
        <div className='sidebar-wrapper'>
          <div className='sidebar-content'>
            <div className='profile'>
              <Avatar url={me && me.photo} level={(me && me.level) || 0} size={60} />
              <div className='user-info'>
                <div className='name'>{me? me.first_name + ' ' + me.last_name: 'Anonymous'}</div>
                <div className='location'>{`${(me && me.city && me.city.name) || 'New York'}, ${(me && me.country && me.country.name) || 'United States'}`}</div>
              </div>
              <div className='underline' />
            </div>
            <div className='menu'>
              <ul className='menu-group'>
                <MenuItem icon='profile' label='Profile' link={`/profile`} onClick={this.checkAuth} />
                <MenuItem icon='wallet' label='Wallet' link='/wallet' onClick={this.checkAuth} />
                <MenuItem icon='bell' label='Notifications' link='/notifications' onClick={this.checkAuth} />
                <MenuItem icon='comments' label='Pings' link='/pings/' onClick={this.checkAuth} />
                <MenuItem icon='bookmark_fill' label='Bookmarked' link='/bookmark' onClick={this.checkAuth} />
              </ul>
              <ul className='menu-group'>
                <MenuItem icon='chart_fill' label='Ads' link={`/ads`} onClick={this.checkAuth} />
                <MenuItem icon='setting' label='Settings' link='/settings' onClick={this.checkAuth} />
                <div className='menu-item' onClick={this.toggleSign}>
                  <li>
                    <Icon className='menu-icon' name='exit' size={34} />
                    <span className='menu-label'>{isLoggedin? 'Sign out': 'Login'}</span>
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <div className='sidebar-block' onClick={this.closeSidebar}>
            <img className='logo' src={logoWhite} alt='logo' />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.sidebar.isOpen,
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, { authLogout, toggleSidebar, toggleAuthModal })(withRouter(Sidebar));
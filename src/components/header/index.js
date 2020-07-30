/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';

import Icon from '../icon';
import logoWhite from '../../resources/image/logoWhite.png';
import logoBlue from '../../resources/image/logoBlue.png';
import {
  toggleSidebar,
  toggleAuthModal,
  changeTheme,
} from '../../redux/actions';
import './index.scss';


type State = {
  isLoggedin: boolean,
  theme: string,
  isExplorePage: boolean,
  searchkey: string, // explore search
};

class Header extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    theme: 'dark',
    isExplorePage: false,
    searchkey: '',
  }

  static getDerivedStateFromProps(props: any, state: State) {
    let newState: any = {
      isLoggedin: props.isLoggedin,
      theme: props.theme,
    };

    const { location } = props;
    const isExplorePage = location.pathname && location.pathname.startsWith('/explore');
    if (state.isExplorePage !== isExplorePage) {
      newState.isExplorePage = isExplorePage;
      
      if (isExplorePage) {
        const query = queryString.parse(location.search);
        newState.searchkey = query.q || '';
      } else {
        newState.searchkey = '';
      }
    }

    return newState;
  }

  openSidebar = () => {
    this.props.toggleSidebar(true);
  }

  openAuthModal = () => {
    this.props.toggleAuthModal(true);
  }

  exploreSearch = (event: any) => {
    if (event.keyCode === 13) {
      const { searchkey } = this.state;

      if (searchkey && searchkey.length > 0) {
        this.props.history.push(`/explore?q=${searchkey}`);
      }
    }
  }

  switchTheme = () => {
    const theme = this.state.theme === 'dark'? 'light': 'dark';
    this.props.changeTheme(theme);
  }

  render() {
    const { location } = this.props;
    
    const {
      isLoggedin,
      theme,
      searchkey,
    } = this.state;

    return (
      <nav className='header navbar navbar-expand'>
        <div className='navbar-brand' onClick={this.openSidebar}>
          <img src={theme === 'dark'? logoWhite: logoBlue} alt='logo' />
        </div>
        <ul className='navbar-nav mr-auto'>
          <NavLink exact className='nav-link' to='/'>
            <li className='nav-item'>Home</li>
            <div className='underline' />
          </NavLink>
          <NavLink strict className='nav-link' to='/channels'>
            <li className='nav-item'>Channels</li>
            <div className='underline' />
          </NavLink>
          <div className={`nav-explore ${location.pathname && location.pathname.startsWith('/explore')? 'active': ''}`}>
            <div className='explore-search'>
              <Icon className='icon' name='search' size={24} />
              <input
                type='search'
                placeholder='Explore...'
                value={searchkey}
                onChange={e => this.setState({ searchkey: e.target.value })}
                onKeyDown={this.exploreSearch} />
            </div>
            <div className='underline' />
          </div>
        </ul>
        <div className='navbar-right'>
          {!isLoggedin &&
            <div className='item-right'>
              <button type='button' className='btn btn-main' onClick={this.openAuthModal}>Login</button>
            </div>
          }
          <div className='item-right location'>
            {'New York, US'}
            <Icon name={'arrow_down'} size={22} />
          </div>
          <div className='item-right'>
            {moment().format('dddd, MMMM D')}
          </div>
          <div className='item-right'>
            <Icon name={'sun'} size={24} className={`weather-icon`} />
            <span>{'34'}</span>
            <Icon name={'celcius'} size={24} className='weather-unit' />
          </div>
        </div>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    theme: state.theme.type,
  }
}

export default connect(mapStateToProps, { toggleSidebar, changeTheme, toggleAuthModal })(withRouter(Header));
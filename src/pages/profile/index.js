/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';

import defaultCover from '../../resources/image/cover.png';
import Avatar from '../../components/avatar';
import Icon from '../../components/icon';
import Memo from './memo';
import Reading from './reading';
import Readers from './readers';
import {
  formatNumber,
} from '../../utils';
import {
  qGetUserByUsername,
  qGetUserActivity,
} from '../../graphql/query';
import {
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
  level: number,
  country: Country,
  city: City,
}

const Menu = {
  Memos: 0,
  Reading: 1,
  Readers: 2,
}

type State = {
  isLoggedin: boolean,
  me: ?User,
  currentMenu: number,
};

class Profile extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,
    me: null,
    currentMenu: Menu.Memos,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    const { username } = props.match.params;
    const { isLoggedin, me } = state;
    if (!username) {
      if (isLoggedin && me) {
        props.history.push(`/profile/${me.username}`);
      }
    }

    return {
      isLoggedin: props.isLoggedin,
      me: props.me,
    }
  }

  componentDidMount() {
    const { username } = this.props.match.params;
    const { isLoggedin, me } = this.state;
    if (!username) {
      if (isLoggedin && me) {
        this.props.history.push(`/profile/${me.username}`);
      } else {
        this.props.toggleAuthModal(true);
      }
    }
  }
  
  render() {
    const { username } = this.props.match.params;
    const { currentMenu } = this.state;

    if (!username) return null;
    
    const user: ?User = this.props.user.getUserByUsername;
    const activity = this.props.activity.getUserActivity;

    console.log('===user', user);
    console.log('===activity', activity);

    if (!user || !activity) {
      return (
        <div className='not-found'>
          <h3>{'This profile is not available'}</h3>
        </div>
      )
    }

    const {
      first_name,
      last_name,
      photo,
      cover_image,
      level,
      country,
      city,
    } = user;

    return (
      <div className='profile'>
        <div className='main-header' style={{ backgroundImage: `url(${cover_image || defaultCover})` }}>
          <div className='avatar-group'>
            <Avatar url={photo} size={200} />
            <div className='icons'>
              {level === 1 &&
                <Icon className='icon-level' name='guard' size={28} />
              }
              {level === 2 &&
                <Icon className='icon-level' name='group' size={28} />
              }
            </div>
          </div>
          <div className='name'>{`${first_name} ${last_name}`}</div>
          <div className='location'>{`${city? city.name : 'New York'}, ${country? country.name : 'United States'}`}</div>
          <div className='menu'>
            <div className={`menu-item ${currentMenu === Menu.Memos? 'active': ''}`} onClick={() => this.setState({currentMenu: Menu.Memos})}>
              <span>{`${formatNumber(activity.posts)} Memos`}</span>
              <div className='underline'></div>
            </div>
            <div className={`menu-item ${currentMenu === Menu.Reading? 'active': ''}`} onClick={() => this.setState({currentMenu: Menu.Reading})}>
              <span>{`${formatNumber(activity.reading)} Reading`}</span>
              <div className='underline'></div>
            </div>
            <div className={`menu-item ${currentMenu === Menu.Readers? 'active': ''}`} onClick={() => this.setState({currentMenu: Menu.Readers})}>
              <span>{`${formatNumber(activity.readers)} Readers`}</span>
              <div className='underline'></div>
            </div>
          </div>
        </div>
        {currentMenu === Menu.Memos && <Memo user={user} />}
        {currentMenu === Menu.Reading && <Reading user={user} />}
        {currentMenu === Menu.Readers && <Readers user={user} />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default compose(
  graphql(qGetUserByUsername, { name: 'user', options: (props) => ({ variables: { username: props.match.params.username || "" } }) } ),
  graphql(qGetUserActivity, { name: 'activity', options: (props) => ({ variables: { username: props.match.params.username || "" } }) } ),
  connect(mapStateToProps, { toggleAuthModal }),
)(withRouter(Profile));
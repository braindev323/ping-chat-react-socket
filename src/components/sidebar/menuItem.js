/* @flow */

import React from 'react';
import { NavLink } from 'react-router-dom';

import Icon from '../icon';


type Props = {
  link: string,
  icon: string,
  label: string,
  onClick: ?() => any;
};

type State = {
};

export default class MenuItem extends React.Component<Props, State> {
  render() {
    const { link, icon, label, onClick } = this.props;
    return (
      <NavLink className='menu-item' strict to={link} onClick={onClick}>
        <div className="leftline" />
        <li>
          <Icon className="menu-icon" name={icon} size={34} />
          <span className="menu-label">{label}</span>
        </li>
      </NavLink>
    )
  };
};
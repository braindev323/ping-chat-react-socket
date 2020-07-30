/*@flow*/

import * as React from 'react';

import Icon from '../../components/icon';

type Props = {
  children?: React.Node,
  title: string,
  icon: string,
  active?: boolean,
  onClick?: (e: any) => any,
}

type State = {
}

class Menu extends React.Component<Props, State> {
  render(){
    const {
      children,
      title,
      icon,
      active,
      onClick,
    } = this.props;

    return (
      <div className={`menu ${active? 'active': ''}`}>
        <div className='menu-item' onClick={onClick}>
          {active && <div className='left-border'></div>}
          <Icon className='icon' name={icon} size={30} />
          <span className='title'>{title}</span>
          <Icon className='icon arrow' name={active? 'arrow_left': 'arrow_right'} size={24} />
        </div>
        {active && 
          <div className='submenu'>
            {children}
          </div>
        }
      </div>
    )
  }
}

export default Menu;
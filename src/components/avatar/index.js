/* @flow */

import React from 'react';

import defaultAvatar from '../../resources/image/avatar.png';
import Icon from '../icon';
import './index.scss';


const MAX_LEVELICON_SIZE = 28;

type Props = {
  className?: string,
  size?: number,
  url?: ?string,
  level?: number,
  onClick?: () => any,
};

type State = {
};

export default class Avatar extends React.Component<Props, State> {
  render() {
    const {
      className,
      size,
      url,
      level,
      onClick,
    } = this.props;

    let levelIconSize = (size || 50) * 0.28;
    if (levelIconSize > MAX_LEVELICON_SIZE) levelIconSize = MAX_LEVELICON_SIZE;

    return (
      <div className={`avatar ${className || ''}`} onClick={onClick}>
        <img src={url || defaultAvatar} width={size || 50} height={size || 50} alt='avatar'/>
        {level === 1 &&
          <Icon className='icon-level' name='guard' size={levelIconSize} />
        }
        {level === 2 &&
          <Icon className='icon-level' name='group' size={levelIconSize} />
        }
      </div>
    )
  };
};
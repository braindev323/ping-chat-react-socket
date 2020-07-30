/* @flow */

import React from 'react';
import _ from 'lodash';

import icomoonConfig from '../resources/font/icomoon/selection.json';


type Props = {
  name: string,
  size: number,
  className?: string,
  onClick?: () => any,
};

type State = {
};

export default class Icon extends React.Component<Props, State> {
  getIcon = (iconName: string) => {
    const icon = icomoonConfig.icons.find(icon => icon.properties.name === iconName);
  
    if (icon) {
      return icon.icon;
    } else {
      console.warn(`icon ${iconName} does not exist.`);
      return '';
    }
  }

  render() {
    const {
      name,
      size,
      className,
      onClick,
    } = this.props;

    const icon = this.getIcon(name);
    if (!icon) return null;

    const { paths, attrs } = icon;
    const attributes = _.merge({}, ...attrs);

    return (
      <svg width={size} height={size} className={className} viewBox="0 0 1024 1024" onClick={onClick}>
        <path d={paths.join(' ')} { ...attributes } ></path>
      </svg>
    )
  };
};
/* @flow */

import React from 'react';

import {
  formatTime,
} from '../../utils';

type Props = {
  className?: string,
  seconds: number,
}
export default function Duration (props: Props) {
  const { className, seconds } = props;
  
  return (
    <time className={className} dateTime={`P${Math.round(seconds)}S`}>
      {formatTime(seconds)}
    </time>
  )
}
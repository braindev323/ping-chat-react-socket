/* @flow */

import React from 'react';

import Icon from '../icon';


const URL_STATE = {
  VALID: 0,
  ERROR: 1,
  TIMEOUT: 2,
}

type Props = {
  className?: string,
  onApply?: (url: string) => any,
};

type State = {
  url: string,
  isValid: boolean,
};

function checkImageUrl(url: string) {
  return new Promise(function (resolve, reject) {
    const timeout = 5000;
    let timer, img = new Image();
    img.onerror = img.onabort = function () {
      clearTimeout(timer);
      reject(URL_STATE.ERROR);
    };
    img.onload = function () {
      clearTimeout(timer);
      resolve(URL_STATE.VALID);
    };
    timer = setTimeout(function () {
      // reset .src to invalid URL so it stops previous loading, but doesn't trigger new load
      img.src = "//!!!!/test.jpg";
      reject(URL_STATE.TIMEOUT);
    }, timeout);
    img.src = url;
  });
}

export default class ImageImporter extends React.Component<Props, State> {
  state: State = {
    url: '',
    isValid: false,
  }

  onChange = async (e: any) => {
    const url = e.target.value;
    this.setState({ url, isValid: false });
    try {
      const urlState = await checkImageUrl(url);
      this.setState({ isValid: urlState === URL_STATE.VALID });
    } catch (err) {
      console.log(err);
    }
  }
  
  onApply = () => {
    const {
      url,
      isValid,
    } = this.state;

    if (url && isValid && this.props.onApply) {
      this.props.onApply(url);
    }
  }

  render() {
    const {
      className,
    } = this.props;

    const {
      url,
      isValid,
    } = this.state;

    return (
      <div className={`image-importer ${className || ''}`}>
        <div className='main-input'>
          <Icon className='icon' name='link' size={20} />
          <input
            type='text'
            name='url'
            placeholder='Paste Image URL here'
            value={url}
            onChange={this.onChange} />
          <div className={`apply ${url && isValid? '': 'disable'}`} onClick={this.onApply}>
            <span>apply</span>
          </div>
        </div>
        {url && isValid &&
          <div className='image-preview'>
            <div className='image-wrapper main-ratio'>
              <img className='content' src={url} alt='From url' />
            </div>
          </div>
        }
      </div>
    )
  };
};
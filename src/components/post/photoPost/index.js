/* @flow */

import React from 'react';
import { get } from "lodash";

import Header from '../header';
import Content from '../content';
import './index.scss';

type Props = {
  data: any,
};

type State = {
  selectedImage: number,
};

export default class PhotoPost extends React.Component<Props, State> {
  state: State = {
    selectedImage: 0,
  }

  render() {
    // const {
    //   media: {
    //     images,
    //   },
    // } = this.props.data;

    const images = get(this.props.data, "media.images")

    const {
      selectedImage,
    } = this.state;

    return (
      <div className='post post-photo'>
        <div className='post-content'>
          <Header post={this.props.data} />
          <Content post={this.props.data} />
        </div>
        {images && images.length > 0 &&
          <div className='image-preview'>
            {images.length === 1?
              <div className='image-wrapper main-ratio'>
                <img className='content' src={images[0]} alt='Full preview' />
              </div>
            :
              <div className='main-ratio'>
                <div className='content'>
                  <div className='background' style={{backgroundImage: `url(${images[selectedImage]})`}}></div>
                  <div className='wrapper'>
                    <div className='preview'>
                      <div className='image-wrapper main-ratio'>
                        <img className='content' src={images[selectedImage]} alt='Preview' />
                      </div>
                    </div>
                    <div className='thumbnail-list'>
                      {images.map((image, index) => (
                        <div key={index} className='thumbnail'>
                          <div key={index} className={`image-wrapper main-ratio ${selectedImage === index? 'active': ''}`} onClick={() => this.setState({selectedImage: index})}>
                            <img className='content' src={images[index]} alt='thumbnail' />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    )
  };
};
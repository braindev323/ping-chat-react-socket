/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Latest from './latest';
import Articles from './articles';
import Peoples from './peoples';
import Photos from './photos';
import Videos from './videos';
import Lives from './lives';
import './index.scss';


const Menu = {
  Latest: '',
  Articles: 'news',
  Peoples: 'user',
  Photos: 'image',
  Videos: 'video',
  Lives: 'live',
  Trending: 'trending',
}

type State = {
  currentMenu: string,
  isExplorePage: boolean,
  searchkey: string,
};

class Explore extends React.Component<any, State> {
  state: State = {
    currentMenu: Menu.Latest,
    isExplorePage: false,
    searchkey: '',
  }

  static getDerivedStateFromProps(props: any, state: State) {
    const { location } = props;
    const query = queryString.parse(location.search);
    const isExplorePage = location.pathname && location.pathname.startsWith('/explore');

    let newState: any = {
      searchkey: isExplorePage? query.q || '': '',
    };

    if (state.isExplorePage !== isExplorePage) {
      newState.isExplorePage = isExplorePage;
      
      if (isExplorePage) {
        newState.currentMenu = query.c || '';
      } else {
        newState.currentMenu = '';
      }
    }

    return newState;
  }

  changeMenu = (menu: string) => {
    this.setState({currentMenu: menu})
    if (this.state.isExplorePage) {
      const query = queryString.parse(this.props.location.search);
      if (menu === Menu.Latest) {
        delete query.c;
      } else {
        query.c = menu;
      }
      this.props.history.replace(`/explore?${queryString.stringify(query)}`);
    }
  }

  render() {
    const {
      currentMenu,
      searchkey,
    } = this.state;

    return (
      <div className='explore'>
        <div className='main-header'>
          <div className='left-padding'></div>
          <div className='menu'>
            <div className={`menu-item ${currentMenu === Menu.Latest? 'active': ''}`} onClick={() => this.changeMenu(Menu.Latest)}>
              <span>{'Latest'}</span>
              <div className='underline'></div>
            </div>
            <div className={`menu-item ${currentMenu === Menu.Articles? 'active': ''}`} onClick={() => this.changeMenu(Menu.Articles)}>
              <span>{'Articles'}</span>
              <div className='underline'></div>
            </div>
            <div className={`menu-item ${currentMenu === Menu.Peoples? 'active': ''}`} onClick={() => this.changeMenu(Menu.Peoples)}>
              <span>{'People'}</span>
              <div className='underline'></div>
            </div>
            <div className={`menu-item ${currentMenu === Menu.Photos? 'active': ''}`} onClick={() => this.changeMenu(Menu.Photos)}>
              <span>{'Photos'}</span>
              <div className='underline'></div>
            </div>
            <div className={`menu-item ${currentMenu === Menu.Videos? 'active': ''}`} onClick={() => this.changeMenu(Menu.Videos)}>
              <span>{'Videos'}</span>
              <div className='underline'></div>
            </div>
            <div className={`menu-item ${currentMenu === Menu.Lives? 'active': ''}`} onClick={() => this.changeMenu(Menu.Lives)}>
              <span>{'LIVE'}</span>
              <div className='underline'></div>
            </div>
            {/* <div className={`menu-item ${currentMenu === Menu.Trending? 'active': ''}`} onClick={() => this.changeMenu(Menu.Trending)}>
              <span>{'Trending'}</span>
              <div className='underline'></div>
            </div> */}
          </div>
          <div className='right-padding'></div>
        </div>
        <div className='page'>
          <div className='left-content'>
          </div>
          <div className='main-content'>
            {currentMenu === Menu.Latest &&
              <Latest searchkey={searchkey} onChangeMenu={this.changeMenu} />
            }
            {currentMenu === Menu.Articles &&
              <Articles searchkey={searchkey} />
            }
            {currentMenu === Menu.Peoples &&
              <Peoples searchkey={searchkey} />
            }
            {currentMenu === Menu.Photos &&
              <Photos searchkey={searchkey} />
            }
            {currentMenu === Menu.Videos &&
              <Videos searchkey={searchkey} />
            }
            {currentMenu === Menu.Lives &&
              <Lives searchkey={searchkey} />
            }
          </div>
          <div className='right-content'>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, { })(withRouter(Explore));
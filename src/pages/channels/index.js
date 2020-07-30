/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import _, { flowRight as compose } from 'lodash';

import Icon from '../../components/icon';
import FloatingWrapper from '../../components/floatingwrapper';
import Dropdown from '../../components/dropdown';
import Searchbar from '../../components/searchbar';
import ChannelBox from './channelbox';

import {
  qGetHotChannels,
  qGetChannels,
} from '../../graphql/query';
import './index.scss';


const SortMethod = {
  Name: 0,
  Type: 1,
}

type Country = {
  id: number,
  name: string,
  country_code: string,
  dial_code: number,
}

type ChannelData = {
  id: number,
  username: string,
  name: string,
  email: string,
  logo?: string,
  cover_image?: string,
  site_url: number,
  country: Country,
  type: number,
  description: string,
  create_date: Date,
  reading: number,
}

const continents = [
  {id: -1, name: 'Search By Contient'},
  {id: 0, name: 'General Interest'},
  {id: 1, name: 'North America'},
  {id: 2, name: 'Europe'},
  {id: 3, name: 'Asia'},
  {id: 4, name: 'Africa'},
  {id: 5, name: 'Latin America'},
]

type State = {
  channels: Array<ChannelData>,
  countries: Array<Country>,
  continent: number,
  country: number,
  sortMethod: number,
  searchKey: string,
}

class Channels extends React.Component<any, State>{
  state: State = {
    channels: [],
    countries: [],
    continent: -1,
    country: -1,
    searchKey: '',
    sortMethod: SortMethod.Type,
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      channels: props.channels.getChannels || [],
      countries: _.concat([{id: -1, name: 'Search By Country'}], props.countries),
    }
  }

  renderHotChannels() {
    const hotChannels: ?Array<ChannelData> = this.props.hotChannels.getHotChannels;
    if (!hotChannels) {
      return null;
    }

    return (
      <div className='hot-channels'>
        {hotChannels.map((channel) => (
          <a key={channel.id} className='hot-channel' href={`/channels/${channel.username}`}>
            <img src={channel.logo} width={70} height={70} alt='logo' />
            <span className='name'>{channel.name}</span>
          </a>
        ))}
      </div>
    )
  }

  render() {
    const {
      channels,
      countries,
      continent,
      country,
      searchKey,
      sortMethod,
    } = this.state;

    let filteredChannels = _.filter(_.sortBy(channels, sortMethod === SortMethod.Type? ['type', 'name']: ['name']), channel => {
      if (continent > -1 && channel.type !== continent) return false;
      if (country > -1 && channel.country.id !== country) return false;
      if (!!searchKey && channel.name.toLowerCase().indexOf(searchKey.toLowerCase()) < 0) return false;

      return true;
    });

    return (
      <div className='channels page'>
        <FloatingWrapper className='left-content'>
          <div className='sub-header'>
            <Icon name='fire' size={24} className='icon-primary' />
            <h5 className='sub-header-title'>Hot Channels</h5>
          </div>
          { this.renderHotChannels() }
        </FloatingWrapper>
        <div className='main-content'>
          <div className='list-units'>
            <div className='unit-group'>
              <Icon className='icon' name='globe' size={24} />
              <Dropdown
                className='unit'
                items={continents}
                renderItem={continent => (
                  <span>{continent.name}</span>
                )}
                onChange={continent => this.setState({continent: continent.id})}/>
              <Dropdown
                className='unit'
                items={countries}
                renderItem={country => (
                  <span>{country.name}</span>
                )}
                onChange={country => this.setState({country: country.id})}/>
            </div>
            <div className='unit-group'>
              <div className='unit sort' onClick={() => this.setState({ sortMethod: 1 - sortMethod })}>
                <Icon className='icon' name={sortMethod === SortMethod.Type? 'globe': 'view_grid'} size={24} />
                <h5 className='title'>{sortMethod === SortMethod.Type? 'Sort by Continent': 'Sort by Name'}</h5>
              </div>
              <Searchbar className='unit' onChange={(key) => this.setState({ searchKey: key })} />
            </div>
          </div>
          <div className='channel-list'>
            { filteredChannels.map(channel => <ChannelBox key={channel.id}  data={channel} />) }
          </div>
        </div>
        <div className='right-content'>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    countries: state.common.countries,
  }
}

export default compose(
  graphql(qGetChannels, { name: 'channels' } ),
  graphql(qGetHotChannels, { name: 'hotChannels' } ),
  connect(mapStateToProps, { }),
)(Channels);
/*@flow*/

import * as React from 'react';
import _ from 'lodash';

import Icon from '../../components/icon';


type BlockedUser = {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  photo?: string,
  cover_image?: string,
  level: number,
}

type Props = {
  accounts: Array<BlockedUser>,
}

type State = {
  searchKey: string,
}

class BlockBoard extends React.Component<Props, State>{
  state: State = {
    searchKey: '',
  }

  unblock(account: BlockedUser) {
  }

  render(){
    const {
      searchKey,
    } = this.state;

    const {
      accounts,
    } = this.props;

    const filteredAccounts = _.filter(accounts, account => {
      const fullname = `${account.first_name} ${account.last_name}`;
      return !searchKey || account.username.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 || fullname.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 ;
    });

    return(
      <div className='account-board'>
        <div className='search'>
          <Icon name='search' className='icon' size={24} />
          <input
            type='search'
            className='input' 
            placeholder='Search Blocked Accounts...'
            value={searchKey}
            onChange={(event) => this.setState({searchKey: event.target.value}) }/>
        </div>
        <div className='accounts'>
          {filteredAccounts.map(account => (
            <div key={account.id} onClick={() => this.unblock(account)}>
              
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default BlockBoard;
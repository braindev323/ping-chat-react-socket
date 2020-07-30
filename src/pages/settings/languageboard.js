/*@flow*/

import * as React from 'react';
import _ from 'lodash';

import Icon from '../../components/icon';


type Language = {
  id: number,
  name: string,
  native_name: string,
  code: string,
  code2: string,
  code3: string,
}

type Props = {
  languages: Array<Language>,
  current: string,
  onChange: (language: string) => any,
}

type State = {
  searchKey: string,
}

class LanguageBoard extends React.Component<Props, State>{
  state: State = {
    searchKey: '',
  }

  onChange(language: string) {
    const {
      current,
      onChange,
    } = this.props;

    if (language !== current) {
      onChange(language);
    }
  }

  render(){
    const {
      searchKey,
    } = this.state;

    const {
      languages,
      current,
    } = this.props;

    const filteredLanguages = _.filter(languages, language => {
      return !searchKey || language.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 || language.native_name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1 ;
    });

    return(
      <div className='language-board'>
        <div className='search'>
          <Icon name='search' className='icon' size={24} />
          <input
            type='search'
            className='input' 
            placeholder='Search Language...'
            value={searchKey}
            onChange={(event) => this.setState({searchKey: event.target.value}) }/>
        </div>
        <div className='languages'>
          {filteredLanguages.map(language => (
            <div key={language.id} className={`item ${language.code === current? 'active': ''}`} onClick={() => this.onChange(language.code)}>
              <span className='name'>{language.native_name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default LanguageBoard;
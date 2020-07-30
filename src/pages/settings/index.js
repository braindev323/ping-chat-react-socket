/* @flow */

import React from 'react';
// import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import Icon from '../../components/icon';
import Toggle from '../../components/form/toggle';
import Menu from './menu';
import LanguageBoard from './languageboard';
import BlockBoard from './blockboard';
import {
  changeTheme,
} from '../../redux/actions';
import './index.scss';

const SettingMenuData = [
  {title: 'Upgrade to CertifiedPro'},
  {title: 'My Money', children: [{title: 'Withdraw Method'}, {title: 'Account Balance'}]},
  {title: 'Photo Tagging', children: [{title: 'Let Readers Tag You in Photos'}, {title: 'Let Everyone Tag You in Photos'}]},
  {
    title: 'Personalization & Data', 
    children: [
      {title: 'Personalization and Data', description: 'This will enable or disable all personalisation and data settings'},
      {title: 'Personalized Ads'},
      {title: 'Personalize Based On Your Devices'},
      {title: 'Personalize Based On Places you\'ve been'},
      {title: 'Track Where You See Journile Content From Ac ross the Web'},
      {title: 'Share Your Data With Journile\'s Business Partners'},
    ],
  },
  {title: 'Select Language'},
  {title: 'Contacts', children:[{title: 'Sync Contacts With Journile'}, {title: 'Invite Contacts To Join Journile'}]},
  {title: 'Blocked Accounts'},
  {title: 'Muted Accounts'},
  {title: 'Monetise your Content'},
  {title: 'Let Others Find Me by Email Address'},
  {title: 'Let Others Find Me by Phone Number'},
  {title: 'Display Content From CertifiedPro Users Only'},
  {title: 'Family Safe Filter'},
  {title: 'Theme'},
]

const MenuIndex = {
  Upgrade: 0,
  Money: 1,
  PhotoTagging: 2,
  Personalization: 3,
  Language: 4,
  Contacts: 5,
  BlockedAccounts: 6,
  MutedAccounts: 7,
  MonetiseContent: 8,
  FindMeByEmail: 9,
  FindMeByPhoneNumber: 9,
  DisplayOnlyProContent: 10,
  FamilySafe: 10,
  Theme: 11,
}

type State = {
  isLoggedin: boolean,

  paypal_address: string,
  show_balance_in_wallet: boolean,
  reader_tag_photo: boolean,
  all_tag_photo: boolean,
  personalization: boolean,
  personalization_ads: boolean,
  personalization_deivice: boolean,
  personalization_location: boolean,
  personalization_track: boolean,
  personalisation_share_partner: boolean,
  language: string,
  monetize_content: boolean,
  find_by_email: boolean,
  find_by_phonenumber: boolean,
  content_only_pro: boolean,
  famliy_safe: boolean,
  theme: string,
  
  blockedUsers: Array<any>,

  selectedMenu: number,
  searchKey: string,
}

class Settings extends React.Component<any, State> {
  state: State = {
    isLoggedin: false,

    // paypal_address: '',
    // show_balance_in_wallet: false,
    // reader_tag_photo: false,
    // all_tag_photo: false,
    // personalization: false,
    // personalization_ads: false,
    // personalization_deivice: false,
    // personalization_location: false,
    // personalization_track: false,
    // personalisation_share_partner: false,
    // language: 'en',
    // monetize_content: false,
    // find_by_email: false,
    // find_by_phonenumber: false,
    // content_only_pro: false,
    // famliy_safe: false,
    // theme: 'dark',
    ...this.props.settings,

    blockedUsers: this.props.blockedUsers,

    selectedMenu: -1,
    searchKey: '',
  }

  static getDerivedStateFromProps(props: any, state: State) {
    return {
      isLoggedin: props.isLoggedin,
      theme: props.theme,
    }
  }

  onSelectMenu(index: number){
    this.setState({
      selectedMenu: this.state.selectedMenu === index? -1: index,
    })
  }

  checkSearchKey(index: number, subIndex?: number): boolean {
    let { searchKey } = this.state;
    if (!searchKey) return true;

    searchKey = searchKey.toLowerCase();
    if (SettingMenuData[index].title.toLowerCase().indexOf(searchKey) > -1) {
      return true;
    } else {
      if (SettingMenuData[index].children != null) {
        if (subIndex != null) {
          return SettingMenuData[index].children[subIndex].title.toLowerCase().indexOf(searchKey) > -1
        } else {
          const { children } = SettingMenuData[index];
          for (let i=0; i< children.length; i++) {
            if (children[i].title.toLowerCase().indexOf(searchKey) > -1) {
              return true;
            }
          }
      
          return false;
        }
      }
    }

    return false;
  }

  changeLanguage = (language: string) => {
    this.setState({ language });
  }

  toggleTheme = ()=>{
    this.props.changeTheme(this.state.theme === 'dark' ?'light': 'dark')
  }

  render() {
    const {
      isLoggedin,

      // paypal_address,
      show_balance_in_wallet,
      reader_tag_photo,
      all_tag_photo,
      personalization,
      personalization_ads,
      personalization_deivice,
      personalization_location,
      personalization_track,
      personalisation_share_partner,
      language,
      monetize_content,
      find_by_email,
      find_by_phonenumber,
      content_only_pro,
      famliy_safe,

      selectedMenu,
      searchKey,
    } = this.state;

    if (!isLoggedin) {
      return (
        <div className='not-found'>
          <h3>{'Please login to manage your settings'}</h3>
        </div>
      )
    }

    return(
      <div className='settings page'>
        <div className='main-menu'>
          <div className='menu-group'>
            <div className='search'>
              <Icon name='search' className='icon' size={30} />
              <input
                type='search'
                className='input'
                placeholder='Search settings...'
                value={searchKey}
                onChange={(event) => this.setState({searchKey: event.target.value}) }/>
            </div>
            {this.checkSearchKey(MenuIndex.Upgrade) &&
              <Menu icon='guard' title={SettingMenuData[MenuIndex.Upgrade].title} active={selectedMenu === MenuIndex.Upgrade} />
            }
            {this.checkSearchKey(MenuIndex.Money) &&
              <Menu icon='wallet' title={SettingMenuData[MenuIndex.Money].title} active={selectedMenu === 1} onClick={() => this.onSelectMenu(MenuIndex.Money)}>
                {this.checkSearchKey(MenuIndex.Money, 0) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Money].children[0].title}</div>
                    <div className='value'>{`PayPal: Account Ending in ***nile`}</div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.Money, 1) &&
                  <div className='submenu-item'> 
                    <div className='title'>{SettingMenuData[MenuIndex.Money].children[1].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{show_balance_in_wallet? 'Show': 'Hide'}</span>
                      <Toggle value={show_balance_in_wallet} onChange={value => this.setState({show_balance_in_wallet: value})}/>
                    </div>
                  </div>
                }
              </Menu>
            }
            {this.checkSearchKey(MenuIndex.PhotoTagging) &&
              <Menu icon='photo' title={SettingMenuData[MenuIndex.PhotoTagging].title} active={selectedMenu === 2} onClick={() => this.onSelectMenu(MenuIndex.PhotoTagging)}>
                {this.checkSearchKey(MenuIndex.PhotoTagging, 0) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.PhotoTagging].children[0].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{reader_tag_photo? 'Yes': 'No'}</span>
                      <Toggle value={reader_tag_photo} onChange={value => this.setState({reader_tag_photo: value})}/>
                    </div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.PhotoTagging, 1) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.PhotoTagging].children[1].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{all_tag_photo? 'Yes': 'No'}</span>
                      <Toggle value={all_tag_photo} onChange={value => this.setState({all_tag_photo: value})}/>
                    </div>
                  </div>
                }
              </Menu>
            }
            {this.checkSearchKey(MenuIndex.Personalization) &&
              <Menu icon='edit' title={SettingMenuData[MenuIndex.Personalization].title} active={selectedMenu === MenuIndex.Personalization} onClick={() => this.onSelectMenu(MenuIndex.Personalization)}>
                {this.checkSearchKey(MenuIndex.Personalization, 0) &&
                  <div className='submenu-item'>
                    <div className='texts'>
                      <div className='title'>{SettingMenuData[MenuIndex.Personalization].children[0].title}</div>
                      <div className='description'>{SettingMenuData[MenuIndex.Personalization].children[0].description}</div>
                    </div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{personalization? 'Enabled': 'Disabled'}</span>
                      <Toggle value={personalization} onChange={value => this.setState({personalization: value})}/>
                    </div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.Personalization, 1) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Personalization].children[1].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{personalization_ads? 'Yes': 'No'}</span>
                      <Toggle value={personalization_ads} onChange={value => this.setState({personalization_ads: value})} disable={!personalization} />
                    </div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.Personalization, 2) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Personalization].children[2].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{personalization_deivice? 'Yes': 'No'}</span>
                      <Toggle value={personalization_deivice} onChange={value => this.setState({personalization_deivice: value})} disable={!personalization}/>
                    </div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.Personalization, 3) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Personalization].children[3].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{personalization_location? 'Yes': 'No'}</span>
                      <Toggle value={personalization_location} onChange={value => this.setState({personalization_location: value})} disable={!personalization}/>
                    </div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.Personalization, 4) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Personalization].children[4].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{personalization_track? 'Yes': 'No'}</span>
                      <Toggle value={personalization_track} onChange={value => this.setState({personalization_track: value})} disable={!personalization}/>
                    </div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.Personalization, 5) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Personalization].children[5].title}</div>
                    <div className='toggle-wrapper'>
                      <span className='value'>{personalisation_share_partner? 'Yes': 'No'}</span>
                      <Toggle value={personalisation_share_partner} onChange={value => this.setState({personalisation_share_partner: value})} disable={!personalization}/>
                    </div>
                  </div>
                }
              </Menu>
            }
            {this.checkSearchKey(MenuIndex.Language) &&
              <Menu icon='language' title={SettingMenuData[MenuIndex.Language].title} active={selectedMenu === MenuIndex.Language} onClick={() => this.onSelectMenu(MenuIndex.Language)} />
            }
            {this.checkSearchKey(MenuIndex.Contacts) &&
              <Menu icon='profile' title={SettingMenuData[MenuIndex.Contacts].title} active={selectedMenu === MenuIndex.Contacts} onClick={() => this.onSelectMenu(MenuIndex.Contacts)}>
                {this.checkSearchKey(MenuIndex.Contacts, 0) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Contacts].children[0].title}</div>
                    <div className='text-button'>
                      <Icon className='icon' name='sync' size={24}/>
                      <span className='text'>{'Sync With Contacts'}</span>
                    </div>
                  </div>
                }
                {this.checkSearchKey(MenuIndex.Contacts, 1) &&
                  <div className='submenu-item'>
                    <div className='title'>{SettingMenuData[MenuIndex.Contacts].children[1].title}</div>
                    <div className='text-button'>
                      <Icon className='icon' name='add' size={24}/>
                      <span className='text'>{'Invite'}</span>
                    </div>
                  </div>
                }
              </Menu>
            }
            {this.checkSearchKey(MenuIndex.BlockedAccounts) &&
              <Menu icon='block' title={SettingMenuData[MenuIndex.BlockedAccounts].title} active={selectedMenu === MenuIndex.BlockedAccounts} onClick={() => this.onSelectMenu(MenuIndex.BlockedAccounts)}>
              </Menu>
            }
          </div>
          <div className='menu-group'>
            {this.checkSearchKey(MenuIndex.MonetiseContent) &&
              <div className='menu-item'>
                <Icon className='icon' name='dollar_fill' size={30} />
                <span className='title'>{SettingMenuData[MenuIndex.MonetiseContent].title}</span>
                <div className='toggle-wrapper'>
                  <span className='value'>{monetize_content? 'ON': 'OFF'}</span>
                  <Toggle value={monetize_content} onChange={value => this.setState({monetize_content: value})}/>
                </div>
              </div>
            }
            {this.checkSearchKey(MenuIndex.FindMeByEmail) &&
              <div className='menu-item'>
                <Icon className='icon' name='mail_open' size={30} />
                <span className='title'>{SettingMenuData[MenuIndex.FindMeByEmail].title}</span>
                <div className='toggle-wrapper'>
                  <span className='value'>{find_by_email? 'ON': 'OFF'}</span>
                  <Toggle value={find_by_email} onChange={value => this.setState({find_by_email: value})}/>
                </div>
              </div>
            }
            {this.checkSearchKey(MenuIndex.FindMeByPhoneNumber) &&
              <div className='menu-item'>
                <Icon className='icon' name='phone_android' size={30} />
                <span className='title'>{SettingMenuData[MenuIndex.FindMeByPhoneNumber].title}</span>
                <div className='toggle-wrapper'>
                  <span className='value'>{find_by_phonenumber? 'ON': 'OFF'}</span>
                  <Toggle value={find_by_phonenumber} onChange={value => this.setState({find_by_phonenumber: value})}/>
                </div>
              </div>
            }
            {this.checkSearchKey(MenuIndex.DisplayOnlyProContent) &&
              <div className='menu-item'>
                <Icon className='icon' name='guard' size={30} />
                <span className='title'>{SettingMenuData[MenuIndex.DisplayOnlyProContent].title}</span>
                <div className='toggle-wrapper'>
                  <span className='value'>{content_only_pro? 'ON': 'OFF'}</span>
                  <Toggle value={content_only_pro} onChange={value => this.setState({content_only_pro: value})}/>
                </div>
              </div>
            }
            {this.checkSearchKey(MenuIndex.FamilySafe) &&
              <div className='menu-item'>
                <span className='title'>{SettingMenuData[MenuIndex.FamilySafe].title}</span>
                <div className='toggle-wrapper'>
                  <span className='value'>{famliy_safe? 'ON': 'OFF'}</span>
                  <Toggle value={famliy_safe} onChange={value => this.setState({famliy_safe: value})}/>
                </div>
              </div>
            }
          </div>
          {this.checkSearchKey(MenuIndex.Theme) &&
            <div className='menu-item'>
              <span className='title'>{SettingMenuData[MenuIndex.Theme].title}</span>
              <div className='text-button' onClick={this.toggleTheme}>
                <div className='title'>{this.state.theme === 'dark'? 'Dark Mode': 'Light Mode'}</div>
                <Icon className='icon' name={this.state.theme === 'dark'? 'moon': 'sun'} size={24}/>
              </div>
            </div>
          }
        </div>
        <div className='main'>
          {selectedMenu === MenuIndex.Language &&
            <LanguageBoard languages={this.props.languages} current={language} onChange={this.changeLanguage} />
          }
          {selectedMenu === MenuIndex.BlockedAccounts &&
            <BlockBoard accounts={this.props.blockedUsers} />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedin: state.auth.loggedin,
    settings: state.auth.settings,
    languages: state.common.languages,
    blockedUsers: state.auth.blockedUsers,
    mutedUsers: state.auth.mutedUsers,
    theme: state.theme.type,
  }
}

export default connect(mapStateToProps, { changeTheme })(Settings);
/* @flow */

import React from 'react';

import Icon from '../icon';
import './index.scss';


type Props = {
  className?: string,
  items: Array<any>,
  selectedItem?: any,
  renderItem?: (item: any) => React$Element<any>,
  onChange?: (item: any) => any,
};

type State = {
  show: boolean,
  propSelectedItem: any,
  selectedItem: any,
};

export default class Dropdown extends React.Component<Props, State> {
  state: State = {
    show: false,
    propSelectedItem: null,
    selectedItem: null,
  };

  static getDerivedStateFromProps(props: any, state: State) {
    let newState = {
      propSelectedItem: props.selectedItem,
      selectedItem: state.selectedItem || props.selectedItem || props.items[0],
    };

    if (props.selectedItem && props.selectedItem !== state.selectedItem) {
      newState.selectedItem = props.selectedItem;
    }

    return newState;
  }

  dropdown: React.DOM = null;

  componentDidMount() {
    // handles mouse events like click and dblclick
    document.addEventListener('mouseup', this.handleMouseEvent);
    // handles tabbing out of
    this.dropdown.addEventListener('focusout', this.handleBlurEvent);

    this.onChange(this.props.items[0]);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseEvent);
    this.dropdown.removeEventListener('focusout', this.handleBlurEvent);
  }

  hasFocus = (target: any) => {
    // React ref callbacks pass `null` when a component unmounts, so guard against `this.dropdown` not existing
    if (!this.dropdown) {
      return false;
    }
    let dropdownHasFocus = false;
    const nodeIterator = document.createNodeIterator(this.dropdown, NodeFilter.SHOW_ELEMENT);
    let node = nodeIterator.nextNode();
    
    while(node) {
      if (node === target) {
        dropdownHasFocus = true;
        break;
      }
      node = nodeIterator.nextNode();
    }
    
    return dropdownHasFocus;
  }
  
  handleBlurEvent = (e: any) => {
    const dropdownHasFocus = this.hasFocus(e.relatedTarget);
    
    if (!dropdownHasFocus) {
      this.setState({
        show: false
      });
    }    
  }
  
  handleMouseEvent = (e: any) => {
    const dropdownHasFocus = this.hasFocus(e.target);
    
    if (!dropdownHasFocus) {
      this.setState({
        show: false
      });
    }
  }

  toggleDropdown = () => {
    this.setState({
      show: !this.state.show
    });
  }

  defaultRenderItem = (item: string) => {
    return <span>{item}</span>
  }

  onChange(item: any) {
    this.setState({
      show: false,
      selectedItem: item,
    })

    if (this.props.onChange) {
      this.props.onChange(item);
    }
  }
  
  render() {
    let {
      className,
      items,
    } = this.props;

    const {
      show,
      selectedItem,
    } = this.state;

    const renderItem = this.props.renderItem || this.defaultRenderItem;

    return (
      <div className={`dropdown ${className || ''} ${show ? 'show' : ''}`} ref={(dropdown) => this.dropdown = dropdown}>
        <div 
          className='dropdown-toggle'
          data-toggle='dropdown'
          onClick={this.toggleDropdown}>
          <div className='title'>{renderItem(selectedItem)}</div>
          <Icon className='icon-arrow' name={show? 'arrow_up': 'arrow_down'} size={24} />
        </div>
        <ul className='dropdown-wrapper'>
          {items.map((item, index) => <li key={index} className='item' onClick={() => this.onChange(item)}>{renderItem(item)}</li>)}
        </ul>
      </div>
    );
  }
}
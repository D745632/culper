import React from 'react'
import { i18n } from '../../../config'
import ValidationElement from '../ValidationElement'

export default class Help extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      id: this.props.id,
      active: false
    }

    this.handleClick = this.handleClick.bind(this)
  }

  /**
   * Handle the click event.
   */
  handleClick (event) {
    this.setState({ active: !this.state.active })
  }

  getText () {
    return i18n.t(this.state.id)
  }

  children () {
    if (this.props.index) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          ...child.props,
          index: this.props.index
        })
      })
    }

    return this.props.children
  }

  render () {
    if (this.state.active) {
      return (
          <div className="eapp-field-wrap">
            <a href="javascript:;" tabIndex="-1" title="Show help" className="toggle eapp-help-toggle" onClick={this.handleClick}>
              <i className="fa fa-info-circle"></i>
            </a>
            {this.props.children}
            <div className="message eapp-help-message">
              <i className="fa fa-info"></i>
              {this.getText()}
              <a href="javascript:;" tabIndex="-1" className="eapp-help-close" onClick={this.handleClick}>Close info Block</a>
            </div>
          </div>
      )
    }

    return (
        <div className="eapp-field-wrap">
          <a href="javascript:;" tabIndex="-1" title="Show help" className="toggle eapp-help-toggle" onClick={this.handleClick}>
            <i className="fa fa-info-circle"></i>
          </a>
          {this.props.children}
        </div>
    )
  }
}

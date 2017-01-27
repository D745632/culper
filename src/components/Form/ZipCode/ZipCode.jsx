import React from 'react'
import ValidationElement from '../ValidationElement'
import Text from '../Text'

export default class ZipCode extends ValidationElement {
  constructor (props) {
    super(props)

    this.state = {
      name: props.name,
      label: props.label,
      placeholder: props.placeholder,
      help: props.help,
      required: props.required,
      value: props.value,
      error: props.error || false,
      valid: props.valid || false
    }
  }

  /**
   * Handle the change event.
   */
  handleChange (event) {
    this.setState({ value: event.target.value }, () => {
      super.handleChange(event)
    })
  }

  /**
   * Handle the validation event.
   */
  handleValidation (event, status) {
    this.setState({error: status === false, valid: status === true}, () => {
      super.handleValidation(event, status)
    })
  }

  /**
   * Handle the focus event.
   */
  handleFocus (event) {
    this.setState({ focus: true }, () => {
      super.handleFocus(event)
    })
  }

  /**
   * Handle the blur event.
   */
  handleBlur (event) {
    this.setState({ focus: false }, () => {
      super.handleBlur(event)
    })
  }

  render () {
    return (
      <Text name={this.state.name}
            label={this.state.label}
            placeholder={this.state.placeholder}
            help={this.state.help}
            className={this.props.className}
            minlength="5"
            maxlength="10"
            pattern="^\d{5}(?:[-\s]\d{4})?$"
            required="true"
            value={this.state.value}
            error={this.state.error}
            valid={this.state.valid}
            onChange={this.handleChange}
            onValidate={this.handleValidation}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            />
    )
  }
}

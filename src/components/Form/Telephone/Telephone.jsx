import React from 'react'
import { i18n } from '../../../config'
import ValidationElement from '../ValidationElement'
import Text from '../Text'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import RadioGroup from '../RadioGroup'
import Show from '../Show'

const defaultNumbers = {
  domestic: {
    first: '',
    second: '',
    third: '',
  },
  international: {
    first: '',
  },
}

const padleft = (str, len, char = ' ') => {
  let padding = ''
  for (let i = 0; i < len; i += 1) {
    padding += char
  }
  return padding.substring(0, padding.length - str.length) + str
}

const trimleading = str => (
  (str || '').trim()
)

const digitsOnly = (value = '') => {
  if (!value.match(/^(\s*|\d+)$/)) {
    return value.replace(/\D/g, '')
  }

  return value
}

export default class Telephone extends ValidationElement {
  constructor(props) {
    super(props)

    this.state = {
      uid: `${this.props.name}-${super.guid()}`,
      domestic: {
        first: this.parseNumber(0, 3, props.number),
        second: this.parseNumber(3, 6, props.number),
        third: this.parseNumber(6, 10, props.number),
      },
      international: {
        first: props.number,
      },
    }
    this.domestic = this.domestic.bind(this)
    this.international = this.international.bind(this)
    this.errors = []
  }

  parseNumber = (start, end, number) => {
    if (!number) {
      return ''
    }
    return number.substring(start, end)
  }

  update = (queue) => {
    this.props.onUpdate({
      name: this.props.name,
      timeOfDay: this.props.showTimeOfDay ? this.props.timeOfDay : 'NA',
      type: this.props.type || 'Domestic',
      numberType: this.props.numberType,
      number: this.getFormattedNumber(),
      extension: this.props.extension,
      noNumber: this.props.noNumber || false,
      ...queue,
    })
  }

  updateNumber = (type) => {
    this.update({
      type,
      noNumber: false,
    })
  }

  updateToggleDomestic = () => {
    this.setState({
      ...defaultNumbers,
    }, () => {
      this.updateNumber('Domestic')
    })
  }

  updateToggleInternational = () => {
    this.setState({
      ...defaultNumbers,
    }, () => {
      this.updateNumber('International')
    })
  }

  updateDomesticNumber = (values) => {
    const fieldNameMap = {
      domestic_first: 'first',
      domestic_second: 'second',
      domestic_third: 'third',
    }

    this.setState(prevState => ({
      domestic: {
        ...prevState.domestic,
        [fieldNameMap[values.name]]: values.value,
      },
    }), () => {
      this.updateNumber('Domestic')
    })
  }

  updateInternationalNumber = (values) => {
    const fieldNameMap = {
      int_first: 'first',
    }

    this.setState(prevState => ({
      international: {
        ...prevState.international,
        [fieldNameMap[values.name]]: values.value,
      },
    }), () => {
      this.updateNumber('International')
    })
  }

  updateExtension = (values) => {
    this.update({
      extension: values.value,
    })
  }

  updateNoNumber = () => {
    this.setState({
      ...defaultNumbers,
    }, () => {
      this.update({
        noNumber: !this.props.noNumber,
        timeOfDay: this.props.noNumber ? 'Both' : '',
        numberType: '',
        extension: '',
      })
    })
  }

  updateTimeOfDay = (values) => {
    this.update({
      timeOfDay: values.value,
    })
  }

  updateNumberType = (values) => {
    this.update({
      numberType: values.value,
    })
  }

  getFormattedNumber = () => {
    switch (this.props.type) {
      case 'Domestic':
        return [
          padleft(this.state.domestic.first, 3),
          padleft(this.state.domestic.second, 3),
          padleft(this.state.domestic.third, 4),
        ]
          .join('')
          .trim()
      case 'International':
        return this.state.international.first.trim()
      default:
        return ''
    }
  }

  handleErrorDomesticFirst = (value, arr) => (
    this.handleErrorDomestic('first', value, arr)
  )

  handleErrorDomesticSecond = (value, arr) => (
    this.handleErrorDomestic('second', value, arr)
  )

  handleErrorDomesticThird = (value, arr) => (
    this.handleErrorDomestic('third', value, arr)
  )

  handleErrorDomesticExtension = (value, arr) => (
    this.handleErrorDomestic('extension', value, arr)
  )

  handleErrorDomestic = (code, value, arr) => (
    this.handleError(`domestic.${code}`, value, arr)
  )

  handleErrorInternationalFirst = (value, arr) => (
    this.handleErrorInternational('first', value, arr)
  )

  handleErrorInternationalExtension = (value, arr) => (
    this.handleErrorInternational('extension', value, arr)
  )

  handleErrorInternational = (code, value, arr) => (
    this.handleError(`international.${code}`, value, arr)
  )

  handleErrorNoNumber = (value, arr) => (
    this.handleError('none', value, arr)
  )

  handleErrorTime = (value, arr) => (
    this.handleError('time', value, arr)
  )

  handleErrorType = (value, arr) => (
    this.handleError('type', value, arr)
  )

  handleErrorNumberType = (value, arr) => (
    this.handleError('numberType', value, arr)
  )

  handleError = (code, value, arr) => {
    const localErr = arr.map(err => ({
      code: `telephone.${code}.${err.code}`,
      valid: err.valid,
      uid: err.uid,
    }))

    // Replace errors with new values
    for (const err of localErr) {
      const idx = this.errors.findIndex(x => x.code === err.code)
      if (idx > -1) {
        this.errors[idx] = err
      } else {
        this.errors.push(err)
      }
    }

    // Nullify unused codes
    const allowedTypes = ['Domestic', 'International']
    allowedTypes
      .filter(x => x !== (this.props.type || 'Domestic'))
      .forEach((x) => {
        this.errors
          .filter(err => err.code.indexOf(`telephone.${x.toLowerCase()}.`) > -1)
          .forEach((err) => {
            err.valid = null
          })
      })

    // Zero out any required fields if IDK is selected
    if (code === 'none' && value === true) {
      this.errors
        .filter(err => err.code.indexOf('.required') > -1)
        .forEach((err) => {
          err.valid = true
        })
    }

    // Run the entire component through it's own error checks as a whole
    const requiredErr = this.errors.concat(
      this.constructor.errors.map((err) => {
        const errProps = {
          ...this.props,
          ...this.state,
        }
        if (code === 'none') {
          errProps.noNumber = value
        }

        return {
          code: `telephone.${err.code}`,
          valid: err.func(value, errProps),
          uid: this.state.uid,
        }
      })
    )

    // Take the original and concatenate our new error values to it
    this.props.onError(value, requiredErr)
    return localErr
  }

  domestic() {
    return (
      <div className="numbers">
        <label
          className={[
            `${this.props.typeClass || ''}`,
            `${this.props.noNumber ? 'disabled' : ''}`,
          ].join(' ').trim()}
        >
          {i18n.t('telephone.domestic.label')}
        </label>
        <div className="telephone-number-fields">
          <div className="telephone-number-fields-main">
            <span className="separator">(</span>
            <Text
              name="domestic_first"
              ref="domestic_first"
              className="number three"
              label=""
              ariaLabel={i18n.t('telephone.aria.domesticAreaCode')}
              disabled={this.props.noNumber}
              maxlength="3"
              pattern="^((?!(0))\d{3})"
              prefilter={digitsOnly}
              readonly={this.props.readonly}
              required={this.required('Domestic')}
              value={trimleading(this.state.domestic.first)}
              onUpdate={this.updateDomesticNumber}
              onError={this.handleErrorDomesticFirst}
              tabNext={() => {
                this.props.tab(this.refs.domestic_second.refs.text.refs.input)
              }}
            />
            <span className="separator">)</span>
            <Text
              name="domestic_second"
              ref="domestic_second"
              className="number three"
              label=""
              ariaLabel={i18n.t('telephone.aria.domesticThree')}
              disabled={this.props.noNumber}
              maxlength="3"
              pattern="\d{3}"
              prefilter={digitsOnly}
              readonly={this.props.readonly}
              required={this.required('Domestic')}
              value={trimleading(this.state.domestic.second)}
              onUpdate={this.updateDomesticNumber}
              onError={this.handleErrorDomesticSecond}
              tabBack={() => {
                this.props.tab(this.refs.domestic_first.refs.text.refs.input)
              }}
              tabNext={() => {
                this.props.tab(this.refs.domestic_third.refs.text.refs.input)
              }}
            />
            <span className="separator">-</span>
            <Text
              name="domestic_third"
              ref="domestic_third"
              className="number four"
              label=""
              ariaLabel={i18n.t('telephone.aria.domesticFour')}
              disabled={this.props.noNumber}
              minlengh="4"
              maxlength="4"
              pattern="\d{4}"
              prefilter={digitsOnly}
              readonly={this.props.readonly}
              required={this.required('Domestic')}
              value={trimleading(this.state.domestic.third)}
              onUpdate={this.updateDomesticNumber}
              onError={this.handleErrorDomesticThird}
              tabBack={() => {
                this.props.tab(this.refs.domestic_second.refs.text.refs.input)
              }}
              tabNext={() => {
                this.props.tab(this.refs.domestic_extension.refs.text.refs.input)
              }}
            />
          </div>
          <div className="telephone-number-fields-extension">
            <span className="separator pound">#</span>
            <Text
              name="domestic_extension"
              ref="domestic_extension"
              className="number six"
              label={i18n.t('telephone.domestic.extension.label')}
              ariaLabel={i18n.t('telephone.aria.extension')}
              disabled={this.props.noNumber}
              maxlength="10"
              pattern="^\d{0,10}$"
              prefilter={digitsOnly}
              readonly={this.props.readonly}
              required={false}
              value={this.props.extension}
              onUpdate={this.updateExtension}
              onError={this.handleErrorDomesticExtension}
              tabBack={() => {
                this.props.tab(this.refs.domestic_third.refs.text.refs.input)
              }}
            />
          </div>
          <div className="telephone-number-fields-na">
            <span
              className={
                this.props.allowNotApplicable ? 'separator extension' : 'hidden'
              }
            >
              or
            </span>
            <Checkbox
              name="nonumber"
              className={this.props.allowNotApplicable ? 'nonumber' : 'hidden'}
              label={i18n.t('telephone.noNumber.label')}
              value="NA"
              checked={this.props.noNumber}
              onUpdate={this.updateNoNumber}
              onError={this.handleErrorNoNumber}
            />
          </div>
        </div>
      </div>
    )
  }

  international() {
    return (
      <div className="international numbers">
        <label
          className={[
            `${this.props.typeClass || ''}`,
            `${this.props.noNumber ? 'disabled' : ''}`,
          ].join(' ').trim()}
        >
          {i18n.t('telephone.international.label')}
        </label>
        <div className="telephone-number-fields-main">
          <span className="separator">+</span>
          <Text
            name="int_first"
            ref="int_first"
            className="number ten"
            label=""
            ariaLabel={i18n.t('telephone.aria.phoneNumber')}
            disabled={this.props.noNumber}
            maxlength="20"
            pattern="\d{4,20}"
            prefilter={digitsOnly}
            readonly={this.props.readonly}
            required={this.required('International')}
            value={trimleading(this.state.international.first)}
            onUpdate={this.updateInternationalNumber}
            onError={this.handleErrorInternationalFirst}
            tabNext={() => {
              this.props.tab(this.refs.int_extension.refs.text.refs.input)
            }}
          />
        </div>
        <div className="telephone-number-fields-extension">
          <span className="separator pound">#</span>
          <Text
            name="int_extension"
            ref="int_extension"
            className="number six"
            label={i18n.t('telephone.international.extension.label')}
            ariaLabel={i18n.t('telephone.aria.extension')}
            disabled={this.props.noNumber}
            maxlength="10"
            pattern="^\d{0,10}$"
            prefilter={digitsOnly}
            readonly={this.props.readonly}
            required={false}
            value={this.props.extension}
            onUpdate={this.updateExtension}
            onError={this.handleErrorInternationalExtension}
            tabBack={() => {
              this.props.tab(this.refs.int_first.refs.text.refs.input)
            }}
          />
        </div>
        <div className="telephone-number-fields-na">
          <span
            className={
              this.props.allowNotApplicable ? 'separator extension' : 'hidden'
            }
          >
            or
          </span>
          <Checkbox
            name="nonumber"
            className={this.props.allowNotApplicable ? 'nonumber' : 'hidden'}
            label={i18n.t('telephone.noNumber.label')}
            value="NA"
            checked={this.props.noNumber}
            onUpdate={this.updateNoNumber}
            onError={this.handleErrorNoNumber}
          />
        </div>
      </div>
    )
  }

  required = (type) => {
    if (type && type !== (this.props.type || 'Domestic')) {
      return false
    }

    if (this.props.allowNotApplicable && this.props.noNumber) {
      return false
    }

    return this.props.required
  }

  render() {
    const klass = `telephone ${this.props.className || ''}`.trim()
    const phoneType = this.props.type || 'Domestic'
    return (
      <div className={klass}>
        <Show when={this.props.label}>
          <span>{this.props.label}</span>
        </Show>
        <div className="type screen-only">
          Switch to:
          <Show when={phoneType !== 'Domestic'}>
            <span className="type">
              <button
                type="button"
                className="domestic-number link"
                onClick={this.updateToggleDomestic}
                title={i18n.t('telephone.aria.domestic')}
                aria-label={i18n.t('telephone.aria.domestic')}
              >
                {i18n.t('telephone.type.domestic')}
              </button>
            </span>
          </Show>
          <Show when={phoneType !== 'International'}>
            <span className="type">
              <button
                type="button"
                className="international-number link"
                onClick={this.updateToggleInternational}
                title={i18n.t('telephone.aria.international')}
                aria-label={i18n.t('telephone.aria.international')}
              >
                {i18n.t('telephone.type.international')}
              </button>
            </span>
          </Show>
        </div>

        <Show when={phoneType === 'Domestic'}>{this.domestic()}</Show>

        <Show when={phoneType === 'International'}>{this.international()}</Show>

        <Show when={this.props.showTimeOfDay}>
          <div className="timeofday">
            <RadioGroup
              selectedValue={this.props.timeOfDay}
              name="timeofday"
              disabled={this.props.noNumber}
            >
              <Radio
                native
                className="time day"
                label={i18n.t('telephone.timeOfDay.day')}
                value="Day"
                ariaLabel={i18n.t('telephone.aria.day')}
                disabled={this.props.noNumber}
                onUpdate={this.updateTimeOfDay}
                onError={this.handleErrorTime}
              />
              <Radio
                native
                className="time night"
                label={i18n.t('telephone.timeOfDay.night')}
                value="Night"
                ariaLabel={i18n.t('telephone.aria.night')}
                disabled={this.props.noNumber}
                onUpdate={this.updateTimeOfDay}
                onError={this.handleErrorTime}
              />
              <Radio
                native
                className="time both"
                label={i18n.t('telephone.timeOfDay.both')}
                value="Both"
                ariaLabel={i18n.t('telephone.aria.both')}
                disabled={this.props.noNumber}
                onUpdate={this.updateTimeOfDay}
                onError={this.handleErrorTime}
              />
            </RadioGroup>
          </div>
        </Show>

        <Show when={this.props.showNumberType}>
          <div
            className={`phonetype ${
              this.props.noNumber ? 'disabled' : ''
              }`.trim()}
          >
            <label>{i18n.t('telephone.numberType.title')}</label>
            <RadioGroup
              selectedValue={this.props.numberType}
              required={this.required()}
              disabled={this.props.noNumber}
            >
              <Radio
                name="numbertype-cell"
                className="phonetype-option cell"
                label={i18n.t('telephone.numberType.cell')}
                value="Cell"
                ariaLabel={i18n.t('telephone.aria.cell')}
                disabled={this.props.noNumber}
                onUpdate={this.updateNumberType}
                onError={this.handleErrorNumberType}
              />
              <Radio
                name="numbertype-home"
                className="phonetype-option home"
                label={i18n.t('telephone.numberType.home')}
                value="Home"
                ariaLabel={i18n.t('telephone.aria.home')}
                disabled={this.props.noNumber}
                onUpdate={this.updateNumberType}
                onError={this.handleErrorNumberType}
              />
              <Radio
                name="numbertype-work"
                className="phonetype-option work"
                label={i18n.t('telephone.numberType.work')}
                value="Work"
                ariaLabel={i18n.t('telephone.aria.work')}
                disabled={this.props.noNumber}
                onUpdate={this.updateNumberType}
                onError={this.handleErrorNumberType}
              />
            </RadioGroup>
          </div>
        </Show>
      </div>
    )
  }
}

Telephone.defaultProps = {
  name: 'telephone',
  value: '',
  type: 'Domestic',
  typeClass: '',
  numberType: '',
  timeOfDay: 'Both',
  number: '',
  extension: '',
  noNumber: false,
  showNumberType: false,
  showTimeOfDay: true,
  allowNotApplicable: true,
  tab: (input) => {
    input.focus()
  },
  onUpdate: () => { },
  onError: (value, arr) => arr,
}

Telephone.errors = [
  {
    code: 'required',
    func: (value, props) => {
      if (props.required) {
        if (props.allowNotApplicable && props.noNumber) {
          return true
        }

        if (props.showNumberType && !props.numberType) {
          return false
        }

        switch (props.type) {
          case 'Domestic':
            return (
              !!props.domestic.first
              && !!props.domestic.second
              && !!props.domestic.third
            )
          case 'International':
            return !!props.international.first
          default:
            return false
        }
      }

      return true
    },
  },
]

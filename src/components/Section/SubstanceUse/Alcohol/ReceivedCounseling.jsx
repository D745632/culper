import React from 'react'
import { i18n } from '../../../../config'
import { validDate } from '../../History/dateranges'
import {
  Location,
  DateControl,
  Checkbox,
  Text,
  ValidationElement,
  Field,
  Textarea,
  Branch,
  Show
} from '../../../Form'

export default class ReceivedCounseling extends ValidationElement {
  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
    this.updateTreatmentProviderName = this.updateTreatmentProviderName.bind(
      this
    )
    this.updateTreatmentProviderAddress = this.updateTreatmentProviderAddress.bind(
      this
    )
    this.updateAgencyName = this.updateAgencyName.bind(this)
    this.updateAgencyAddress = this.updateAgencyAddress.bind(this)
    this.updateUseSameAddress = this.updateUseSameAddress.bind(this)
    this.updateTreatmentBeganDate = this.updateTreatmentBeganDate.bind(this)
    this.updateTreatmentEndDate = this.updateTreatmentEndDate.bind(this)
    this.updatePresentTreatmentEndDate = this.updatePresentTreatmentEndDate.bind(
      this
    )
    this.updateCompletedTreatment = this.updateCompletedTreatment.bind(this)
    this.updateNoCompletedTreatmentExplanation = this.updateNoCompletedTreatmentExplanation.bind(
      this
    )
  }

  update(updateValues) {
    if (this.props.onUpdate) {
      this.props.onUpdate({
        CounselingDates: this.props.CounselingDates,
        TreatmentProviderName: this.props.TreatmentProviderName,
        TreatmentProviderAddress: this.props.TreatmentProviderAddress,
        AgencyName: this.props.AgencyName,
        AgencyAddress: this.props.AgencyAddress,
        UseSameAddress: this.props.UseSameAddress,
        TreatmentBeganDate: this.props.TreatmentBeganDate,
        TreatmentEndDate: this.props.TreatmentEndDate,
        PresentTreatmentEndDate: this.props.PresentTreatmentEndDate,
        CompletedTreatment: this.props.CompletedTreatment,
        NoCompletedTreatmentExplanation: this.props
          .NoCompletedTreatmentExplanation,
        ...updateValues
      })
    }
  }

  updateTreatmentProviderName(values) {
    this.update({ TreatmentProviderName: values })
  }

  updateTreatmentProviderAddress(values) {
    this.update({ TreatmentProviderAddress: values })
  }

  updateCompletedTreatment(values) {
    this.update({ CompletedTreatment: values })
  }

  updateNoCompletedTreatmentExplanation(values) {
    this.update({ NoCompletedTreatmentExplanation: values })
  }

  updateAgencyName(values) {
    this.update({ AgencyName: values })
  }

  updateTreatmentBeganDate(values) {
    this.update({
      TreatmentBeganDate: values
    })
  }

  updateTreatmentEndDate(values) {
    this.update({
      TreatmentEndDate: values
    })
  }

  updatePresentTreatmentEndDate(values) {
    const checked = values.checked
    let endDate

    if (checked) {
      const date = new Date()
      endDate = {
        estimated: false,
        month: String(date.getMonth() + 1),
        year: String(date.getFullYear()),
        day: String(date.getDate())
      }
    } else {
      endDate = {
        year: '',
        month: '',
        day: '',
        estimated: false
      }
    }

    this.update({ TreatmentEndDate: endDate, PresentTreatmentEndDate: values })
  }

  updateAgencyAddress(values) {
    this.update({ AgencyAddress: values })
  }

  updateUseSameAddress(values) {
    this.update({ UseSameAddress: values })
  }

  render() {
    const date = new Date()
    const maxDate = validDate(this.props.TreatmentEndDate)
      ? this.props.TreatmentEndDate
      : {
          month: `${date.getMonth() + 1}`,
          day: `${date.getDate()}`,
          year: `${date.getFullYear()}`
        }
    const minDate = this.props.TreatmentBeganDate
    return (
      <div className="received-counseling">
        <Field
          title={i18n.t(
            'substance.alcohol.receivedCounseling.heading.treatmentProviderName'
          )}
          scrollIntoView={this.props.scrollIntoView}>
          <Text
            name="TreatmentProviderName"
            className="treatment-provider-name"
            {...this.props.TreatmentProviderName}
            onUpdate={this.updateTreatmentProviderName}
            onError={this.props.onError}
            required={this.props.required}
          />
        </Field>
        <Field
          title={i18n.t(
            'substance.alcohol.receivedCounseling.heading.treatmentProviderAddress'
          )}
          optional={true}
          help={
            'substance.alcohol.receivedCounseling.help.treatmentProviderAddress'
          }
          adjustFor="address"
          scrollIntoView={this.props.scrollIntoView}>
          <Location
            name="TreatmentProviderAddress"
            className="provider-address"
            {...this.props.TreatmentProviderAddress}
            layout={Location.ADDRESS}
            geocode={true}
            showPostOffice={true}
            onUpdate={this.updateTreatmentProviderAddress}
            onError={this.props.onError}
            required={this.props.required}
          />
        </Field>

        <Field
          title={i18n.t(
            'substance.alcohol.receivedCounseling.heading.agencyName'
          )}
          scrollIntoView={this.props.scrollIntoView}>
          <Text
            name="AgencyName"
            className="agency-name"
            {...this.props.AgencyName}
            onUpdate={this.updateAgencyName}
            onError={this.props.onError}
            required={this.props.required}
          />
        </Field>

        <Branch
          name="UseSameAddress"
          label={i18n.t(
            'substance.alcohol.receivedCounseling.heading.agencyAddress'
          )}
          labelSize="h4"
          help={'substance.alcohol.receivedCounseling.help.agencyAddress'}
          className={`use-same-address ${
            this.props.UseSameAddress === 'No' ? 'no-margin-bottom' : ''
          }`.trim()}
          yesLabel="Same as above"
          noLabel="Different address"
          {...this.props.UseSameAddress}
          onUpdate={this.updateUseSameAddress}
          required={this.props.required}
          onError={this.props.onError}
          scrollIntoView={this.props.scrollIntoView}
        />

        <Show when={this.props.UseSameAddress.value === 'No'}>
          <Field optional={true} scrollIntoView={this.props.scrollIntoView}>
            <Location
              name="AgencyAddress"
              className="agency-address"
              {...this.props.AgencyAddress}
              layout={Location.ADDRESS}
              geocode={true}
              showPostOffice={true}
              onUpdate={this.updateAgencyAddress}
              required={this.props.required}
              onError={this.props.onError}
            />
          </Field>
        </Show>

        <Field
          title={i18n.t(
            'substance.alcohol.receivedCounseling.heading.treatmentBeganDate'
          )}
          help={'substance.alcohol.receivedCounseling.help.treatmentBeganDate'}
          adjustFor="datecontrol"
          scrollIntoView={this.props.scrollIntoView}>
          <DateControl
            name="TreatmentBeganDate"
            className="treatment-began-date"
            {...this.props.TreatmentBeganDate}
            prefix="treatment.began"
            minDateEqualTo={true}
            maxDate={maxDate}
            onUpdate={this.updateTreatmentBeganDate}
            required={this.props.required}
            onError={this.props.onError}
          />
        </Field>

        <Field
          title={i18n.t(
            'substance.alcohol.receivedCounseling.heading.treatmentEndDate'
          )}
          help={'substance.alcohol.receivedCounseling.help.treatmentEndDate'}
          adjustFor="datecontrol"
          scrollIntoView={this.props.scrollIntoView}>
          <DateControl
            name="TreatmentEndDate"
            className="treatment-end-date"
            {...this.props.TreatmentEndDate}
            prefix="treatment.end"
            minDate={minDate}
            minDateEqualTo={true}
            disabled={(this.props.PresentTreatmentEndDate || {}).checked}
            onUpdate={this.updateTreatmentEndDate}
            onError={this.props.onError}
            required={this.props.required}
          />
          <div className="from-present">
            <span className="or"> or </span>
          </div>
          <div className="from-present">
            <Checkbox
              name="PresentTreatmentEndDate"
              className="present-treatment-end-date"
              {...this.props.PresentTreatmentEndDate}
              label="Present"
              value="present"
              onUpdate={this.updatePresentTreatmentEndDate}
              onError={this.props.onError}
            />
          </div>
        </Field>

        <Branch
          name="CompletedTreatment"
          label={i18n.t(
            'substance.alcohol.receivedCounseling.heading.completedTreatment'
          )}
          labelSize="h4"
          className="completed-treatment no-margin-bottom"
          {...this.props.CompletedTreatment}
          onUpdate={this.updateCompletedTreatment}
          required={this.props.required}
          onError={this.props.onError}
          scrollIntoView={this.props.scrollIntoView}
        />

        <Show
          when={['Yes', 'No'].includes(this.props.CompletedTreatment.value)}>
          <Field
            title={i18n.t(
              'substance.alcohol.receivedCounseling.heading.noCompletedTreatment'
            )}
            titleSize="label"
            scrollIntoView={this.props.scrollIntoView}>
            <Textarea
              name="NoCompletedTreatmentExplanation"
              className="no-completed-treatment"
              {...this.props.NoCompletedTreatmentExplanation}
              onUpdate={this.updateNoCompletedTreatmentExplanation}
              onError={this.props.onError}
              required={this.props.required}
            />
          </Field>
        </Show>
      </div>
    )
  }
}

ReceivedCounseling.defaultProps = {
  UseSameAddress: {},
  CompletedTreatment: {},
  onError: (value, arr) => {
    return arr
  }
}

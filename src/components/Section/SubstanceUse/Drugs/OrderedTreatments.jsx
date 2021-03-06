import React from 'react'

import i18n from 'util/i18n'
import { Accordion, Branch, Show } from 'components/Form'
import { Summary, DateSummary } from 'components/Summary'

import {
  SUBSTANCE_USE,
  SUBSTANCE_USE_DRUGS_ORDERED,
} from 'config/formSections/substanceUse'
import * as formConfig from 'config/forms'
import { getNumberOfYearsString } from 'helpers/text'

import Subsection from 'components/Section/shared/Subsection'
import connectSubsection from 'components/Section/shared/SubsectionConnector'
import OrderedTreatment from './OrderedTreatment'

const sectionConfig = {
  key: SUBSTANCE_USE_DRUGS_ORDERED.key,
  section: SUBSTANCE_USE.name,
  store: SUBSTANCE_USE.store,
  subsection: SUBSTANCE_USE_DRUGS_ORDERED.name,
  storeKey: SUBSTANCE_USE_DRUGS_ORDERED.storeKey,
}

export class OrderedTreatments extends Subsection {
  constructor(props) {
    super(props)

    const {
      section, subsection, store, storeKey,
    } = sectionConfig

    this.section = section
    this.subsection = subsection
    this.store = store
    this.storeKey = storeKey
  }

  update = (updateValues) => {
    this.props.onUpdate(this.storeKey, {
      TreatmentOrdered: this.props.TreatmentOrdered,
      List: this.props.List,
      ...updateValues,
    })
  }

  updateList = (values) => {
    this.update({
      List: values,
    })
  }

  updateTreatmentOrdered = (values) => {
    this.update({
      TreatmentOrdered: values,
      List: values.value === 'Yes' ? this.props.List : [],
    })
  }

  summary = (item, index) => {
    const o = (item || {}).Item || {}
    const range = DateSummary(o.TreatmentDates)
    const explanation = (o.Explanation || {}).value

    return Summary({
      type: i18n.t('substance.drugs.ordered.collection.itemType'),
      index,
      left: explanation,
      right: range,
      placeholder: i18n.t('substance.drugs.ordered.collection.summary'),
    })
  }

  render() {
    const { formType, errors } = this.props
    const formTypeConfig = formType && formConfig[formType]
    const years = formTypeConfig && formTypeConfig.SUBSTANCE_DRUG_TREATMENT_YEARS

    let branchLabelCopy
    if (years === 'EVER') {
      branchLabelCopy = i18n.t('substance.drugs.heading.orderedTreatmentsEver')
    } else {
      const numberOfYearsString = getNumberOfYearsString(years)
      branchLabelCopy = i18n.t('substance.drugs.heading.orderedTreatments', { numberOfYearsString })
    }

    const accordionErrors = errors && errors.filter(e => e.indexOf('List.accordion') === 0)

    return (
      <div
        className="section-content ordered-treatments"
        data-section={SUBSTANCE_USE.key}
        data-subsection={SUBSTANCE_USE_DRUGS_ORDERED.key}
      >
        <h1 className="section-header">{i18n.t('substance.subsection.drugs.ordered')}</h1>
        <Branch
          name="TreatmentOrdered"
          label={branchLabelCopy}
          labelSize="h4"
          className="treatment-ordered"
          {...this.props.TreatmentOrdered}
          warning={true}
          onError={this.handleError}
          required={this.props.required}
          onUpdate={this.updateTreatmentOrdered}
          scrollIntoView={this.props.scrollIntoView}
        />

        <Show when={this.props.TreatmentOrdered.value === 'Yes'}>
          <Accordion
            defaultState={this.props.defaultState}
            {...this.props.List}
            scrollToBottom={this.props.scrollToBottom}
            summary={this.summary}
            onUpdate={this.updateList}
            onError={this.handleError}
            errors={accordionErrors}
            description={i18n.t('substance.drugs.ordered.collection.description')}
            appendTitle={i18n.t('substance.drugs.ordered.collection.appendTitle')}
            appendLabel={i18n.t('substance.drugs.ordered.collection.appendLabel')}
            required={this.props.required}
            scrollIntoView={this.props.scrollIntoView}
          >
            <OrderedTreatment
              name="Item"
              bind={true}
              addressBooks={this.props.addressBooks}
              dispatch={this.props.dispatch}
              required={this.props.required}
              scrollIntoView={this.props.scrollIntoView}
            />
          </Accordion>
        </Show>
      </div>
    )
  }
}

OrderedTreatments.defaultProps = {
  TreatmentOrdered: {},
  List: { items: [], branch: {} },
  onError: (value, arr) => arr,
  section: 'substance',
  subsection: 'drugs/ordered',
  addressBooks: {},
  dispatch: () => {},
  scrollToBottom: '',
  errors: [],
}

export default connectSubsection(OrderedTreatments, sectionConfig)

import React from 'react'

import i18n from 'util/i18n'
import { Summary, DateSummary } from 'components/Summary'
import { Accordion, Branch, Show } from 'components/Form'

import {
  LEGAL,
  LEGAL_INVESTIGATIONS_REVOKED,
} from 'config/formSections/legal'
import * as formConfig from 'config/forms'
import { getNumberOfYearsString } from 'helpers/text'

import Subsection from 'components/Section/shared/Subsection'
import connectSubsection from 'components/Section/shared/SubsectionConnector'
import RevokedItem from './RevokedItem'

const sectionConfig = {
  key: LEGAL_INVESTIGATIONS_REVOKED.key,
  section: LEGAL.name,
  store: LEGAL.store,
  subsection: LEGAL_INVESTIGATIONS_REVOKED.name,
  storeKey: LEGAL_INVESTIGATIONS_REVOKED.storeKey,
}

export class Revoked extends Subsection {
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

  update = (queue) => {
    this.props.onUpdate(this.storeKey, {
      List: this.props.List,
      HasRevocations: this.props.HasRevocations,
      ...queue,
    })
  }

  updateList = (values) => {
    this.update({
      List: values,
    })
  }

  updateBranch = (values) => {
    this.update({
      HasRevocations: values,
      List: values.value === 'Yes' ? this.props.List : [],
    })
  }

  summary = (item, index) => {
    const o = (item && item.Item) || {}
    const dates = DateSummary(o.Date)
    const agency = (o.Agency || {}).value || ''

    return Summary({
      type: i18n.t('legal.investigations.revoked.collection.item'),
      index,
      left: agency,
      right: dates,
      placeholder: i18n.t('legal.investigations.revoked.collection.unknown'),
    })
  }

  render() {
    const { formType, errors } = this.props
    const formTypeConfig = formType && formConfig[formType]
    const years = formTypeConfig && formTypeConfig.LEGAL_INVESTIGATED_DENIED_CLEARANCE_YEARS
    const numberOfYearsString = getNumberOfYearsString(years)

    const accordionErrors = errors && errors.filter(e => e.indexOf('List.accordion') === 0)

    const titleCopy = years === 'EVER'
      ? i18n.t('legal.investigations.revoked.heading.titleEver')
      : i18n.t('legal.investigations.revoked.heading.title', { numberOfYearsString })

    return (
      <div
        className="section-content investigations-revoked"
        data-section={LEGAL.key}
        data-subsection={LEGAL_INVESTIGATIONS_REVOKED.key}
      >
        <h1 className="section-header">{i18n.t('legal.subsection.investigations.revoked')}</h1>
        <Branch
          name="has_revoked"
          label={titleCopy}
          labelSize="h4"
          className="legal-investigations-revoked-has-revocations"
          {...this.props.HasRevocations}
          warning={true}
          onError={this.handleError}
          required={this.props.required}
          onUpdate={this.updateBranch}
          scrollIntoView={this.props.scrollIntoView}
        >
          {i18n.m('legal.investigations.revoked.para.downgrade')}
        </Branch>

        <Show when={this.props.HasRevocations.value === 'Yes'}>
          <Accordion
            defaultState={this.props.defaultState}
            {...this.props.List}
            scrollToBottom={this.props.scrollToBottom}
            summary={this.summary}
            onUpdate={this.updateList}
            onError={this.handleError}
            errors={accordionErrors}
            description={i18n.t('legal.investigations.revoked.collection.description')}
            appendTitle={i18n.t('legal.investigations.revoked.collection.appendTitle')}
            appendLabel={i18n.t('legal.investigations.revoked.collection.appendLabel')}
            required={this.props.required}
            scrollIntoView={this.props.scrollIntoView}
          >
            <RevokedItem
              name="Item"
              bind={true}
              required={this.props.required}
              scrollIntoView={this.props.scrollIntoView}
            />
          </Accordion>
        </Show>
      </div>
    )
  }
}

Revoked.defaultProps = {
  name: 'revoked',
  HasRevocations: {},
  List: Accordion.defaultList,
  defaultState: true,
  onUpdate: () => {},
  onError: (value, arr) => arr,
  section: 'legal',
  subsection: 'investigations/revoked',
  dispatch: () => {},
  scrollToBottom: '',
  errors: [],
}

export default connectSubsection(Revoked, sectionConfig)

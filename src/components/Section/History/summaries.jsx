import React from 'react'
import i18n from 'util/i18n'
import { gaps, extractDate } from 'components/Section/History/dateranges'
import { Svg } from 'components/Form'
import { newGuid } from 'components/Form/ValidationElement'
import {
  Summary,
  AddressSummary,
  DateSummary,
  NameSummary,
} from 'components/Summary'

import { openState, chevron } from 'components/Form/Accordion/Accordion'

/** This file should be refactored */
/* eslint-disable */

export const CustomSummary = (
  isValid,
  summary,
  more,
  item,
  index,
  initial,
  callback,
  toggle,
  openText,
  remove,
  byline
) => {
  if (item.type === 'Gap') {
    return null
  }

  const target = item.Item || {}
  const errors = item.Item && !isValid
  const text = openText() || ''

  return (
    <div className="summary-container">
      <div className="summary">
        <span className={`left ${openState(item, initial)}`}>
          <a
            href="javascript:;;;"
            onClick={toggle()}
            title={`Click to ${text.toLowerCase()} this item`}>
            <span className="button-with-icon" aria-hidden="true">
              <i className={chevron(item)} aria-hidden="true" />
              <span className="toggle">{text}</span>
            </span>
            {summary(target, errors)}
          </a>
          {more(target, errors)}
        </span>
        <a
          href="javascript:;;;"
          className="right remove"
          onClick={remove()}
          title="Remove this item">
          <span className="button-with-icon">
            <i className="fa fa-trash" aria-hidden="true" />
            <span>{i18n.t('collection.remove')}</span>
          </span>
        </a>
      </div>
      {byline()}
    </div>
  )
}

/**
 * Renders a formatted summary information for a residence row
 */
export const ResidenceSummary = (item, index, errors, open) => {
  const address = AddressSummary(item.Address)
  const dates = DateSummary(
    item.Dates,
    i18n.t('history.employment.default.noDate.label')
  )
  const svg = errors && !open
    ? <Svg src="/img/exclamation-point.svg" className="incomplete" />
    : null

  return Summary({
    icon: svg,
    index,
    type: i18n.t('history.residence.collection.summary.item'),
    left: address,
    right: dates,
    placeholder: i18n.t('history.residence.collection.summary.unknown'),
  })
}

const PersonSummary = (item) => {
  if (!item.ReferenceName) {
    return null
  }

  const name = NameSummary(item.ReferenceName, '')
  if (!name) {
    return null
  }

  return Summary({
    type: i18n.t('history.residence.collection.summary.item2'),
    left: name,
  })
}

export const ResidenceCustomSummary = (
  item,
  index,
  initial,
  callback,
  toggle,
  openText,
  remove,
  byline,
  isValid
) => CustomSummary(
  isValid,
  (x, e) => ResidenceSummary(x, index, e, item.open),
  (x, e) => {
    const ps = PersonSummary(x, e)
    if (ps === null) {
      return null
    }

    return (
      <a href="javascript:;;;" onClick={toggle()}>
        {ps}
      </a>
    )
  },
  item,
  index,
  initial,
  callback,
  toggle,
  openText,
  remove,
  byline
)

const employmentTitle = (activity, item, unk) => {
  switch (activity) {
    case 'ActiveMilitary':
    case 'NationalGuard':
    case 'USPHS':
      return item.DutyStation && item.DutyStation.value ? item.DutyStation.value : unk
    case 'OtherFederal':
    case 'StateGovernment':
    case 'FederalContractor':
    case 'NonGovernment':
    case 'SelfEmployment':
    case 'Other':
      return item.Employment && item.Employment.value
        ? item.Employment.value
        : unk
    case 'Unemployment':
      return i18n.t('history.employment.default.activity.type.unemployment')
    default:
      return unk
  }
}

/**
 * Renders a formatted summary information for an employment row
 */
export const EmploymentSummary = (item, index, errors, open) => {
  const activity = (item.EmploymentActivity || {}).value
  const employer = employmentTitle(activity, item)
  const dates = DateSummary(
    item.Dates,
    i18n.t('history.employment.default.noDate.label')
  )
  const svg = errors && !open
    ? <Svg src="/img/exclamation-point.svg" className="incomplete" />
    : null

  return Summary({
    icon: svg,
    index,
    type: i18n.t('history.employment.default.collection.summary.employer'),
    left: employer,
    right: dates,
    placeholder: i18n.t('history.employment.default.collection.summary.unknown')
  })
}

const ActivitySummary = (item) => {
  if (!item.Additional
    || item.Additional.HasAdditionalActivity !== 'Yes'
    || (item.Additional.List || []).length === 0) {
    return []
  }

  return item.Additional.List.map((activity) => {
    const dates = DateSummary(
      activity.DatesEmployed,
      i18n.t('history.employment.default.noDate.label')
    )

    if ((activity.Position || {}).value && dates) {
      return Summary({
        type: i18n.t('history.employment.default.collection.summary.item2'),
        left: activity.Position.value,
        right: dates,
      })
    }

    return null
  })
}

export const EmploymentCustomSummary = (
  item,
  index,
  initial,
  callback,
  toggle,
  openText,
  remove,
  byline,
  isValid
) => CustomSummary(
  isValid,
  (x, e) => EmploymentSummary(x, index, e, item.open),
  (x, e) => ActivitySummary(x, e)
    .filter(activity => activity !== null)
    .map(activity => (
      <a href="javascript:;;;" key={newGuid()} onClick={toggle()}>
        {activity}
      </a>
    )),
  item,
  index,
  initial,
  callback,
  toggle,
  openText,
  remove,
  byline
)

/**
 * Renders a formatted summary information for an education row
 */
export const EducationSummary = (item, index, errors, open) => {
  const school = item.Name && item.Name.value ? item.Name.value : ''
  const dates = DateSummary(
    item.Dates,
    i18n.t('history.employment.default.noDate.label')
  )
  const svg = errors && !open
    ? <Svg src="/img/exclamation-point.svg" className="incomplete" />
    : null

  return Summary({
    icon: svg,
    index,
    type: i18n.t('history.education.collection.school.summary.item'),
    left: school,
    right: dates,
    placeholder: i18n.t('history.education.collection.school.summary.unknown')
  })
}

const DiplomaSummary = (item) => {
  if (((item.Diplomas || {}).items || []).length === 0) {
    return []
  }

  return item.Diplomas.items.map((degree, index) => {
    const dd = degree.Item || {}
    const other = (dd.DiplomaOther || {}).value || ''
    const diploma = (dd.Diploma || {}).value || ''
    const val = diploma
      ? (diploma === 'Other' ? other : diploma)
      : other

    if (val) {
      return Summary({
        type: i18n.t('history.education.collection.school.summary.item2'),
        index,
        left: val,
      })
    }

    return null
  })
}

export const EducationCustomSummary = (
  item,
  index,
  initial,
  callback,
  toggle,
  openText,
  remove,
  byline,
  isValid
) => CustomSummary(
  isValid,
  (x, e) => EducationSummary(x, index, e, item.open),
  (x, e) => DiplomaSummary(x, e)
    .filter(diploma => diploma !== null)
    .map(diploma => (
      <a href="javascript:;;;" key={newGuid()} onClick={toggle()}>
        {diploma}
      </a>
    )),
  item,
  index,
  initial,
  callback,
  toggle,
  openText,
  remove,
  byline
)

/**
 * Inject new list items as `Gaps`
 */
export const InjectGaps = (list = [], start) => {
  // Let us just make sure we clear any previous gaps
  list = list.filter(item => !item.type || (item.type && item.type !== 'Gap'))

  const hasDates = (item) => {
    const dates = ((item || {}).Item || {}).Dates || {}
    const from = extractDate(dates.from)
    const to = dates.present === true ? new Date() : extractDate(dates.to)
    return from && to
  }

  const gapToItem = gap => ({
    type: 'Gap',
    uuid: newGuid(),
    open: false,
    Item: {
      Dates: {
        from: {
          date: gap.from,
          month: `${gap.from.getMonth() + 1}`,
          day: `${gap.from.getDate()}`,
          year: `${gap.from.getFullYear()}`,
        },
        to: {
          date: gap.to,
          month: `${gap.to.getMonth() + 1}`,
          day: `${gap.to.getDate()}`,
          year: `${gap.to.getFullYear()}`,
        },
      },
    },
  })

  const sort = (a, b) => {
    // Helper to find the date value or default it to 0
    const getOptionalDate = obj => (((obj || {}).Item || {}).Dates || {}).to

    const first = extractDate(getOptionalDate(a)) || 0
    const second = extractDate(getOptionalDate(b)) || 0

    if (first < second) {
      return 1
    }

    if (first > second) {
      return -1
    }

    return 0
  }

  // Find all our "holes" for this type
  const ranges = list
    .filter(item => hasDates(item))
    .map((item) => {
      const dates = ((item || {}).Item || {}).Dates || {}
      const from = extractDate(dates.from)
      const to = dates.present === true ? new Date() : extractDate(dates.to)
      return { from, to }
    })

  gaps(ranges, start).forEach(gap => list.push(gapToItem(gap)))
  return list.sort(sort)
}

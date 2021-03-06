import name from 'models/shared/name'
import alias from 'models/shared/alias'
import address from 'models/shared/locations/address'
import usAddress from 'models/shared/locations/usAddress'
import birthplaceWithoutCounty from 'models/shared/locations/birthplaceWithoutCounty'
import physicalAddress from 'models/shared/physicalAddress'
import { hasYesOrNo } from 'models/validate'

import {
  MOTHER,
  FATHER,
  CHILD,
  immedateFamilyOptions,
  relativeCitizenshipDocumentationOptions,
  relativeResidentDocumentationOptions,
} from 'constants/enums/relationshipOptions'
import { OTHER, DEFAULT_EARLIEST, DEFAULT_LATEST } from 'constants/dateLimits'

import { countryString } from 'validators/location'
import { sortDateObjects } from 'helpers/date'

/** Helper functions */
export const isCitizen = attributes => !!(
  attributes.Citizenship
    && attributes.Citizenship.value
    && attributes.Citizenship.value.includes
    && attributes.Citizenship.value.includes('United States')
)

export const isLiving = attributes => (
  attributes.IsDeceased && attributes.IsDeceased.value === 'No'
)

export const livesInUS = attributes => !!(
  attributes.Address
    && attributes.Address.country
    && countryString(attributes.Address.country) === 'United States'
)

export const isLivingNonCitizen = attributes => (
  isLiving(attributes) && !isCitizen(attributes)
)
export const wasBornInUS = attributes => (
  attributes.Birthplace
  && attributes.Birthplace.country
  && countryString(attributes.Birthplace.country) === 'United States'
)

export const hasApoAddress = attributes => (
  attributes.AlternateAddress
  && attributes.AlternateAddress.HasDifferentAddress
  && attributes.AlternateAddress.HasDifferentAddress === 'Yes'
)

export const requireCitizenshipDocumentation = (attributes, options) => {
  if (options.requireRelationshipRelativesForeignBornDoc) {
    return !!((
      isCitizen(attributes)
      && !wasBornInUS(attributes)
      && !isLiving(attributes)
    ) || (
      isCitizen(attributes)
      && !wasBornInUS(attributes)
      && (livesInUS(attributes) || hasApoAddress(attributes))
    ))
  }
  return false
}

export const requireResidenceDocumentation = (attributes, options) => (
  options.requireRelationshipRelativesUSResidenceDoc
  && isLivingNonCitizen(attributes)
  && livesInUS(attributes)
)

export const requireRelativeContactDescription = (attributes, options) => (
  options.requireRelationshipRelativesUSResidenceDoc
  && isLivingNonCitizen(attributes)
)

/** Relative model */
const relative = {
  Name: {
    presence: true,
    model: { validator: name },
  },
  Relation: {
    presence: true,
    hasValue: { validator: { length: { minimum: 1 } } },
  },
  Birthdate: (value, attributes, attributeName, options = {}) => {
    if (attributes.Relation) {
      switch (attributes.Relation.value) {
        case CHILD: {
          return {
            presence: true,
            date: { earliest: options.applicantBirthdate, latest: DEFAULT_LATEST },
          }
        }

        case MOTHER:
        case FATHER: {
          return {
            presence: true,
            date: { earliest: DEFAULT_EARLIEST, latest: options.applicantBirthdate },
          }
        }

        default: {
          return {
            presence: true,
            date: { ...OTHER },
          }
        }
      }
    }

    return {
      presence: true,
      date: { ...OTHER },
    }
  },
  Birthplace: {
    presence: true,
    location: { validator: birthplaceWithoutCounty },
  },
  Citizenship: { presence: true, country: true },
  IsDeceased: {
    presence: true,
    hasValue: { validator: hasYesOrNo },
  },
  MaidenName: (value, attributes) => {
    if (attributes.Relation
      && attributes.Relation.value === MOTHER) {
      return attributes.MaidenSameAsListed
        && attributes.MaidenSameAsListed.value === 'Yes'
        ? {}
        : {
          presence: true,
          model: { validator: name },
        }
    }

    return {}
  },
  Aliases: (value, attributes) => {
    if (attributes.Relation
      && !immedateFamilyOptions.includes(attributes.Relation.value)) {
      return {}
    }

    return {
      presence: true,
      branchCollection: {
        validator: alias,
        hideMaiden: attributes.Relation && attributes.Relation.value === MOTHER,
        earliest: attributes.Birthdate,
      },
    }
  },
  Address: (value, attributes) => {
    if (attributes.IsDeceased
      && attributes.IsDeceased.value === 'Yes') return {}

    return {
      presence: true,
      location: { validator: address },
    }
  },
  AlternateAddress: (value, attributes) => {
    if (attributes.IsDeceased
      && attributes.IsDeceased.value === 'Yes') return {}

    return {
      presence: true,
      model: {
        validator: physicalAddress,
        militaryAddress: true,
        hasTelephone: false,
      },
    }
  },
  CitizenshipDocumentation: (value, attributes, attributeNane, options) => {
    if (requireCitizenshipDocumentation(attributes, options)) {
      return {
        presence: true,
        hasValue: {
          validator: {
            inclusion: relativeCitizenshipDocumentationOptions,
          },
        },
      }
    }

    return {}
  },
  OtherCitizenshipDocumentation: (value, attributes) => {
    if (attributes.CitizenshipDocumentation
      && attributes.CitizenshipDocumentation.value === 'Other') {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  DocumentNumber: (value, attributes, attributeName, options) => {
    if (requireCitizenshipDocumentation(attributes, options)) {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  CourtName: (value, attributes, attributeName, options) => {
    if (requireCitizenshipDocumentation(attributes, options)) {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  CourtAddress: (value, attributes, attributeName, options) => {
    if (requireCitizenshipDocumentation(attributes, options)) {
      return {
        presence: true,
        location: { validator: usAddress },
      }
    }

    return {}
  },
  Document: (value, attributes, attributeName, options) => {
    if (requireResidenceDocumentation(attributes, options)) {
      return {
        presence: true,
        hasValue: {
          validator: {
            inclusion: relativeResidentDocumentationOptions,
          },
        },
      }
    }

    return {}
  },
  DocumentComments: (value, attributes) => {
    if (attributes.Document && attributes.Document.value === 'Other') {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  ResidenceDocumentNumber: (value, attributes, attributeName, options) => {
    if (requireResidenceDocumentation(attributes, options)) {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  Expiration: (value, attributes, attributeName, options) => {
    if (requireResidenceDocumentation(attributes, options)) {
      return {
        presence: true,
        date: true,
      }
    }

    return {}
  },
  FirstContact: (value, attributes, attributeName, options) => {
    if (requireRelativeContactDescription(attributes, options)) {
      const { Birthdate } = attributes
      const { applicantBirthdate } = options

      const sortedDates = sortDateObjects([Birthdate, applicantBirthdate])

      const earliestDate = sortedDates.length
        ? sortedDates[sortedDates.length - 1]
        : null

      return {
        presence: true,
        date: {
          earliest: earliestDate,
          latest: DEFAULT_LATEST,
        },
      }
    }

    return {}
  },
  LastContact: (value, attributes, attributeName, options) => {
    if (requireRelativeContactDescription(attributes, options)) {
      const dateLimits = { latest: DEFAULT_LATEST }
      if (attributes.FirstContact) dateLimits.earliest = attributes.FirstContact
      return {
        presence: true,
        date: dateLimits,
      }
    }

    return {}
  },
  Methods: (value, attributes, attributeName, options) => {
    if (requireRelativeContactDescription(attributes, options)) {
      return {
        presence: true,
        array: {
          validator: { presence: true },
          length: { minimum: 1 },
        },
      }
    }

    return {}
  },
  MethodsComments: (value, attributes) => {
    if (attributes.Methods
      && attributes.Methods.values
      && attributes.Methods.values.some
      && attributes.Methods.values.some(i => i === 'Other')) {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  Frequency: (value, attributes, attributeName, options) => {
    if (requireRelativeContactDescription(attributes, options)) {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  FrequencyComments: (value, attributes) => {
    if (attributes.Frequency
      && attributes.Frequency.value === 'Other') {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  Employer: (value, attributes, attributeName, options) => {
    if (attributes.EmployerNotApplicable
      && attributes.EmployerNotApplicable.applicable === false) return {}

    if (requireRelativeContactDescription(attributes, options)) {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
  EmployerAddress: (value, attributes, attributeName, options) => {
    if (attributes.EmployerAddressNotApplicable
      && attributes.EmployerAddressNotApplicable.applicable === false) return {}

    if (requireRelativeContactDescription(attributes, options)) {
      return {
        presence: true,
        location: { validator: address },
      }
    }

    return {}
  },
  HasAffiliation: (value, attributes, attributeName, options) => {
    if (attributes.EmployerRelationshipNotApplicable
      && attributes.EmployerRelationshipNotApplicable.applicable === false) return {}

    if (requireRelativeContactDescription(attributes, options)) {
      return {
        presence: true,
        hasValue: { validator: hasYesOrNo },
      }
    }

    return {}
  },
  EmployerRelationship: (value, attributes) => {
    if (attributes.HasAffiliation && attributes.HasAffiliation.value === 'Yes') {
      return {
        presence: true,
        hasValue: true,
      }
    }

    return {}
  },
}

export default relative

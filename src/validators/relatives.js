import NameValidator from './name'
import AddressValidator from './address'
import DateRangeValidator from './daterange'
import { validDateField, validGenericTextfield } from './helpers'

export default class RelativesValidator {
  constructor (state = {}, props = {}) {
    this.relations = state.Relations || []
    this.list = state.List || []
  }

  validRelations () {
    return this.relations.length > 0
  }

  validItems () {
    if (this.relations.length === 0) {
      return true
    }

    if (this.list.length === 0) {
      return false
    }

    for (const relative of this.list) {
      if (new RelativeValidator(relative.Item, null).isValid() !== true) {
        return false
      }
    }

    return true
  }

  isValid () {
    return this.validRelations() && this.validItems()
  }
}

export class RelativeValidator {
  constructor (state = {}, props = {}) {
    this.relations = state.Relations || []
    this.name = state.Name
    this.birthdate = state.Birthdate
    this.birthplace = state.Birthplace
    this.citizenship = state.Citizenship || []
    this.maidenName = state.MaidenName
    this.aliases = state.Aliases || []
    this.isDeceased = state.IsDeceased
    this.address = state.Address
    this.abroad = state.Abroad
    this.naturalized = state.Naturalized
    this.derived = state.Derived
    this.derivedComments = state.DerivedComments
    this.documentNumber = state.DocumentNumber
    this.courtName = state.CourtName
    this.courtAddress = state.CourtAddress
    this.document = state.Document
    this.documentComments = state.DocumentComments
    this.residenceDocumentNumber = state.ResidenceDocumentNumber
    this.expiration = state.Expiration
    this.firstContact = state.FirstContact
    this.lastContact = state.LastContact
    this.methods = state.Methods || []
    this.methodsComments = state.MethodsComments
    this.frequency = state.Frequency
    this.frequencyComments = state.FrequencyComments
    this.employer = state.Employer
    this.employerAddress = state.EmployerAddress
    this.hasAffiliation = state.HasAffiliation
    this.employerRelationship = state.EmployerRelationship
  }

  citizen () {
    return !!this.citizenship && this.citizenship.some(x => x === 'United States')
  }

  requiresCitizenshipDocumentation () {
    const relations = ['Father', 'Mother', 'Child', 'Stepchild', 'Brother', 'Sister', 'Half-brother', 'Half-sister', 'Stepbrother', 'Stepsister', 'Stepmother', 'Stepfather']
    if (this.relations && this.relations.some(x => relations.includes(x)) && this.citizen() && this.birthplace.addressType === 'International' && this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && this.address.addressType === 'United States' && this.birthplace.addressType === 'International' && this.citizen()) {
      return true
    }

    if (this.address && this.address.addressType === 'APOFPO' && this.birthplace.addressType === 'International' && this.citizen()) {
      return true
    }

    if (this.birthplace && this.birthplace.addressType === 'International' && this.citizen()) {
      return true
    }

    return false
  }

  validRelations () {
    console.log('relations')
    return this.relations.length > 0
  }

  validName () {
    console.log('name')
    return !!this.name && new NameValidator(this.name, null).isValid()
  }

  validBirthdate () {
    console.log('birthdate')
    return !!this.birthdate && validDateField(this.birthdate)
  }

  validBirthplace () {
    console.log('birthplace')
    return !!this.birthplace && new AddressValidator(this.birthplace, null).isValid()
  }

  validCitizenship () {
    console.log('citizenship')
    return !!this.citizenship && this.citizenship.length > 0
  }

  validMaidenName () {
    console.log('maiden name')
    return !!this.maidenName && validGenericTextfield(this.maidenName)
  }

  validAliases () {
    console.log('aliases')
    if (this.aliases.length === 0) {
      return false
    }

    for (const alias of this.aliases) {
      const has = !!alias.Has && (alias.Has === 'No' || alias.Has === 'Yes')
      if (has && alias.Has === 'No') {
        continue
      }

      if (has && new AliasValidator(alias.Item, null).isValid() === false) {
        return false
      }
    }

    return true
  }

  validIsDeceased () {
    console.log('deceased')
    return !!this.isDeceased && (this.isDeceased === 'No' || this.isDeceased === 'Yes')
  }

  validAddress () {
    console.log('address')
    if (!this.isDeceased) {
      return false
    }

    if (this.isDeceased === 'No') {
      return true
    }

    return !!this.address && new AddressValidator(this.address, null).isValid()
  }

  validAbroad () {
    console.log('abroad')
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return !!this.abroad && this.abroad.length > 0
  }

  validNaturalized () {
    console.log('naturalized')
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return !!this.naturalized && this.naturalized.length > 0
  }

  validDerived () {
    console.log('derived')
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return !!this.derived && this.derived.length > 0 &&
      ((this.derived === 'Other' && !!this.derivedComments && this.derivedComments.length > 0) ||
       (this.derived !== 'Other'))
  }

  validDocumentNumber () {
    console.log('document number')
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return validGenericTextfield(this.documentNumber)
  }

  validCourtName () {
    console.log('court name')
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return validGenericTextfield(this.courtName)
  }

  validCourtAddress () {
    console.log('court address')
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return new AddressValidator(this.courtAddress, null).isValid()
  }

  validDocument () {
    console.log('document')
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    return !!this.document && this.document.length > 0 &&
      ((this.document === 'Other' && !!this.documentComments && this.documentComments.length > 0) ||
       (this.document !== 'Other'))
  }

  validResidenceDocumentNumber () {
    console.log('res doc numb')
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    return !!this.residenceDocumentNumber && validGenericTextfield(this.residenceDocumentNumber)
  }

  validExpiration () {
    console.log('expiration')
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    return !!this.expiration && validDateField(this.expiration)
  }

  validFirstContact () {
    console.log('first contact')
    if (this.address && this.address.addressType !== 'International') {
      return true
    }

    return !!this.firstContact && validDateField(this.firstContact)
  }

  validLastContact () {
    console.log('last contact')
    if (this.address && this.address.addressType !== 'International') {
      return true
    }

    return !!this.lastContact && validDateField(this.lastContact)
  }

  validMethods () {
    console.log('methods')
    if (this.address && this.address.addressType !== 'International') {
      return true
    }

    return this.methods.length > 0 &&
      ((this.methods.some(x => x === 'Other') && !!this.methodsComments && this.methodsComments.length > 0) ||
       (this.methods.every(x => x !== 'Other')))
  }

  validFrequency () {
    console.log('freq')
    if (this.address && this.address.addressType !== 'International') {
      return true
    }

    return !!this.frequency && this.frequency.length > 0 &&
      ((this.frequency === 'Other' && !!this.frequencyComments && this.frequencyComments.length > 0) ||
       (this.frequency !== 'Other'))
  }

  validEmployer () {
    console.log('employer')
    if (this.address && this.address.addressType !== 'International') {
      return true
    }

    return !!this.employer && validGenericTextfield(this.employer)
  }

  validEmployerAddress () {
    console.log('employer addr')
    if (this.address && this.address.addressType !== 'International') {
      return true
    }

    return !!this.employerAddress && new AddressValidator(this.employerAddress, null).isValid()
  }

  validEmployerRelationship () {
    console.log('employer rel')
    if (this.address && this.address.addressType !== 'International') {
      return true
    }

    if (!this.hasAffiliation) {
      return false
    }

    if (this.hasAffiliation === 'No') {
      return true
    }

    return !!this.employerRelationship && validGenericTextfield(this.employerRelationship)
  }

  isValid () {
    return this.validRelations() &&
      this.validName() &&
      this.validBirthdate() &&
      this.validBirthplace() &&
      this.validCitizenship() &&
      this.validMaidenName() &&
      this.validAliases() &&
      this.validIsDeceased() &&
      this.validAddress() &&
      this.validAbroad() &&
      this.validNaturalized() &&
      this.validDerived() &&
      this.validDocumentNumber() &&
      this.validCourtName() &&
      this.validCourtAddress() &&
      this.validDocument() &&
      this.validResidenceDocumentNumber() &&
      this.validExpiration() &&
      this.validFirstContact() &&
      this.validLastContact() &&
      this.validMethods() &&
      this.validFrequency() &&
      this.validEmployer() &&
      this.validEmployerAddress() &&
      this.validEmployerRelationship()
  }
}

export class AliasValidator {
  constructor (state = {}, props = {}) {
    this.name = state.Name
    this.maidenName = state.MaidenName
    this.dates = state.Dates
  }

  validName () {
    return !!this.name && new NameValidator(this.name, null).isValid()
  }

  validMaidenName () {
    return !!this.maidenName && (this.maidenName === 'No' || this.maidenName === 'Yes')
  }

  validDates () {
    return !!this.dates && new DateRangeValidator(this.dates, null).isValid()
  }

  isValid () {
    return this.validName() &&
      this.validMaidenName() &&
      this.validDates()
  }
}

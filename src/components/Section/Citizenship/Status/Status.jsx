import React from 'react'
import { i18n } from '../../../../config'
import { CitizenshipValidator } from '../../../../validators'
import { ValidationElement, Branch, Show, Field, RadioGroup, Radio,
         Text, Textarea, Name, Address, DateControl, Country } from '../../../Form'

/**
 * Convenience function to send updates along their merry way
 */
const sendUpdate = (fn, name, props) => {
  if (fn) {
    fn({
      name: name,
      ...props
    })
  }
}

export default class Status extends ValidationElement {
  constructor (props) {
    super(props)

    this.state = {
      CitizenshipStatus: props.CitizenshipStatus,
      AbroadDocumentation: props.AbroadDocumentation,
      Explanation: props.Explanation,
      DocumentNumber: props.DocumentNumber,
      DocumentIssued: props.DocumentIssued,
      PlaceIssued: props.PlaceIssued,
      DocumentName: props.DocumentName,
      CertificateNumber: props.CertificateNumber,
      CertificateIssued: props.CertificateIssued,
      CertificateName: props.CertificateName,
      BornOnMilitaryInstallation: props.BornOnMilitaryInstallation,
      MilitaryBase: props.MilitaryBase,
      EntryDate: props.EntryDate,
      EntryLocation: props.EntryLocation,
      PriorCitizenship: props.PriorCitizenship,
      HasAlienRegistration: props.HasAlienRegistration,
      AlienRegistrationNumber: props.AlienRegistrationNumber,
      CertificateCourtName: props.CertificateCourtName,
      CertificateCourtAddress: props.CertificateCourtAddress,
      Basis: props.Basis,
      errorCodes: []
    }

    this.onUpdate = this.onUpdate.bind(this)
    this.updateCitizenshipStatus = this.updateCitizenshipStatus.bind(this)
    this.updateAbroadDocumentation = this.updateAbroadDocumentation.bind(this)
    this.updateExplanation = this.updateExplanation.bind(this)
    this.updateDocumentNumber = this.updateDocumentNumber.bind(this)
    this.updateDocumentIssued = this.updateDocumentIssued.bind(this)
    this.updatePlaceIssued = this.updatePlaceIssued.bind(this)
    this.updateDocumentName = this.updateDocumentName.bind(this)
    this.updateCertificateNumber = this.updateCertificateNumber.bind(this)
    this.updateCertificateIssued = this.updateCertificateIssued.bind(this)
    this.updateCertificateName = this.updateCertificateName.bind(this)
    this.updateBornOnMilitaryInstallation = this.updateBornOnMilitaryInstallation.bind(this)
    this.updateMilitaryBase = this.updateMilitaryBase.bind(this)
    this.updateEntryDate = this.updateEntryDate.bind(this)
    this.updateEntryLocation = this.updateEntryLocation.bind(this)
    this.updatePriorCitizenship = this.updatePriorCitizenship.bind(this)
    this.updateHasAlienRegistration = this.updateHasAlienRegistration.bind(this)
    this.updateAlienRegistrationNumber = this.updateAlienRegistrationNumber.bind(this)
    this.updateCertificateCourtName = this.updateCertificateCourtName.bind(this)
    this.updateCertificateCourtAddress = this.updateCertificateCourtAddress.bind(this)
    this.updateBasis = this.updateBasis.bind(this)
  }

  /**
   * Handle the validation event.
   */
  handleValidation (event, status, error) {
    if (!event) {
      return
    }

    let codes = super.mergeError(this.state.errorCodes, super.flattenObject(error))
    let complexStatus = null
    if (codes.length > 0) {
      complexStatus = false
    } else if (this.isValid()) {
      complexStatus = true
    }

    this.setState({error: complexStatus === false, valid: complexStatus === true, errorCodes: codes}, () => {
      const errorObject = { [this.props.name]: codes }
      const statusObject = { [this.props.name]: { status: complexStatus } }
      super.handleValidation(event, statusObject, errorObject)
    })
  }

  /**
   * Determine if all items in the collection are considered to be in
   * a valid state.
   */
  isValid () {
    return new CitizenshipValidator(this.state, null).isValid()
  }

  onUpdate (name, values) {
    this.setState({ [name]: values }, () => {
      sendUpdate(this.props.onUpdate, this.props.name, this.state)
    })
  }

  updateCitizenshipStatus (event) {
    this.onUpdate('CitizenshipStatus', event.target.value)
  }

  updateAbroadDocumentation (event) {
    this.onUpdate('AbroadDocumentation', event.target.value)
  }

  updateExplanation (values) {
    this.onUpdate('Explanation', values)
  }

  updateDocumentNumber (values) {
    this.onUpdate('DocumentNumber', values)
  }

  updateDocumentIssued (values) {
    this.onUpdate('DocumentIssued', values)
  }

  updatePlaceIssued (values) {
    this.onUpdate('PlaceIssued', values)
  }

  updateDocumentName (values) {
    this.onUpdate('DocumentName', values)
  }

  updateCertificateNumber (values) {
    this.onUpdate('CertificateNumber', values)
  }

  updateCertificateIssued (values) {
    this.onUpdate('CertificateIssued', values)
  }

  updateCertificateName (values) {
    this.onUpdate('CertificateName', values)
  }

  updateBornOnMilitaryInstallation (values) {
    this.onUpdate('BornOnMilitaryInstallation', values)
  }

  updateMilitaryBase (values) {
    this.onUpdate('MilitaryBase', values)
  }

  updateEntryDate (values) {
    this.onUpdate('EntryDate', values)
  }

  updateEntryLocation (values) {
    this.onUpdate('EntryLocation', values)
  }

  updatePriorCitizenship (values) {
    this.onUpdate('PriorCitizenship', values)
  }

  updateHasAlienRegistration (values) {
    this.onUpdate('HasAlienRegistration', values)
  }

  updateAlienRegistrationNumber (values) {
    this.onUpdate('AlienRegistrationNumber', values)
  }

  updateCertificateCourtName (values) {
    this.onUpdate('CertificateCourtName', values)
  }

  updateCertificateCourtAddress (values) {
    this.onUpdate('CertificateCourtAddress', values)
  }

  updateBasis (event) {
    this.onUpdate('Basis', event.target.value)
  }

  render () {
    return (
      <div className="status">
        <Field title={i18n.t('citizenship.status.heading.citizenshipstatus')}
               help="citizenship.status.help.citizenshipstatus"
               adjustFor="buttons">
          <RadioGroup className="citizenship-status"
                      selectedValue={this.state.CitizenshipStatus}>
            <Radio name="citizenship-status-citizen"
                   label={i18n.t('citizenship.status.label.citizenshipstatus.citizen')}
                   value="Citizen"
                   className="citizenship-status-citizen"
                   onChange={this.updateCitizenshipStatus}
                   />
            <Radio name="citizenship-status-foreignborn"
                   label={i18n.t('citizenship.status.label.citizenshipstatus.foreignborn')}
                   value="ForeignBorn"
                   className="citizenship-status-foreignborn"
                   onChange={this.updateCitizenshipStatus}
                   />
            <Radio name="citizenship-status-naturalized"
                   label={i18n.m('citizenship.status.label.citizenshipstatus.naturalized')}
                   value="Naturalized"
                   className="citizenship-status-naturalized"
                   onChange={this.updateCitizenshipStatus}
                   />
            <Radio name="citizenship-status-derived"
                   label={i18n.m('citizenship.status.label.citizenshipstatus.derived')}
                   value="Derived"
                   className="citizenship-status-derived"
                   onChange={this.updateCitizenshipStatus}
                   />
            <Radio name="citizenship-status-notcitizen"
                   label={i18n.m('citizenship.status.label.citizenshipstatus.notcitizen')}
                   value="NotCitizen"
                   className="citizenship-status-notcitizen"
                   onChange={this.updateCitizenshipStatus}
                   />
          </RadioGroup>
        </Field>

        <Show when={this.state.CitizenshipStatus === 'ForeignBorn'}>
          <div>
            <Field title={i18n.t('citizenship.status.heading.abroad')}
                   help="citizenship.status.help.abroad"
                   adjustFor="buttons"
                   comments={true}
                   commentsName="Explanation"
                   commentsValue={this.state.Explanation}
                   commentsActive={this.state.AbroadDocumentation === 'Other'}
                   onUpdate={this.updateExplanation}
                   onValidate={this.handleValidation}>
              <RadioGroup className="citizenship-abroad"
                          selectedValue={this.state.AbroadDocumentation}>
                <Radio name="citizenship-abroad-fs240"
                       label={i18n.t('citizenship.status.label.abroad.fs240')}
                       value="FS-240"
                       className="citizenship-abroad-fs240"
                       onChange={this.updateAbroadDocumentation}
                       />
                <Radio name="citizenship-abroad-ds1350"
                       label={i18n.t('citizenship.status.label.abroad.ds1350')}
                       value="DS-1350"
                       className="citizenship-abroad-ds1350"
                       onChange={this.updateAbroadDocumentation}
                       />
                <Radio name="citizenship-abroad-fs545"
                       label={i18n.t('citizenship.status.label.abroad.fs545')}
                       value="FS-545"
                       className="citizenship-abroad-fs545"
                       onChange={this.updateAbroadDocumentation}
                       />
                <Radio name="citizenship-abroad-other"
                       label={i18n.t('citizenship.status.label.abroad.other')}
                       value="Other"
                       className="citizenship-abroad-other"
                       onChange={this.updateAbroadDocumentation}
                       />
              </RadioGroup>
            </Field>

            <Field title={i18n.t('citizenship.status.heading.documentnumber')}
                   help="citizenship.status.help.documentnumber">
              <Text name="DocumentNumber"
                    className="document-number"
                    {...this.state.DocumentNumber}
                    onUpdate={this.updateDocumentNumber}
                    onValidate={this.handleValidation}
                    />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.documentissued')}
                   help="citizenship.status.help.documentissued"
                   adjustFor="labels"
                   shrink={true}>
              <DateControl name="DocumentIssued"
                           className="document-issued"
                           {...this.state.DocumentIssued}
                           onUpdate={this.updateDocumentIssued}
                           onValidate={this.handleValidation}
                           />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.placeissued')}
                   help="citizenship.status.help.placeissued"
                   adjustFor="big-buttons"
                   shrink={true}>
              <Address name="PlaceIssued"
                       className="place-issued"
                       {...this.state.PlaceIssued}
                       onUpdate={this.updatePlaceIssued}
                       onValidate={this.handleValidation}
                       />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.documentname')}>
              <Name name="DocumentName"
                    className="document-name"
                    {...this.state.DocumentName}
                    onUpdate={this.updateDocumentName}
                    onValidate={this.handleValidation}
                    />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.certificatenumber.foreignborn')}
                   help="citizenship.status.help.certificatenumber">
              <Text name="CertificateNumber"
                    className="certificate-number"
                    {...this.state.CertificateNumber}
                    onUpdate={this.updateCertificateNumber}
                    onValidate={this.handleValidation}
                    />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.certificateissued.foreignborn')}
                   help="citizenship.status.help.certificateissued"
                   adjustFor="labels"
                   shrink={true}>
              <DateControl name="CertificateIssued"
                           className="certificate-issued"
                           {...this.state.CertificateIssued}
                           onUpdate={this.updateCertificateIssued}
                           onValidate={this.handleValidation}
                           />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.certificatename.foreignborn')}>
              <Name name="CertificateName"
                    className="certificate-name"
                    {...this.state.CertificateName}
                    onUpdate={this.updateCertificateName}
                    onValidate={this.handleValidation}
                    />
            </Field>

            <Branch name="born_on_military_installation"
                    label={i18n.t('citizenship.status.heading.bornonmilitaryinstallation')}
                    labelSize="h3"
                    className="born-on-military-installation"
                    value={this.state.BornOnMilitaryInstallation}
                    help="citizenship.status.help.bornonmilitaryinstallation"
                    onUpdate={this.updateBornOnMilitaryInstallation}
                    onValidate={this.handleValidation}
                    />

            <Show when={this.state.BornOnMilitaryInstallation === 'Yes'}>
              <Field title={i18n.t('citizenship.status.heading.militarybase')}
                     help="citizenship.status.help.militarybase">
                <Text name="MilitaryBase"
                      className="military-base"
                      {...this.state.MilitaryBase}
                      onUpdate={this.updateMilitaryBase}
                      onValidate={this.handleValidation}
                      />
              </Field>
            </Show>
          </div>
        </Show>

        <Show when={this.state.CitizenshipStatus === 'Naturalized'}>
          <div>
            <Field title={i18n.t('citizenship.status.heading.entrydate')}
                   help="citizenship.status.help.entrydate"
                   adjustFor="labels"
                   shrink={true}>
              <DateControl name="EntryDate"
                           className="entry-date"
                           {...this.state.EntryDate}
                           onUpdate={this.updateEntryDate}
                           onValidate={this.handleValidation}
                           />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.entrylocation')}
                   help="citizenship.status.help.entrylocation"
                   adjustFor="big-buttons"
                   shrink={true}>
              <Address name="EntryLocation"
                       className="entry-location"
                       {...this.state.EntryLocation}
                       onUpdate={this.updateEntryLocation}
                       onValidate={this.handleValidation}
                       />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.priorcitizenship')}
                   help="citizenship.status.help.priorcitizenship">
              <Country name="PriorCitizenship"
                       className="prior-citizenship"
                       value={this.state.PriorCitizenship.first}
                       onUpdate={this.updatePriorCitizenship}
                       onValidate={this.handleValidation}
                       />
            </Field>

            <Branch name="has_alien_registration"
                    label={i18n.t('citizenship.status.heading.hasalienregistration')}
                    labelSize="h3"
                    className="has-alien-registration"
                    value={this.state.HasAlienRegistration}
                    help="citizenship.status.help.hasalienregistration"
                    onUpdate={this.updateHasAlienRegistration}
                    onValidate={this.handleValidation}
                    />

            <Show when={this.state.HasAlienRegistration === 'Yes'}>
              <Field title={i18n.t('citizenship.status.heading.alienregistrationnumber')}
                     help="citizenship.status.help.alienregistrationnumber">
                <Text name="AlienRegistrationNumber"
                      className="alien-registration-number"
                      {...this.state.AlienRegistrationNumber}
                      onUpdate={this.updateAlienRegistrationNumber}
                      onValidate={this.handleValidation}
                      />
              </Field>
            </Show>

            <Field title={i18n.t('citizenship.status.heading.certificatenumber.naturalized')}
                   help="citizenship.status.help.certificatenumber">
              <Text name="CertificateNumber"
                    className="certificate-number"
                    {...this.state.CertificateNumber}
                    onUpdate={this.updateCertificateNumber}
                    onValidate={this.handleValidation}
                    />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.certificatecourtname')}
                   help="citizenship.status.help.certificatecourtname">
              <Text name="CertificateCourtName"
                    className="certificate-court-name"
                    {...this.state.CertificateCourtName}
                    onUpdate={this.updateCertificateCourtName}
                    onValidate={this.handleValidation}
                    />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.certificatecourtaddress')}
                   help="citizenship.status.help.certificatecourtaddress"
                   adjustFor="big-buttons"
                   shrink={true}>
              <Address name="CertificateCourtAddress"
                       className="certificate-court-address"
                       {...this.state.CertificateCourtAddress}
                       onUpdate={this.updateCertificateCourtAddress}
                       onValidate={this.handleValidation}
                       />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.certificateissued.naturalized')}
                   help="citizenship.status.help.certificateissued"
                   adjustFor="labels"
                   shrink={true}>
              <DateControl name="CertificateIssued"
                           className="certificate-issued"
                           {...this.state.CertificateIssued}
                           onUpdate={this.updateCertificateIssued}
                           onValidate={this.handleValidation}
                           />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.certificatename.naturalized')}>
              <Name name="CertificateName"
                    className="certificate-name"
                    {...this.state.CertificateName}
                    onUpdate={this.updateCertificateName}
                    onValidate={this.handleValidation}
                    />
            </Field>

            <Field title={i18n.t('citizenship.status.heading.basis.naturalized')}
                   help="citizenship.status.help.basis"
                   adjustFor="big-buttons"
                   comments={true}
                   commentsName="Explanation"
                   commentsValue={this.state.Explanation}
                   commentsActive={this.state.Basis === 'Other'}
                   onUpdate={this.updateExplanation}
                   onValidate={this.handleValidation}>
              <RadioGroup className="citizenship-basis"
                          selectedValue={this.state.Basis}>
                <Radio name="citizenship-basis-individual"
                       label={i18n.m('citizenship.status.label.basis.individual')}
                       value="Individual"
                       className="citizenship-basis-individual"
                       onChange={this.updateBasis}
                       />
                <Radio name="citizenship-basis-other"
                       label={i18n.m('citizenship.status.label.basis.other')}
                       value="Other"
                       className="citizenship-basis-other"
                       onChange={this.updateBasis}
                       />
              </RadioGroup>
            </Field>
          </div>
        </Show>

        <Show when={this.state.CitizenshipStatus === 'Derived'}>
          <div></div>
        </Show>

        <Show when={this.state.CitizenshipStatus === 'NotCitizen'}>
          <div></div>
        </Show>
      </div>
    )
  }
}

Status.defaultProps = {
  CitizenshipStatus: '',
  AbroadDocumentation: '',
  Explanation: {},
  DocumentNumber: {},
  DocumentIssued: {},
  PlaceIssued: {},
  DocumentName: {},
  CertificateNumber: {},
  CertificateIssued: {},
  CertificateName: {},
  BornOnMilitaryInstallation: '',
  MilitaryBase: {},
  EntryDate: {},
  EntryLocation: {},
  PriorCitizenship: [],
  HasAlienRegistration: '',
  AlienRegistrationNumber: {},
  CertificateCourtName: {},
  CertificateCourtAddress: {},
  Basis: ''
}

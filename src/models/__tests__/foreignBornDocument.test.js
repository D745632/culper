import { validateModel } from 'models/validate'
import foreignBornDocument from '../foreignBornDocument'

describe('The foreign born document model', () => {
  it('DocumentType field is required', () => {
    const testData = {}
    const expectedErrors = ['DocumentType.presence.REQUIRED']

    expect(validateModel(testData, foreignBornDocument))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('DocumentType must be valid', () => {
    const testData = {
      DocumentType: { value: 'invalid' },
    }
    const expectedErrors = ['DocumentType.hasValue.value.inclusion.INCLUSION']

    expect(validateModel(testData, foreignBornDocument))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('DocumentExpiration is required', () => {
    const testData = {}
    const options = {
      requireForeignBornDocExpiration: true,
    }
    const expectedErrors = ['DocumentExpiration.presence.REQUIRED']

    expect(validateModel(testData, foreignBornDocument, options))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('DocumentExpiration must be a valid date', () => {
    const testData = {
      DocumentExpiration: 'invalid',
    }
    const options = {
      requireForeignBornDocExpiration: true,
    }
    const expectedErrors = [
      'DocumentExpiration.date.day.presence.REQUIRED',
      'DocumentExpiration.date.month.presence.REQUIRED',
      'DocumentExpiration.date.year.presence.REQUIRED',
    ]

    expect(validateModel(testData, foreignBornDocument, options))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('DocumentNumber is required', () => {
    const testData = {}
    const expectedErrors = ['DocumentNumber.presence.REQUIRED']

    expect(validateModel(testData, foreignBornDocument))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('DocumentNumber must be a valid value', () => {
    const testData = {
      DocumentNumber: '123',
    }
    const expectedErrors = ['DocumentNumber.hasValue.MISSING_VALUE']

    expect(validateModel(testData, foreignBornDocument))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('passes a valid doucment', () => {
    const testData = {
      DocumentType: { value: 'PermanentResident' },
      DocumentExpiration: { year: 2030, month: 1, day: 5 },
      DocumentNumber: { value: '123' },
    }

    expect(validateModel(testData, foreignBornDocument)).toEqual(true)
  })

  describe('if DocumentExpiration is not applicable', () => {
    it('DocumentExpiration is not required', () => {
      const testData = {
        DocumentExpirationNotApplicable: { applicable: false },
      }

      const expectedErrors = ['DocumentExpiration.presence.REQUIRED']

      expect(validateModel(testData, foreignBornDocument))
        .not.toEqual(expect.arrayContaining(expectedErrors))
    })

    it('passes a valid doucment', () => {
      const testData = {
        DocumentType: { value: 'PermanentResident' },
        DocumentExpirationNotApplicable: { applicable: false },
        DocumentNumber: { value: '123' },
      }

      expect(validateModel(testData, foreignBornDocument)).toEqual(true)
    })
  })

  describe('if DocumentType is "Other"', () => {
    it('OtherExplanation is required', () => {
      const testData = {
        DocumentType: { value: 'Other' },
      }
      const expectedErrors = ['OtherExplanation.presence.REQUIRED']

      expect(validateModel(testData, foreignBornDocument))
        .toEqual(expect.arrayContaining(expectedErrors))
    })

    it('OtherExplanation must have a valid value', () => {
      const testData = {
        DocumentType: { value: 'Other' },
        OtherExplanation: { value: '' },
      }
      const expectedErrors = ['OtherExplanation.hasValue.MISSING_VALUE']

      expect(validateModel(testData, foreignBornDocument))
        .toEqual(expect.arrayContaining(expectedErrors))
    })

    it('passes a valid doucment', () => {
      const testData = {
        DocumentType: { value: 'Other' },
        OtherExplanation: { value: 'Something' },
        DocumentExpiration: { year: 2030, month: 1, day: 5 },
        DocumentNumber: { value: '123' },
      }

      expect(validateModel(testData, foreignBornDocument)).toEqual(true)
    })
  })

  describe('SF85P', () => {
    it('validates when there is no document expiration date', () => {
      const testData = {
        DocumentType: { value: 'Other' },
        OtherExplanation: { value: 'Something' },
        DocumentExpiration: {},
        DocumentNumber: { value: '123' },
      }
      const options = {
        requireForeignBornDocExpiration: false,
      }

      expect(validateModel(testData, foreignBornDocument, options)).toEqual(true)
    })
  })
})

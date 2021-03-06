import { validateModel } from 'models/validate'
import drugUse from '../drugUse'

describe('The drugUse model', () => {
  it('validates required fields', () => {
    const testData = {}
    const expectedErrors = [
      'DrugType.presence.REQUIRED',
      'FirstUse.presence.REQUIRED',
      'RecentUse.presence.REQUIRED',
      'NatureOfUse.presence.REQUIRED',
      'UseWhileEmployed.presence.REQUIRED',
      'UseWithClearance.presence.REQUIRED',
      'UseInFuture.presence.REQUIRED',
      'Explanation.presence.REQUIRED',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('DrugType must have a valid value', () => {
    const testData = {
      DrugType: { value: 'Other' },
    }
    const expectedErrors = [
      'DrugType.hasValue.value.exclusion.EXCLUSION',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  // TODO this is not how the form works
  // Right now, Explanation text becomes DrugType.value
  // So currently, only validation on DrugType is that it can't be "Other"
  describe.skip('if DrugType is "Other"', () => {
    it('DrugTypeExplanation must have a value', () => {
      const testData = {
        DrugType: { value: 'Other' },
        DrugTypeExplanation: 'test',
      }
      const expectedErrors = [
        'DrugTypeExplanation.hasValue',
      ]

      expect(validateModel(testData, drugUse))
        .toEqual(expect.arrayContaining(expectedErrors))
    })
  })

  it('FirstUse must be a valid month/year', () => {
    const testData = {
      FirstUse: { day: 5, month: 10 },
    }
    const expectedErrors = [
      'FirstUse.date.year.presence.REQUIRED',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('FirstUse cannot be before applicant birthdate', () => {
    const applicantBirthdate = { month: 1, day: 2, year: 1980 }
    const testData = {
      FirstUse: { month: 1, year: 1970, day: 2 },
    }

    const expectedErrors = [
      'FirstUse.date.date.datetime.DATE_TOO_EARLY',
    ]

    expect(validateModel(testData, drugUse, {
      applicantBirthdate,
    }))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('FirstUse cannot be in the future', () => {
    const testData = {
      FirstUse: { month: 1, year: 2050, day: 2 },
    }

    const expectedErrors = [
      'FirstUse.date.date.datetime.DATE_TOO_LATE',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('RecentUse must be a valid month/year', () => {
    const testData = {
      RecentUse: { day: 5, month: 10 },
    }
    const expectedErrors = [
      'RecentUse.date.year.presence.REQUIRED',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('RecentUse must be after FirstUse', () => {
    const testData = {
      FirstUse: { month: 8, year: 2001 },
      RecentUse: { month: 5, year: 1990 },
    }
    const expectedErrors = [
      'RecentUse.date.date.datetime.DATE_TOO_EARLY',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('NatureOfUse must have a value', () => {
    const testData = {
      NatureOfUse: 'testing',
    }
    const expectedErrors = [
      'NatureOfUse.hasValue.MISSING_VALUE',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('UseWhileEmployed must have a valid value', () => {
    const testData = {
      UseWhileEmployed: { value: 'nope' },
    }
    const expectedErrors = [
      'UseWhileEmployed.hasValue.value.inclusion.INCLUSION',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('UseWithClearance must have a valid value', () => {
    const testData = {
      UseWithClearance: { value: 'nope' },
    }
    const expectedErrors = [
      'UseWithClearance.hasValue.value.inclusion.INCLUSION',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('UseInFuture must have a valid value', () => {
    const testData = {
      UseInFuture: { value: 'nope' },
    }
    const expectedErrors = [
      'UseInFuture.hasValue.value.inclusion.INCLUSION',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('Explanation must have a value', () => {
    const testData = {
      Explanation: 'testing',
    }
    const expectedErrors = [
      'Explanation.hasValue.MISSING_VALUE',
    ]

    expect(validateModel(testData, drugUse))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  describe('if UseWhileEmployed is not required', () => {
    it('UseWhileEmployed is not required', () => {
      const testData = {}
      const expectedErrors = [
        'UseWhileEmployed.presence.REQUIRED',
      ]

      expect(validateModel(testData, drugUse, { requireUseWhileEmployed: false }))
        .not.toEqual(expect.arrayContaining(expectedErrors))
    })

    it('passes a valid drugUse', () => {
      const testData = {
        DrugType: { value: 'Test drug' },
        // DrugTypeExplanation: { value: 'Test drug' },
        FirstUse: { month: 2, year: 1999 },
        RecentUse: { month: 5, year: 2001 },
        NatureOfUse: { value: 'Testing' },
        UseWithClearance: { value: 'No' },
        UseInFuture: { value: 'Yes' },
        Explanation: { value: 'testing' },
      }

      expect(validateModel(testData, drugUse, { requireUseWhileEmployed: false }))
        .toEqual(true)
    })
  })

  describe('if UseWithClearance is not required', () => {
    it('UseWithClearance is not required', () => {
      const testData = {}
      const expectedErrors = [
        'UseWithClearance.presence.REQUIRED',
      ]

      expect(validateModel(testData, drugUse, { requireUseWithClearance: false }))
        .not.toEqual(expect.arrayContaining(expectedErrors))
    })

    it('passes a valid drugUse', () => {
      const testData = {
        DrugType: { value: 'Cocaine' },
        FirstUse: { month: 2, year: 1999 },
        RecentUse: { month: 5, year: 2001 },
        NatureOfUse: { value: 'Testing' },
        UseWhileEmployed: { value: 'No' },
        UseInFuture: { value: 'Yes' },
        Explanation: { value: 'testing' },
      }

      expect(validateModel(testData, drugUse, { requireUseWithClearance: false }))
        .toEqual(true)
    })
  })

  describe('if UseInFuture is not required', () => {
    it('UseInFuture is not required', () => {
      const testData = {}
      const expectedErrors = [
        'UseInFuture.presence.REQUIRED',
        'Explanation.presence.REQUIRED',
      ]

      expect(validateModel(testData, drugUse, { requireUseInFuture: false }))
        .toEqual(expect.not.arrayContaining(expectedErrors))
    })

    it('passes a valid drugUse', () => {
      const testData = {
        DrugType: { value: 'Steroids' },
        FirstUse: { month: 2, year: 1999 },
        RecentUse: { month: 5, year: 2001 },
        NatureOfUse: { value: 'Testing' },
        UseWithClearance: { value: 'No' },
        UseWhileEmployed: { value: 'Yes' },
      }

      expect(validateModel(testData, drugUse, { requireUseInFuture: false }))
        .toEqual(true)
    })
  })

  it('passes a valid drugUse', () => {
    const testData = {
      DrugType: { value: 'THC' },
      FirstUse: { month: 2, year: 1999 },
      RecentUse: { month: 5, year: 2001 },
      NatureOfUse: { value: 'Testing' },
      UseWhileEmployed: { value: 'No' },
      UseWithClearance: { value: 'No' },
      UseInFuture: { value: 'Yes' },
      Explanation: { value: 'testing' },
    }

    expect(validateModel(testData, drugUse)).toEqual(true)
  })
})

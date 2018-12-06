import SelectiveServiceValidator, {
  hideSelectiveService
} from './selectiveservice'

describe('Selective service validation', function() {
  it('', () => {
    const tests = [
      {
        store: {},
        expected: false
      },
      {
        store: {
          Identification: {
            ApplicantBirthDate: {
              Date: {}
            }
          }
        },
        expected: false
      },
      {
        store: {
          Identification: {
            ApplicantBirthDate: {
              Date: {
                month: `${new Date().getMonth() + 1}`,
                day: `${new Date().getDate()}`,
                year: `${new Date().getFullYear()}`
              }
            }
          }
        },
        expected: false
      },
      {
        store: {
          Identification: {
            ApplicantBirthDate: {
              Date: {
                month: '1',
                day: '1',
                year: '1940'
              }
            }
          }
        },
        expected: true
      },
      {
        store: {
          Identification: {
            ApplicantBirthDate: {
              Date: {
                month: '11',
                day: '31',
                year: '1959'
              }
            }
          }
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(hideSelectiveService(test.store)).toBe(test.expected)
    })
  })

  it('handle whether subject was born after a date', () => {
    const tests = [
      {
        state: {
          WasBornAfter: { value: '' }
        },
        expected: false
      },
      {
        state: {
          WasBornAfter: { value: 'No' }
        },
        expected: true
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' }
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(
        new SelectiveServiceValidator(test.state, null).validBornAfter()
      ).toBe(test.expected)
    })
  })

  it('handle whether subject has registered', () => {
    const tests = [
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: '' }
        },
        expected: false
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'No' }
        },
        expected: true
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'Yes' }
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(
        new SelectiveServiceValidator(test.state, null).validRegistered()
      ).toBe(test.expected)
    })
  })

  it('handle whether subject has registration number', () => {
    const tests = [
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'Yes' },
          RegistrationNumber: null
        },
        expected: false
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'Yes' },
          RegistrationNumber: {
            value: ''
          }
        },
        expected: false
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'Yes' },
          RegistrationNumber: {
            value: '123abc7890'
          }
        },
        expected: false
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'Yes' },
          RegistrationNumber: {
            value: '1234567890'
          }
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(
        new SelectiveServiceValidator(
          test.state,
          null
        ).validRegistrationNumber()
      ).toBe(test.expected)
    })
  })

  it('handle whether subject has explanation', () => {
    const tests = [
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'No' },
          Explanation: null
        },
        expected: false
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'No' },
          Explanation: {
            value: ''
          }
        },
        expected: false
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'No' },
          Explanation: {
            value: 'Never knew about it'
          }
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(
        new SelectiveServiceValidator(test.state, null).validExplanation()
      ).toBe(test.expected)
    })
  })

  it('handle entire state', () => {
    const tests = [
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'Yes' },
          RegistrationNumber: {
            value: '1234567890'
          }
        },
        expected: true
      },
      {
        state: {
          WasBornAfter: { value: 'Yes' },
          HasRegistered: { value: 'No' },
          Explanation: {
            value: 'Never knew about it'
          }
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(new SelectiveServiceValidator(test.state, null).isValid()).toBe(
        test.expected
      )
    })
  })
})

import { validateModel } from 'models/validate'
import unauthorizedTech from '../unauthorizedTech'

describe('The unauthorizedTech model', () => {
  it('validates required fields', () => {
    const testData = {}
    const expectedErrors = [
      'Date.required',
      'Incident.required',
      'Location.required',
      'Action.required',
    ]

    expect(validateModel(testData, unauthorizedTech))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('Date must be a valid date', () => {
    const testData = {
      Date: 12345,
    }
    const expectedErrors = ['Date.date']

    expect(validateModel(testData, unauthorizedTech))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('Incident must have a value', () => {
    const testData = {
      Incident: 'test incident',
    }
    const expectedErrors = ['Incident.hasValue']

    expect(validateModel(testData, unauthorizedTech))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('Location must be a valid address', () => {
    const testData = {
      Location: '123 Main St',
    }
    const expectedErrors = ['Location.location']

    expect(validateModel(testData, unauthorizedTech))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('Action must have a value', () => {
    const testData = {
      Action: 'test',
    }
    const expectedErrors = ['Action.hasValue']

    expect(validateModel(testData, unauthorizedTech))
      .toEqual(expect.arrayContaining(expectedErrors))
  })

  it('passes a valid unauthorizedTech', () => {
    const testData = {
      Date: { month: 9, day: 10, year: 1990 },
      Incident: { value: 'Test Court' },
      Location: {
        street: '123 Main St',
        zipcode: '10002',
        city: 'New York',
        state: 'NY',
        country: 'United States',
      },
      Action: { value: 'Something I did' },
    }

    expect(validateModel(testData, unauthorizedTech)).toEqual(true)
  })
})

import { buildInitialTouched } from '../builders'

describe('buildInitialTouched', () => {
  test('should convert an object of primitive values into an object of booleans', () => {
    const initialValues = {
      a: 2,
      b: 'foo',
      c: null,
    }

    const initialTouched = buildInitialTouched(initialValues)

    expect(initialTouched).toEqual({
      a: false,
      b: false,
      c: false,
    })
  })

  test('should convert a nested object recursively', () => {
    const initialValues = {
      name: 'Sherlock Holmes',
      address: {
        street: 'Baker Street 221B',
        city: 'London',
      },
    }

    const initialTouched = buildInitialTouched(initialValues)

    expect(initialTouched).toEqual({
      name: false,
      address: {
        street: false,
        city: false,
      },
    })
  })

  test('should treat null as primitive', () => {
    const initialValues = {
      name: 'Sherlock',
      address: null,
    }

    const initialTouched = buildInitialTouched(initialValues)

    expect(initialTouched).toEqual({
      name: false,
      address: false,
    })
  })
})

import { assertNoArrays } from './utils'

export const buildInitialTouched = (initialValues, touchedValue = false) => {
  const entries = Object.entries(initialValues)

  const initialTouchedEntries = entries.map(([key, value]) => {
    assertNoArrays(value)

    if (typeof value === 'object' && value !== null) {
      return [key, buildInitialTouched(value)]
    }

    return [key, false]
  })

  return Object.fromEntries(initialTouchedEntries)
}


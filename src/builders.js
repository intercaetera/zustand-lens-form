export const buildInitialTouched = initialValues => {
  const entries = Object.entries(initialValues)

  const initialTouchedEntries = entries.map(([key, value]) => {
    if (Array.isArray(value)) {
      throw new Error('Currently array values are unsupported, you need to provide initialTouched manually.')
    }

    if (typeof value === 'object' && value !== null) {
      return [key, buildInitialTouched(value)]
    }

    return [key, false]
  })

  return Object.fromEntries(initialTouchedEntries)
}


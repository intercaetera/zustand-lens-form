// eslint-disable-next-line no-console
export const inspect = (value, ...rest) => console.info(value, ...rest) || value

export const tap = (value, fn) => {
  fn()
  return value
}

export const assertNoArrays = value => {
  if (Array.isArray(value)) {
    throw new Error('Array values are currently unsupported.')
  }
}

const collectPathsRecursively = (shape, prefix = '') => {
  return Object.entries(shape).flatMap(([key, value]) => {
    assertNoArrays(value)

    if (typeof value === 'object' && value !== null) {
      return collectPathsRecursively(value, key)
    }

    return prefix ? `${prefix}.${key}` : key
  })
}

export const compareShapes = ({ value, ...shapes }) => {
  if (!value) {
    console.warn('Calling `compareShapes` without `value`.')
    return
  }

  const valuePaths = collectPathsRecursively(value)

  Object.entries(shapes)
    .map(([key, shape]) => [
      key,
      collectPathsRecursively(shape)
        .filter(path => !valuePaths.includes(path)),
    ])
    .forEach(([key, remainingPaths]) => {
      if (remainingPaths.length > 0) {
        console.warn(`${key} missing paths: ${remainingPaths.join(', ')}`)
      }
    })
}

export const flattenObjectEntries = shape => {
  return Object.entries(shape).flatMap(([key, value]) => {
    assertNoArrays(value)

    if (typeof value === 'object' && value !== null) {
      return flattenObjectEntries(value)
    }

    return [[key, value]]
  })
}

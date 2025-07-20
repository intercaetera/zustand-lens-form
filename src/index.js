import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { buildInitialTouched } from './builders'
import { compose, createLens, lenses, pipe, update, view } from './lens'
import { compareShapes, flattenObjectEntries } from './utils'

export const createFieldLens = fieldName => {
  const fieldLens = createLens(fieldName)

  const fieldValueLens = compose(lenses.value, fieldLens)
  const fieldTouchedLens = compose(lenses.touched, fieldLens)
  const fieldErrorLens = compose(lenses.error, fieldLens)

  return {
    view: state => {
      const value = view(fieldValueLens, state)
      const touched = view(fieldTouchedLens, state)
      const error = view(fieldErrorLens, state)

      return { value, touched, error }
    },
    update: (state, { value, touched, error }) => {
      return pipe(state, [
        state => value === undefined ? state : update(fieldValueLens, state, value),
        state => touched === undefined ? state : update(fieldTouchedLens, state, touched),
        state => error === undefined ? state : update(fieldErrorLens, state, error),
      ])
    },
  }
}

export const createLensForm = ({
  formName = 'Zustand Lens Form',
  initialValue = {},
  initialTouched: defaultInitialTouched,
  validate,
}) => {
  const initialTouched = defaultInitialTouched || buildInitialTouched(initialValue)
  const initialError = buildInitialTouched(initialValue)

  const useFormStore = create(devtools(set => {
    const setWithCompare = setter => {
      set(state => {
        compareShapes({ value: state.value, error: state.error, touched: state.touched })
        return setter(state)
      })
    }

    const setWithValidate = setter => {
      setWithCompare(state => {
        const { error } = validate(state)
        const newState = { ...state, error }
        return setter(newState)
      })
    }

    const decorateSubmit = handler => {
      return () => setWithCompare(state => {
        const { error } = validate(state)
        const isValid = flattenObjectEntries(error).every(([_, value]) => !value)
        const touched = buildInitialTouched(state.value, true)

        console.log(error, isValid, flattenObjectEntries(error))

        if (isValid) {
          handler(state.value)
        }

        return { ...state, touched, error }
      })
    }

    return ({
      value: initialValue,
      touched: initialTouched,
      error: initialError,
      set: validate ? setWithValidate : setWithCompare,
      decorateSubmit,
    })
  }, { name: formName }))

  return selector => useFormStore(useShallow(selector))
}

export * from './lens'
export * from './utils'

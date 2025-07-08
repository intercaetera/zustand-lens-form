import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { buildInitialTouched } from './builders'
import { compose, createLens, lenses, pipe, update, view } from './lens'

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

  const useFormStore = create(devtools(set => {
    const setWithValidate = setter => {
      set(state => {
        const error = validate(state.value)
        const newState = { ...state, error }
        return setter(newState)
      })
    }

    return ({
      value: initialValue,
      touched: initialTouched,
      error: {},
      set: validate ? setWithValidate : set,
    })
  }, { name: formName }))

  return selector => useFormStore(useShallow(selector))
}

export * from './lens'


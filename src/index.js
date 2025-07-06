import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { buildInitialTouched } from './builders'
import { compose, createLens, lenses, pipe, update, view } from './lens'

export const createFieldLens = fieldName => {
  const fieldLens = createLens(fieldName)

  const fieldValueLens = compose(lenses.value, fieldLens)
  const fieldTouchedLens = compose(lenses.touched, fieldLens)

  return {
    view: state => {
      const value = view(fieldValueLens, state)
      const touched = view(fieldTouchedLens, state)

      return { value, touched }
    },
    update: (state, { value, touched }) => {
      return pipe(state, [
        state => value === undefined ? state : update(fieldValueLens, state, value),
        state => touched === undefined ? state : update(fieldTouchedLens, state, touched),
      ])
    },
  }
}

export const createLensForm = ({
  initialValue = {},
  initialTouched: defaultInitialTouched,
}) => {
  const initialTouched = defaultInitialTouched || buildInitialTouched(initialValue)

  const useFormStore = create(set => ({
    value: initialValue,
    touched: initialTouched,
    handleChange: lens => event => set(state => update(lens, state, { value: event.target.value })),
    handleBlur: lens => () => set(state => update(lens, state, { touched: true })),
    set,
  }))

  return selector => useFormStore(useShallow(selector))
}

export * from './lens'


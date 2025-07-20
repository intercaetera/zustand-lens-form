import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { buildInitialTouched } from './builders'
import { compose, createLens, lenses, pipe, update, view } from './lens'
import { compareShapes, flattenObjectEntries, tap } from './utils'

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
  formName = `ZLF ID: ${Date.now()}`,
  initialValue = {},
  initialTouched: defaultInitialTouched,
  validate: validateFromCaller,
}) => {
  const initialTouched = defaultInitialTouched || buildInitialTouched(initialValue)
  const initialError = buildInitialTouched(initialValue)

  const validate = validateFromCaller ? state => {
    const { error } = validateFromCaller(state)
    const isValid = flattenObjectEntries(error).every(([_, value]) => !value)

    return pipe(state, [
      state => update(lenses.error, state, error),
      state => update(lenses.isValid, state, isValid),
    ])
  } : x => x

  const useFormStore = create(devtools(set => {
    const setWithCompare = setter => {
      set(state => {
        compareShapes({ value: state.value, error: state.error, touched: state.touched })
        return setter(state)
      })
    }

    const setWithValidate = setter => setWithCompare(state => setter(validate(state)))

    // TODO: Handle async
    const decorateSubmit = handler =>
      () => setWithCompare(state =>
        pipe(state, [
          state => validate(state),
          state => update(lenses.touched, state, buildInitialTouched(state.value, true)),
          state => state.isValid ? tap(state, () => handler(state.value)) : state,
        ]),
      )

    return ({
      value: initialValue,
      touched: initialTouched,
      error: initialError,
      isValid: undefined,
      isSubmitting: false,
      hasSubmitted: false,
      set: setWithValidate,
      decorateSubmit,
    })
  }, { name: formName }))

  return selector => useFormStore(useShallow(selector))
}

export * from './lens'
export * from './utils'

import { createLensForm, createFieldLens, view, update, pipe } from '../../../src'

import { TextField } from '../fields/TextField'
import { AddressField } from '../fields/AddressField'
import { withFormSubmission } from '../utils/withFormSubmission'

const nameLens = createFieldLens('name')
const surnameLens = createFieldLens('surname')
const addressLens = createFieldLens('address')

const useBasicForm = createLensForm({
  formName: 'Basic Form',
  initialValue: {
    name: '',
    surname: '',
    address: {
      street: '',
      city: '',
    }
  },
  validate: state => {
    return pipe(state, [
      state => view(nameLens, state).value === ""
        ? update(nameLens, state, { error: "Name required" })
        : update(nameLens, state, { error: false }),
      state => view(surnameLens, state).value === ""
        ? update(surnameLens, state, { error: "Surname required" })
        : update(surnameLens, state, { error: false }),
    ])
  }
})

const PureBasicForm = ({ submitForm }) => {
  const decorateSubmit = useBasicForm(s => s.decorateSubmit)
  const handleSubmit = decorateSubmit(submitForm)

  return (
    <div>
      <h2>Details</h2>

      <TextField
        name="name"
        label="Name"
        fieldLens={nameLens}
        useForm={useBasicForm}
      />

      <TextField
        name="surname"
        label="Surname"
        fieldLens={surnameLens}
        useForm={useBasicForm}
      />

      <AddressField
        label="Address"
        fieldLens={addressLens}
        useForm={useBasicForm}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export const BasicForm = withFormSubmission(PureBasicForm)

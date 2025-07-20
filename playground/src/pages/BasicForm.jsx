import { createLensForm, createFieldLens, view, update, pipe } from '../../../src'

import { TextField } from '../fields/TextField'
import { AddressField } from '../fields/AddressField'
import { withFormSubmission } from '../utils/withFormSubmission'

const nameLens = createFieldLens('name')
const surnameLens = createFieldLens('surname')
const addressLens = createFieldLens('address')

const useNameSurnameForm = createLensForm({
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
  return (
    <div>
      <h2>Details</h2>

      <TextField
        name="name"
        label="Name"
        fieldLens={nameLens}
        useForm={useNameSurnameForm}
      />

      <TextField
        name="surname"
        label="Surname"
        fieldLens={surnameLens}
        useForm={useNameSurnameForm}
      />

      <AddressField
        label="Address"
        fieldLens={addressLens}
        useForm={useNameSurnameForm}
      />

      <button>Submit</button>
    </div>
  )
}

export const BasicForm = withFormSubmission(PureBasicForm)

import { createLensForm, createFieldLens, view, update, pipe, inspect } from '../../src'
import { TextField } from './fields/TextField'
import './App.css'
import { AddressField } from './fields/AddressField'

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

const App = () => {
  return (
    <div>
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
    </div>
  )
}

export default App

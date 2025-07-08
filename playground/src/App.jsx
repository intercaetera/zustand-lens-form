import { createLensForm, createFieldLens, view, update } from '../../src'
import { TextField } from './fields/TextField'
import './App.css'

const useNameSurnameForm = createLensForm({
  initialValue: {
    name: '',
    surname: '',
  },
  validate: ({ name, surname }) => {
    let errors = {}
    if (name == '') errors.name = "Name required."
    if (surname == '') errors.surname = "Surname required."
    return errors
  }
})

const nameLens = createFieldLens('name')
const surnameLens = createFieldLens('surname')

function App() {
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
    </div>
  )
}

export default App

import { createLensForm, createFieldLens, view, update } from '../../src'
import './App.css'

const useNameSurnameForm = createLensForm({
  initialValue: {
    name: '',
    surname: '',
  },
})

const nameLens = createFieldLens('name')
const surnameLens = createFieldLens('surname')

function App() {
  const nameField = useNameSurnameForm(s => view(nameLens, s))
  const surnameField = useNameSurnameForm(s => view(surnameLens, s))

  const [handleChange, handleBlur] = useNameSurnameForm(s => [s.handleChange, s.handleBlur])

  return (
    <div>
      <div>
        <label>Name:
          <input
            value={nameField.value}
            style={{ background: nameField.touched ? 'green' : 'gold' }}
            onChange={handleChange(nameLens)}
            onBlur={handleBlur(nameLens)}
          />
        </label>
      </div>

      <div>
        <label>Surname:
          <input
            value={surnameField.value}
            style={{ background: surnameField.touched ? 'green' : 'gold' }}
            onChange={handleChange(surnameLens)}
            onBlur={handleBlur(surnameLens)}
          />
        </label>
      </div>
    </div>
  )
}

export default App

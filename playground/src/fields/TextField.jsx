import { view, identity, update } from "../../../src"

export const TextField = ({
  name,
  label,
  fieldLens = identity,
  useForm,
}) => {
  const field = useForm(f => view(fieldLens, f))
  const set = useForm(f => f.set)

  const handleChange = event => {
    const { value } = event.target
    return set(state => update(fieldLens, state, { value }))
  }

  const handleBlur = () => {
    return set(state => update(fieldLens, state, { touched: true }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={name}>{label}</label>
      <input
        value={field.value}
        style={{ background: field.touched ? 'gray' : 'black' }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {field.touched && field.error && (
        <span style={{ color: 'red' }}>{field.error}</span>
      )}
    </div>
  )
}

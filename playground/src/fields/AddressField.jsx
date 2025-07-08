import { compose, createFieldLens, identity, view } from "../../../src";
import { TextField } from "./TextField";

const streetLens = createFieldLens('street')
const cityLens = createFieldLens('city')

export const AddressField = ({
  label,
  fieldLens = identity,
  useForm,
}) => {
  const addressStreetLens = compose(fieldLens, streetLens)
  const addressCityLens = compose(fieldLens, cityLens)

  return (
    <div>
      <h2>{label}</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <TextField
          name="street"
          label="Street"
          fieldLens={addressStreetLens}
          useForm={useForm}
        />

        <TextField
          name="city"
          label="City"
          fieldLens={addressCityLens}
          useForm={useForm}
        />
      </div>
    </div>
  )
}

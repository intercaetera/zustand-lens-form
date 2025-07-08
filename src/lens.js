export const createLens = field => ({
  view: whole => whole[field],
  update: (whole, part) => ({ ...whole, [field]: part }),
})

export const view = (lens, whole) => lens.view(whole)
export const update = (lens, whole, part) => lens.update(whole, part)
export const over = (lens, whole, fn) => update(lens, whole, fn(view(lens, whole)))

const composeTwo = (outer, inner) => ({
  view: whole => view(inner, view(outer, whole)),
  update: (whole, part) => update(outer, whole, update(inner, view(outer, whole), part)),
})

export const identity = {
  view: a => a,
  update: (s, a) => a,
}

export const compose = (...lenses) => lenses.reduce(composeTwo, identity)

export const pipe = (value, fns = []) => fns.reduce((val, fn) => fn(val), value)

export const lenses = {
  value: createLens('value'),
  touched: createLens('touched'),
  error: createLens('error'),
}

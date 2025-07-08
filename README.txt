 _____ __    _____
|__   |  |  |   __|
|   __|  |__|   __|
|_____|_____|__|

An experimental form library based on Zustand, lenses and self-similar
structures. Loosely inspired by Formik.

The reason why ZLF exists is to create a form library that can support
very large and very complicated forms without effort. Formik falls short
because even simple updates to fields require re-rendering the entire
component tree. Also, complicated forms should allow for component
fields to be used on any level of the form object.

-- RUNNING --

  npm install # tty 1
  npm run dev

  npm run playground:setup # tty 2
  npm run playground

-- TESTING --

  npm test

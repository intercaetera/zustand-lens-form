import { useState } from "react"

export const withFormSubmission = Component => {
  const WrappedComponent = props => {
    const [submissionState, setSubmissionState] = useState({
      submitted: false,
      values: {},
    })

    const submitForm = values => setSubmissionState({
      submitted: true,
      values,
    })

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Component submitForm={submitForm} {...props} />
        </div>
        <div>
          <pre>{JSON.stringify(submissionState, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return WrappedComponent
}

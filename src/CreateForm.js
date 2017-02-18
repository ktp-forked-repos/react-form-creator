import React, { Component, PropTypes } from 'react'
import _ from 'lodash'


export default function CreateForm(WrappedComponent, fieldsData) {

  class ConnectedForm extends Component {

    constructor(props) {
      super(props)
      // bind methods to component instance
      this.getInitialFieldsState = this.getInitialFieldsState.bind(this)
      this.handleFieldChange = this.handleFieldChange.bind(this)
      this.handleFieldValidation = this.handleFieldValidation.bind(this)
      this.runValidationsForField = this.runValidationsForField.bind(this)
      this.runValidationsForAllFields = this.runValidationsForAllFields.bind(this)
      this.refreshFormValidState = this.refreshFormValidState.bind(this)
      this.handleFormSubmission = this.handleFormSubmission.bind(this)
      this.resetForm = this.resetForm.bind(this)
      this.submitForm = this.submitForm.bind(this)
      // set initial state
      const { initialValid, fieldValues } = props
      this.state = {
        isValid: initialValid, // Initial ability to submit form
        isPristine: true,
        isSubmitting: false,
        submitFailure: null,
        submitSuccess: null,
        fieldsData: this.getInitialFieldsState(fieldValues),
      }
    }

    componentDidMount() {
      this._isUnmounting = false // hack alert
    }

    componentWillUnmount() {
      this._isUnmounting = true // hack alert
    }

    componentWillReceiveProps(nextProps) {
      const { fieldValues } = nextProps
      if (fieldValues && !_.isEqual(fieldValues, this.props.fieldValues)) {
        const fieldsData = this.getInitialFieldsState(fieldValues)
        this.setState({fieldsData})
      }
    }

    // build fieldsData to be held in state.
    getInitialFieldsState(fieldValues) {
      return _.reduce(fieldsData, (result, data, key)=> {
        // clone field to avoid mutation issues
        let field = _.extend({}, data)
        field.id = key
        // start with clean validation state
        field.error = false
        field.success = false
        field.loading = false
        field.pristine = true
        // add event handlers and partially apply field key
        if (data.validationEvent) {
          field[data.validationEvent] = _.partial(this.handleFieldValidation, _, key)
        }
        field.onChange = _.partial(this.handleFieldChange, _, key)
        field.onReset = _.bind(()=> this.onChange(fieldValues[this.id]), field)
        // Map values to fields (see example for setup)
        if (fieldValues && typeof fieldValues[key] !== typeof undefined) {
          field.value = _.clone(fieldValues[key])
        } else if (typeof field.defaultValue !== typeof undefined) {
          field.value = _.clone(field.defaultValue)
        } else {
          field.value = null
        }
        result[key] = field
        return result
      }, {})
    }

    // Run on field change
    handleFieldChange(value, key) {
      const { onChange, onDirty } = this.props
      const { fieldsData } = this.state
      // Update value
      let field = fieldsData[key]
      field.value = value
      field.pristine = false
      this.setState({ fieldsData, isPristine: false }, () => {
        // Run validation if error or success is visible
        // or if no other validation event specified.
        if (field.error || field.success || !field.validationEvent) {
          this.handleFieldValidation(value, key)
        }
        _.isFunction(onChange) && onChange(fieldsData)
        _.isFunction(onDirty) && onDirty(fieldsData)
      })
    }

    // Run on field validation event
    // onChange (default), onBlur, or onFocus
    handleFieldValidation(value, key) {
      if (!key) {
        throw new Error("the validation event must pass the field value")
      }

      const { fieldsData } = this.state
      let field = fieldsData[key]

      return new Promise((resolve, reject)=> {
        // Don't run validation if validationThreshold exists and hasn't been met
        if (field.validationThreshold &&
            field.value &&
            field.value.length < field.validationThreshold &&
            !field.error &&
            !field.success) {
            resolve()
            return
        }
        // Resolves if all validators pass and rejects the first validation that fails.
        const validations = this.runValidationsForField(field, value)
          .then(() => {
            if (this._isUnmounting) {
              resolve()
              return
            }
            field.error = false
            field.success = true
            field.loading = false
            this.setState({ fieldsData })
            this.refreshFormValidState()
            resolve()
          }).catch((e)=> {
            if (this._isUnmounting) {
              resolve()
              return
            }
            if (!(e && e.message)) {
              throw new Error("Invalid promise rejection. Return an Error obj.")
            }
            field.error = e.message
            field.success = false
            field.loading = false
            this.setState({ fieldsData })
            this.refreshFormValidState()
            resolve()
          })

        if (!validations.resolveImmediately) {
          field.loading = true
          this.setState({ fieldsData })
        }
      })
    }

    // For validating a field. Defaulting fieldsData to be from state
    // but allowing for passing in fieldsData if this.state not created yet
    runValidationsForField(field, value) {
      const { fieldsData } = this.state
      let errors = []
      let resolveImmediately = true
      let validators = _.clone(field.validators) || []
      // if field is required then add validation rule
      if (field.required) {
        const isRequired = (value, values)=> {
          if (value == undefined || value == null || value == "") {
            return "Required"
          }
        }
        validators.unshift(isRequired)
      }
      // Check field validity if field validators
      if (validators) {
        // Get validate rule from passed function
        for (const validator of validators) {
          let error = validator(value, fieldsData)
          let shouldBreak = false
          if (error) {
            // Error can be a string
            if (_.isString(error)) {
              // Convert string error into promise and reject immediately
              errors.push(Promise.reject(new Error(error)))
              shouldBreak = true
            // Error can be a promise
            } else if (_.isFunction(error.then)) {
              errors.push(error)
              resolveImmediately = false
            } else {
              throw new Error("Invalid return value from validation function. Return a promise or a string.")
            }
            // No need to check for more errors if error has
            // already returned
            if (shouldBreak) {
              break
            }
          }
        }
      }
      // Resolves if ALL promises in the array resolve (or no validators).
      // Rejects if ANY promise in the array rejects.
      let promise = Promise.all(errors)
      promise.resolveImmediately = resolveImmediately
      return promise
    }

    runValidationsForAllFields() {
      const { fieldsData } = this.state

      const validations = _.reduce(fieldsData, (result, field, key)=> {
        let p = this.handleFieldValidation(field.value, key)
        result.push(p)
        return result
      }, [])

      return Promise.all(validations)
    }

    // Runs after field validation checks
    refreshFormValidState() {
      const { fieldsData, isValid } = this.state
      const fieldsKeys = _.keys(fieldsData)
      // Checks each field for error and value
      const allIsValid = _.every(fieldsKeys, (key) => {
        let field = fieldsData[key]
        let isValid = !field.error
        if (field.required) {
          let hasValue = field.value != undefined && field.value != null && field.value != ""
          return hasValue && isValid
        }
        return isValid
      })

      const { onValid, onInvalid } = this.props
      if (allIsValid && !isValid) {
        this.setState({ isValid: true }, () => {
          _.isFunction(onValid) && onValid(fieldsData)
        })
      } else if (!allIsValid && isValid) {
        this.setState({ isValid: false }, () => {
          _.isFunction(onInvalid) && onInvalid(fieldsData)
        })
      }
      return allIsValid
    }

    // Handles returned promise from onSubmit
    handleFormSubmission(submission) {
      let promise = submission.then
                    ? submission
                    : submission.promise && submission.promise.then
                      ? submission.promise
                      : null
      if (promise) {
        this.setState({
          submitFailure: null,
          submitSuccess: null,
          isSubmitting: true
        })
        promise
          .then(()=> {
            if (this._isUnmounting) {
              return // hack
            }
            this.setState({
              isSubmitting: false,
              submitSuccess: true
            })
            _.isFunction(this.props.onSubmitSuccess) &&
              this.props.onSubmitSuccess(fieldsData)
          })
          .catch((err)=> {
            if (this._isUnmounting) {
              return // hack
            }
            this.setState({
              isSubmitting: false,
              submitFailure: err
            })
            _.isFunction(this.props.onSubmitFailure) &&
              this.props.onSubmitFailure(fieldsData)
          })
      } else {
        console.warn("form submission did not return a promise")
      }
    }

    resetForm() {
      const { fieldValues, initialValid, onReset } = this.props
      const fieldsData = this.getInitialFieldsState(fieldValues)
      this.setState({
        fieldsData,
        isPristine: true,
        isValid: initialValid,
      }, ()=> {
        _.isFunction(onReset) && onReset(fieldsData)
      })
    }

    // Run on form submission
    submitForm(e) {
      e && e.preventDefault()
      return new Promise((resolve, reject)=> {
        this.runValidationsForAllFields()
          .then(() => {
            const allIsValid = this.refreshFormValidState()
            const { fieldsData } = this.state
            const { onSubmit } = this.props
            if (allIsValid) {
              let submission = onSubmit(fieldsData, this.resetForm)
              if (submission) {
                this.handleFormSubmission(submission)
              } else {
                console.warn("nothing returned from form submission")
              }
              resolve(fieldsData)
            } else {
              reject(fieldsData)
            }
          })
          .catch((e) => {
            reject(e)
          })
      })
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          handleReset={this.resetForm}
          handleSubmit={this.submitForm}
        />
      )
    }

  }

  ConnectedForm.displayName = WrappedComponent.displayName
                              ? `ConnectedForm${WrappedComponent.displayName}`
                              : "ConnectedForm"

  ConnectedForm.propTypes = {
    fieldValues: PropTypes.object,
    initialValid: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    onValid: PropTypes.func,
    onDirty: PropTypes.func,
    onInvalid: PropTypes.func,
    onPristine: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    onSubmitFailure: PropTypes.func,
  }

  ConnectedForm.defaultProps = {
    initialValid: false,
  }

  return ConnectedForm

}

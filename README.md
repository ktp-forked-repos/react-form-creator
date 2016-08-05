CreateForm
===========

CreateForm simplifies form creation and enables separation of concerns.

It does this by creating a higher order component that manages all form state including validation.

CreateForm is instantiated with two arguments—a form component, and a data structure object. It then returns a new stateful form component which can be used anywhere.

## Using CreateForm

#### 1. Start by declaring a data-structure object.

This describes the structure and behavior of your form. Each key maps to an input component in the form, and the attributes are handled by `CreateForm` to configure the inputs. See API (below) for full fieldsData options.

```jsx
fieldsData =
  email:
    label: "Email"
    placeholder: "Enter your email"
  password:
    label: "Password"
    placeholder: "Enter your password"
```

#### 2. Build the dumb UI form component.

This should be a stateless component that wraps the inputs in a `<form>`. Use JSX spread attributes to assign the `fieldsData`. Other elements can be included here, but the component's purpose should be limited to structure and layout.

```jsx
fieldsData = {...}

FormComponent = ()->
  <form>
    <TextInput {...fieldsData.email} />
    <TextInput {...fieldsData.password />
    <Button type="submit">Submit</Button>
  </form>
```

#### 3. Wrap the form to give it functionality.

Pass the `FormComponent` and `fieldsData` to `CreateForm`. This returns FormComponent as a new, wrapped component with access to everything from `CreateForm` as props.

```jsx
fieldsData = {...}

FormComponent = ({fieldsData, handleSubmit, ...props})->
  // Note that fieldsData is a prop at this point, not a direct reference to fieldsData
  <form onSubmit={handleSubmit}>
    <TextInput {...fieldsData.email} />
    <TextInput {...fieldsData.password />
    <Button type="submit">Submit</Button>
  </form>

StatefulForm = CreateForm(FormComponent, fieldsData)

module.exports = StatefulForm
```

#### 4. Connect the form to a store.

`CreateForm` provides hooks for all events, most importantly `onSubmit`. All events pass up `fieldsData` state. Another important prop is `fieldValues` which can be used to map state in the stores to fields in the form. Additional props can also be passed to the underlying FormComponent.

```jsx
fieldValues =
  email: store.state.email

handleSubmit = (fieldsData, resetForm)->
  store.action.submit(fieldsData).promise
    .then -> resetForm()

<StatefulForm
  fieldValues={fieldValues}
  onSubmit={handleSubmit}
  onValid={handleValid}
  {...passProps}
/>

ConnectedForm = ConnectStores(StatefulForm, stores, ...)

module.exports = ConnectedForm
```

#### 5. ??? Profit.

The form is completely self-contained and functional at this point. It can be embedded anywhere—inline, card modal, etc.

## CreateForm API

### Required Arguments
```
module.exports CreateForm(FormComponent, fieldsData)
```

#### `FormComponent`
A stateless `component` representing the UI, inputs wrapped in a `<form>`. Use JSX spread attributes to assign the `fieldsData` attributes. Other elements can be included here, but the component's concerns should be limited to structure and layout.

```jsx
FormComponent = ({fieldsData, handleSubmit, ...props})->
  <form onSubmit={handleSubmit}>
    <TextInput {...fieldsData.email} />
    <TextInput {...fieldsData.password />
    <Button type="submit">Submit</Button>
  </form>
```

#### `fieldsData`
This `object` describes the structure and behavior of your form. Each key maps to an input component in the form, and the attributes are handled by `CreateForm` to configure the inputs.
Inside each key set optional props for each field:
- **`validators`**  
An `array` of functions to run against the field's value.
In most cases you can use functions from `validators.js`.
- **`validationEvent`**
Determines when to *first* run validation.
Options:
 - `"onChange"` (default)
 - `"onBlur"`
 - `"onFocus"`

```jsx
fieldsData:
  username:
    label: "Username"
    validators: [validate.isAlphanumeric, validate.minLength(6)]
  email:
    label: "Email"
    validators: [validate.isEmail]
    validationEvent: "Blur"
```

### Props

#### `fieldValues`
An `object` that maps values from a model/store to fieldsData fields (keys should correspond to fieldsData keys).
```jsx
fieldValues = (user)->
  return {
    username: user.get("username")
    email: user.get("email")
  }

<StatefulForm fieldValues={fieldValues}>
```

#### `onSubmit`
A `function` called in response to form submit event. Passes fieldsData state and hook to `resetForm()`
```jsx
handleSubmit = (fieldsData, resetForm)->
  store.action.submit(fieldsData).promise
    .then -> resetForm()

<StatefulForm onSubmit={handleSubmit}>
```

#### `onValid`
A `function` called in response to form valid event. Passes fieldsData state.
```jsx
<StatefulForm onValid={allowSubmit}>
```

#### `onInvalid`
A `function` called in response to form invalid event. Passes fieldsData state.
```jsx
<StatefulForm onInvalid={preventSubmit}>
```

#### `onPristine`
A `function` called in response to form pristine event. Passes fieldsData state.
```jsx
<StatefulForm onPristine={allowClose}
```

#### `onDirty`
A `function` called in response to form dirty event. Passes fieldsData state and an array of (dirty) keys.
```jsx
<StatefulForm onDirty={preventClose}>
```

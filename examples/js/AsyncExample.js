// fake async fetch 
function isEmailUnique(value) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=> {
      if (value.length > 20) {
        reject(new Error("email is already in use"))
      } else {
        resolve()
      }
    }, 500)
  })
}

// fake async fetch 
function isUsernameUnique(value) {
  return new Promise((resolve, reject)=> {
    setTimeout(()=> {
      if (value.length > 20) {
        reject(new Error("username is taken"))
      } else {
        resolve()
      }
    }, 1000)
  })
}

// set static props for fields and configure validation
const fieldsData = {
  username: {
    label: "Username",
    placeholder: "Enter a username",
    validationEvent: "onBlur",
    validators: [validators.isAlphanumeric, isUsernameUnique],
  },
  email: {
    label: "Email",
    placeholder: "Enter your email",
    validationEvent: "onBlur",
    validators: [validators.isEmail, isEmailUnique],
    required: true,
  },
  password: {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    validationEvent: "onBlur",
    validators: [validators.minLength(6)],
    required: true,
  }
}

// an example controlled input component
function Input({id, label, value, placeholder, error, onChange, onBlur}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value || ""}
        placeholder={placeholder}
        onBlur={e => onBlur(e.target.value)}
        onChange={e => onChange(e.target.value)} 
      />
      <span>{error}</span>
    </div>
   )
}

// our form -- simple and declarative
function Form({fieldsData, handleSubmit}) {
  return (
    <form onSubmit={handleSubmit}>
      <Input {...fieldsData.username} />
      <Input {...fieldsData.email} />
      <Input {...fieldsData.password} />
      <button type="submit">Submit</button>
    </form>
  )
}

// this is where the magic happens: CreateForm
// glues together our Form component and fieldsData structure
// to create a new ConnectedForm component that handles all
// your form state and validation.
const ConnectedForm = CreateForm(Form, fieldsData)

ReactDOM.render(<ConnectedForm />, mountNode)
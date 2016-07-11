import '../styles/styles.scss'
import '../styles/theme.scss'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Playground from 'component-playground'
import { CreateForm, validators } from '../../dist'

import SimpleExample from 'raw!../raw/SimpleExample.example'
import AsyncExample from 'raw!../raw/AsyncExample.example'

class App extends Component {

  render() {
    return (
      <div className="Interactive">
        <Playground 
          theme="elegant"
          noRender={false}
          codeText={AsyncExample}
          scope={{ React, ReactDOM, CreateForm, validators }}
        />
      </div>
    )
  }

}


ReactDOM.render(
  <App />,
  document.getElementById('app')
)
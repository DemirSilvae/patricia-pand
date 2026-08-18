import './index.scss'
import './client'

import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import { ProtocolContextProvider } from './context/ProtocolContext'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ProtocolContextProvider>
      <Router>
        <App />
      </Router>
    </ProtocolContextProvider>,
  )
} else {
  console.error('Element with id "root" not found')
}

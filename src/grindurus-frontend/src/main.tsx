import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import './client'
import { ProtocolContextProvider } from './context/ProtocolContext'
import { BrowserRouter as Router } from 'react-router-dom'

const rootElement = document.getElementById('root')

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ProtocolContextProvider>
      <Router>
        <App />
      </Router>
    </ProtocolContextProvider>
  )
} else {
  console.error('Element with id "root" not found')
}
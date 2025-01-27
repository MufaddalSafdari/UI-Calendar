import React from 'react'
import ReactDOM from 'react-dom/client'
import CalendarWithBeautifiedStyles from './CalendarWithBeautifiedStyles'
import './CalendarWithBeautifiedStyles.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CalendarWithBeautifiedStyles />
  </React.StrictMode>,
)
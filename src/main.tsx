import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Messages from './common/Messages'
import { Provider } from 'react-redux'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <div className='fixed bottom-5 right-10 border-3 border-green-700'>
        <Messages />
      </div>
    </Provider>
  </React.StrictMode>
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Root } from './Root'
import { store } from './store'
import './index.css'
import { TooltipProvider } from './components/ui/tooltip'
import { I18nProvider } from './i18n'

const container = document.getElementById('root')
if (!container) throw new Error('Element #root not found')

createRoot(container).render(
  <StrictMode>
    <I18nProvider>
      <TooltipProvider>
        <Provider store={store}>
          <Root />
        </Provider>
      </TooltipProvider>
    </I18nProvider>
  </StrictMode>
)

import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'
import PANEL_CSS from './panel.css'

function injectPanelStyles (): void {
  if (!document.querySelector('style[data-wme-ui-panel]')) {
    const style = document.createElement('style')
    style.setAttribute('data-wme-ui-panel', '')
    style.innerHTML = unsafePolicy.createHTML(PANEL_CSS)
    document.head.appendChild(style)
  }
}

class WMEUIHelperPanel extends WMEUIHelperContainer {
  container (): HTMLElement | null {
    return document.getElementById('edit-panel')
  }

  inject (): void {
    this.container()?.append(this.html())
  }

  toHTML (): HTMLElement {
    injectPanelStyles()

    let label = document.createElement('wz-label') as HTMLElement
    label.className = 'wme-ui-panel-label'
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let content = document.createElement('div')
    content.className = 'wme-ui-panel-content'

    this.elements.forEach(element => content.append(element.html()))

    let panel = document.createElement('div')
    panel.className = 'wme-ui-panel form-group'
    panel.append(label)
    panel.append(content)
    return panel
  }
}

export { WMEUIHelperPanel }

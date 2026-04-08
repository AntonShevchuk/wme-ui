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
    ;(label as any).htmlFor = ''
    label.className = 'wme-ui-label'
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let controls = document.createElement('div')
    controls.className = 'wme-ui-panel-controls'
    this.elements.forEach(element => controls.append(element.html()))

    let group = document.createElement('div')
    group.className = 'wme-ui-panel-group form-group'
    group.append(label)
    group.append(controls)
    return group
  }
}

export { WMEUIHelperPanel }

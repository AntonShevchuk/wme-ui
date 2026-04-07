import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'
import MODAL_CSS from './modal.css'

function injectModalStyles (): void {
  if (!document.querySelector('style[data-wme-ui-modal]')) {
    const style = document.createElement('style')
    style.setAttribute('data-wme-ui-modal', '')
    style.innerHTML = unsafePolicy.createHTML(MODAL_CSS)
    document.head.appendChild(style)
  }
}

class WMEUIHelperModal extends WMEUIHelperContainer {
  container (): HTMLElement | null {
    return document.getElementById('tippy-container')
  }

  inject (): void {
    this.container()?.append(this.html())
  }

  toHTML (): HTMLElement {
    injectModalStyles()

    let panel = document.createElement('div')
    panel.className = 'wme-ui-panel'
    this.applyAttributes(panel)

    let close = document.createElement('button')
    close.className = 'wme-ui-close-panel'
    close.innerText = '\u00d7'
    close.onclick = function () {
      panel.remove()
    }

    let title = document.createElement('h5')
    title.innerHTML = unsafePolicy.createHTML(this.title)

    let header = document.createElement('div')
    header.className = 'wme-ui-header'
    header.prepend(title)
    header.prepend(close)

    let body = document.createElement('div')
    body.className = 'wme-ui-body'
    this.elements.forEach(element => body.append(element.html()))

    let footer = document.createElement('div')
    footer.className = 'wme-ui-footer'

    let container = document.createElement('div')
    container.className = 'wme-ui-panel-container'
    container.append(header)
    container.append(body)
    container.append(footer)

    panel.append(container)

    return panel
  }
}

export { WMEUIHelperModal }

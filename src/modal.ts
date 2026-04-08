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

    let modal = document.createElement('div')
    modal.className = 'wme-ui-modal'
    this.applyAttributes(modal)

    let close = document.createElement('button')
    close.className = 'wme-ui-modal-close'
    close.innerText = '\u00d7'
    close.onclick = function () {
      modal.remove()
    }

    let title = document.createElement('h5')
    title.innerHTML = unsafePolicy.createHTML(this.title)

    let header = document.createElement('div')
    header.className = 'wme-ui-modal-header'
    header.prepend(title)
    header.prepend(close)

    let content = document.createElement('div')
    content.className = 'wme-ui-modal-content'

    this.elements.forEach(element => content.append(element.html()))

    let footer = document.createElement('div')
    footer.className = 'wme-ui-modal-footer'

    let container = document.createElement('div')
    container.className = 'wme-ui-modal-container'
    container.append(header)
    container.append(content)
    container.append(footer)

    modal.append(container)

    return modal
  }
}

export { WMEUIHelperModal }

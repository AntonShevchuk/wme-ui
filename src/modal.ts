import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'

class WMEUIHelperModal extends WMEUIHelperContainer {
  container (): HTMLElement {
    return document.getElementById('tippy-container')
  }

  inject (): void {
    this.container().append(this.html())
  }

  toHTML (): HTMLElement {
    // Header and close button
    let close = document.createElement('button')
    close.className = 'wme-ui-close-panel'
    close.style.background = '#fff'
    close.style.border = '1px solid #ececec'
    close.style.borderRadius = '100%'
    close.style.cursor = 'pointer'
    close.style.fontSize = '20px'
    close.style.height = '20px'
    close.style.lineHeight = '16px'
    close.style.position = 'absolute'
    close.style.right = '14px'
    close.style.textIndent = '-2px'
    close.style.top = '14px'
    close.style.transition = 'all 150ms'
    close.style.width = '20px'
    close.style.zIndex = '99'
    close.innerText = '\u00d7'
    close.onclick = function () {
      panel.remove()
    }

    let title = document.createElement('h5')
    title.style.padding = '16px 16px 0'
    title.innerHTML = unsafePolicy.createHTML(this.title)

    let header = document.createElement('div')
    header.className = 'wme-ui-header'
    header.style.position = 'relative'
    header.prepend(title)
    header.prepend(close)

    // Body
    let body = document.createElement('div')
    body.className = 'wme-ui-body'
    body.style.maxHeight = '70vh'
    body.style.overflow = 'auto'

    this.elements.forEach(element => body.append(element.html()))

    // Footer
    let footer = document.createElement('div')
    footer.className = 'wme-ui-footer'
    footer.style.padding = '4px 0'

    // Container
    let container = document.createElement('div')
    container.className = 'wme-ui-panel-container'
    container.append(header)
    container.append(body)
    container.append(footer)

    // Panel
    let panel = document.createElement('div')
    panel.style.width = '320px'
    panel.style.background = '#fff'
    panel.style.margin = '15px'
    panel.style.borderRadius = '5px'
    panel.className = 'wme-ui-panel'
    panel.append(container)

    return panel
  }
}

export { WMEUIHelperModal }

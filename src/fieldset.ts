import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'
import FIELDSET_CSS from './fieldset.css'

function injectFieldsetStyles (): void {
  if (!document.querySelector('style[data-wme-ui-fieldset]')) {
    const style = document.createElement('style')
    style.setAttribute('data-wme-ui-fieldset', '')
    style.innerHTML = unsafePolicy.createHTML(FIELDSET_CSS)
    document.head.appendChild(style)
  }
}

class WMEUIHelperFieldset extends WMEUIHelperContainer {
  toHTML (): HTMLElement {
    injectFieldsetStyles()

    let legend = document.createElement('legend')
    legend.className = 'wme-ui-legend'
    legend.innerHTML = unsafePolicy.createHTML(this.title)

    let controls = document.createElement('div')
    controls.className = 'wme-ui-fieldset-controls'
    this.elements.forEach(element => controls.append(element.html()))

    let fieldset = document.createElement('fieldset')
    fieldset = this.applyAttributes(fieldset) as HTMLFieldSetElement
    fieldset.append(legend)
    fieldset.append(controls)
    return fieldset
  }
}

// Register with container to break circular dependency
WMEUIHelperContainer._fieldsetClass = WMEUIHelperFieldset

export { WMEUIHelperFieldset }

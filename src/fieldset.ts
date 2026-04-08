import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'

class WMEUIHelperFieldset extends WMEUIHelperContainer {
  toHTML (): HTMLElement {
    let legend = document.createElement('legend')
    legend.className = 'wme-ui-legend'
    legend.innerHTML = unsafePolicy.createHTML(this.title)

    let controls = document.createElement('div')
    controls.className = 'wme-ui-controls controls'
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

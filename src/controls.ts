import { WMEUIHelperElement } from './element'
import { unsafePolicy } from './unsafe-policy'

/**
 * Base class for controls
 */
class WMEUIHelperControl extends WMEUIHelperElement {
  constructor (uid: string, id: string, title: string, attributes: Record<string, any> = {}) {
    super(uid, id, title, attributes)
    if (!attributes.name) {
      this.attributes.name = this.id
    }
  }
}

/**
 * Input with label inside the div
 */
class WMEUIHelperControlInput extends WMEUIHelperControl {
  toHTML (): HTMLElement {
    let input = document.createElement('input')
    input.className = 'wme-ui-controls-input'
    input = this.applyAttributes(input) as HTMLInputElement

    let label = document.createElement('label')
    label.className = 'wme-ui-controls-label'
    label.htmlFor = input.id || this.uid + '-' + this.id
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let container = document.createElement('div')
    container.className = 'wme-ui-controls-container controls-container'
    container.append(label)

    // Add <output> element for range inputs to display current value
    if (this.attributes.type === 'range') {
      let output = document.createElement('output')
      output.className = 'wme-ui-controls-output'
      output.htmlFor.add(input.id || this.uid + '-' + this.id)
      output.value = String(input.value)
      const userCallback = input.onchange
      input.onchange = null
      input.oninput = function (e: Event) {
        output.value = (e.target as HTMLInputElement).value
        if (userCallback) userCallback.call(input, e)
      }
      container.append(output)
    }

    container.append(input)
    return container
  }
}

/**
 * Button with a shortcut if needed
 */
class WMEUIHelperControlButton extends WMEUIHelperControl {
  description: string
  callback: Function

  constructor (uid: string, id: string, title: string, description: string, callback: Function, attributes: Record<string, any> = {}) {
    super(uid, id, title, attributes)
    this.description = description
    this.callback = callback
  }

  toHTML (): HTMLElement {
    let button = document.createElement('button')
    button.className = 'wme-ui-controls-button waze-btn waze-btn-small waze-btn-white'
    button.innerHTML = unsafePolicy.createHTML(this.title)
    button.title = this.description
    button.onclick = this.callback as any
    this.applyAttributes(button)
    return button
  }
}

export { WMEUIHelperControl, WMEUIHelperControlInput, WMEUIHelperControlButton }

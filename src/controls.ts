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
    input = this.applyAttributes(input) as HTMLInputElement

    let label = document.createElement('label')
    label.htmlFor = input.id || this.uid + '-' + this.id
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let container = document.createElement('div')
    container.className = 'controls-container'
    container.append(input)
    container.append(label)
    return container
  }
}

/**
 * Button with shortcut if needed
 */
class WMEUIHelperControlButton extends WMEUIHelperControl {
  description: string
  callback: Function

  constructor (uid: string, id: string, title: string, description: string, callback: Function) {
    super(uid, id, title)
    this.description = description
    this.callback = callback
  }

  toHTML (): HTMLElement {
    let button = document.createElement('button')
    button.className = 'waze-btn waze-btn-small waze-btn-white'
    button.innerHTML = unsafePolicy.createHTML(this.title)
    button.title = this.description
    button.onclick = this.callback as any
    return button
  }
}

export { WMEUIHelperControl, WMEUIHelperControlInput, WMEUIHelperControlButton }

import { WMEUIHelperElement } from './element'
import { unsafePolicy } from './unsafe-policy'

class WMEUIHelperDiv extends WMEUIHelperElement {
  toHTML (): HTMLElement {
    let div = document.createElement('div')
    div = this.applyAttributes(div) as HTMLDivElement
    div.id = this.uid + '-' + this.id
    if (this.title) {
      div.innerHTML = unsafePolicy.createHTML(this.title)
    }
    return div
  }
}

export { WMEUIHelperDiv }

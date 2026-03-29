import { WMEUIHelperElement } from './element'
import { unsafePolicy } from './unsafe-policy'

class WMEUIHelperText extends WMEUIHelperElement {
  toHTML (): HTMLElement {
    let p = document.createElement('p')
    p = this.applyAttributes(p) as HTMLParagraphElement
    p.innerHTML = unsafePolicy.createHTML(this.title)
    return p
  }
}

export { WMEUIHelperText }

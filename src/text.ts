import { WMEUIHelperElement } from './element'
import { unsafePolicy } from './unsafe-policy'

class WMEUIHelperText extends WMEUIHelperElement {
  toHTML (): HTMLElement {
    let p = document.createElement('p')
    p.className = 'wme-ui-helper-text'
    p = this.applyAttributes(p) as HTMLParagraphElement
    p.innerHTML = unsafePolicy.createHTML(this.title)
    return p
  }

  /**
   * Update text content after rendering
   */
  setText (text: string): void {
    this.title = text
    if (this.element) {
      this.element.innerHTML = unsafePolicy.createHTML(text)
    }
  }
}

export { WMEUIHelperText }

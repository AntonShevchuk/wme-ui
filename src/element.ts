class WMEUIHelperElement {
  uid: string
  id: string
  title: string | null
  attributes: Record<string, any>
  element: HTMLElement | null
  elements: WMEUIHelperElement[]

  constructor (uid: string, id: string, title: string | null = null, attributes: Record<string, any> = {}) {
    this.uid = uid
    this.id = id
    this.title = title
    this.attributes = attributes
    this.element = null
    this.elements = []
  }

  /**
   * Add WMEUIHelperElement to container
   */
  addElement (element: WMEUIHelperElement): WMEUIHelperElement {
    this.elements.push(element)
    return element
  }

  /**
   * Remove WMEUIHelperElement from container
   */
  removeElement (element: WMEUIHelperElement): void {
    const index = this.elements.indexOf(element)
    if (index !== -1) {
      this.elements.splice(index, 1)
      element.html().remove()
    }
  }

  /**
   * Apply attributes to HTML element
   */
  applyAttributes (element: HTMLElement): HTMLElement {
    for (const [attr, value] of Object.entries(this.attributes)) {
      (element as any)[attr] = value
    }
    return element
  }

  /**
   * Get or build HTML element
   */
  html (): HTMLElement {
    if (!this.element) {
      this.element = this.toHTML()
      this.element.className += ' ' + this.uid + ' ' + this.uid + '-' + this.id
    }
    return this.element
  }

  /**
   * Build and return HTML elements for injection
   */
  toHTML (): HTMLElement {
    throw new Error('Abstract method')
  }
}

export { WMEUIHelperElement }

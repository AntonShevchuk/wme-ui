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
   * Add WMEUIHelperElement to the container
   * If already rendered, appends the new child to the live DOM
   */
  addElement (element: WMEUIHelperElement): WMEUIHelperElement {
    this.elements.push(element)
    if (this.element) {
      const container = this.getChildContainer()
      if (container) {
        container.append(element.html())
      }
    }
    return element
  }

  /**
   * Remove this element from the DOM and reset its state
   */
  remove (): void {
    if (this.element) {
      this.element.remove()
      this.element = null
    }
  }

  /**
   * Remove WMEUIHelperElement from the container
   */
  removeElement (element: WMEUIHelperElement): void {
    const index = this.elements.indexOf(element)
    if (index !== -1) {
      this.elements.splice(index, 1)
      element.html().remove()
    }
  }

  /**
   * Find the child container element in the rendered DOM
   */
  getChildContainer (): HTMLElement | null {
    if (!this.element) return null
    return this.element.querySelector('.wme-ui-modal-content')
      || this.element.querySelector('.wme-ui-panel-content')
      || this.element.querySelector('.wme-ui-tab-content')
      || this.element.querySelector('.wme-ui-fieldset-content')
      || this.element
  }

  /**
   * Apply attributes to the HTML element
   */
  applyAttributes (element: HTMLElement): HTMLElement {
    for (const [attr, value] of Object.entries(this.attributes)) {
      if (attr === 'className' && element.className) {
        element.className += ' ' + value
      } else {
        (element as any)[attr] = value
      }
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

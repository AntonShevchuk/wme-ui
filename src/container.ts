import { WMEUIHelperElement } from './element'
import { WMEUIHelperControlButton, WMEUIHelperControlInput } from './controls'
import { WMEUIHelperDiv } from './div'
import { WMEUIHelperText } from './text'
import type { WMEUIHelperFieldset as FieldsetType } from './fieldset'

class WMEUIHelperContainer extends WMEUIHelperElement {
  /**
   * Create and add button
   */
  addButton (id: string, title: string, description: string, callback: Function): WMEUIHelperElement {
    return this.addElement(
      new WMEUIHelperControlButton(this.uid, id, title, description, callback)
    )
  }

  /**
   * Create buttons
   */
  addButtons (buttons: Record<string, any>): void {
    for (let key in buttons) {
      if (buttons.hasOwnProperty(key)) {
        this.addButton(
          key,
          buttons[key].title,
          buttons[key].description,
          buttons[key].callback,
        )
      }
    }
  }

  /**
   * Create checkbox
   */
  addCheckbox (id: string, title: string, callback: Function, checked: boolean = false): WMEUIHelperElement {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onclick': callback,
        'type': 'checkbox',
        'value': 1,
        'checked': checked,
      })
    )
  }

  /**
   * Create and add WMEUIHelperDiv element
   */
  addDiv (id: string, innerHTML: string | null = null, attributes: Record<string, any> = {}): WMEUIHelperElement {
    return this.addElement(
      new WMEUIHelperDiv(this.uid, id, innerHTML, attributes)
    )
  }

  /**
   * Create and add WMEUIHelperFieldset element
   */
  addFieldset (id: string, title: string): WMEUIHelperElement {
    return this.addElement(
      new (WMEUIHelperContainer._fieldsetClass as any)(this.uid, id, title)
    )
  }

  /** @internal — set by fieldset module to break circular dependency */
  static _fieldsetClass: typeof FieldsetType

  /**
   * Create text input
   */
  addInput (id: string, title: string, callback: Function, value: string = ''): WMEUIHelperElement {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'text',
        'value': value,
      })
    )
  }

  /**
   * Create number input
   */
  addNumber (id: string, title: string, callback: Function, value: number = 0, min: number, max: number, step: number = 10): WMEUIHelperElement {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'number',
        'value': value,
        'min': min,
        'max': max,
        'step': step,
      })
    )
  }

  /**
   * Create radiobutton
   */
  addRadio (id: string, title: string, callback: Function, name: string, value: string, checked: boolean = false): WMEUIHelperElement {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'name': name,
        'onclick': callback,
        'type': 'radio',
        'value': value,
        'checked': checked,
      })
    )
  }

  /**
   * Create range input
   */
  addRange (id: string, title: string, callback: Function, value: number, min: number, max: number, step: number = 10): WMEUIHelperElement {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'range',
        'value': value,
        'min': min,
        'max': max,
        'step': step,
      })
    )
  }

  /**
   * Create and add WMEUIHelperText element
   */
  addText (id: string, text: string): WMEUIHelperElement {
    return this.addElement(new WMEUIHelperText(this.uid, id, text))
  }
}

export { WMEUIHelperContainer }

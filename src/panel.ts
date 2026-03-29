import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'

class WMEUIHelperPanel extends WMEUIHelperContainer {
  container (): HTMLElement | null {
    return document.getElementById('edit-panel')
  }

  inject (): void {
    this.container()?.append(this.html())
  }

  toHTML (): HTMLElement {
    let label = document.createElement('wz-label') as HTMLElement
    ;(label as any).htmlFor = ''
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let controls = document.createElement('div')
    controls.className = 'controls'
    this.elements.forEach(element => controls.append(element.html()))

    let group = document.createElement('div')
    group.className = 'form-group'
    group.append(label)
    group.append(controls)
    return group
  }
}

export { WMEUIHelperPanel }

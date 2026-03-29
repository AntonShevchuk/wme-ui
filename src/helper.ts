import { WMEUI } from './wmeui'
import { WMEUIHelperPanel } from './panel'
import { WMEUIHelperTab } from './tab'
import { WMEUIHelperModal } from './modal'
import { WMEUIHelperFieldset } from './fieldset'

class WMEUIHelper {
  uid: string
  index: number

  constructor (uid: string) {
    this.uid = WMEUI.normalize(uid)
    this.index = 0
  }

  /**
   * Generate unique ID
   */
  generateId (): string {
    this.index++
    return this.uid + '-' + this.index
  }

  /**
   * Create a panel for the sidebar
   */
  createPanel (title: string, attributes: Record<string, any> = {}): WMEUIHelperPanel {
    return new WMEUIHelperPanel(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a tab for the sidebar
   */
  createTab (title: string, attributes: Record<string, any> = {}): WMEUIHelperTab {
    return new WMEUIHelperTab(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a modal window
   */
  createModal (title: string, attributes: Record<string, any> = {}): WMEUIHelperModal {
    return new WMEUIHelperModal(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a field set
   */
  createFieldset (title: string, attributes: Record<string, any> = {}): WMEUIHelperFieldset {
    return new WMEUIHelperFieldset(this.uid, this.generateId(), title, attributes)
  }
}

export { WMEUIHelper }

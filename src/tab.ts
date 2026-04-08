import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'
import TAB_CSS from './tab.css'

function injectTabStyles (): void {
  if (!document.querySelector('style[data-wme-ui-tab]')) {
    const style = document.createElement('style')
    style.setAttribute('data-wme-ui-tab', '')
    style.innerHTML = unsafePolicy.createHTML(TAB_CSS)
    document.head.appendChild(style)
  }
}

class WMEUIHelperTab extends WMEUIHelperContainer {
  sidebar: any
  icon: string | undefined
  image: string | undefined

  constructor (uid: string, id: string, title: string, attributes: Record<string, any> = {}) {
    super(uid, id, title, attributes)
    this.sidebar = attributes.sidebar
    this.icon = attributes.icon
    this.image = attributes.image
  }

  async inject (): Promise<void> {
    const { tabLabel, tabPane } = await this.sidebar.registerScriptTab(this.uid)

    tabLabel.innerText = this.title
    tabLabel.title = this.title

    tabPane.append(this.html())
  }

  toHTML (): HTMLElement {
    injectTabStyles()

    let header = document.createElement('div')
    header.className = 'wme-ui-tab-header panel-header-component settings-header'

    if (this.icon) {
      let icon = document.createElement('i')
      icon.className = 'wme-ui-tab-icon w-icon panel-header-component-icon w-icon-' + this.icon
      header.append(icon)
    }

    if (this.image) {
      let img = document.createElement('img')
      img.className = 'wme-ui-tab-image'
      img.src = this.image
      header.append(img)
    }

    let title = document.createElement('div')
    title.className = 'wme-ui-tab-title feature-id-container'
    title.innerHTML = unsafePolicy.createHTML(
      '<wz-overline>' + this.title + '</wz-overline>'
    )
    header.append(title)

    let content = document.createElement('div')
    content.className = 'wme-ui-tab-content'

    this.elements.forEach(element => content.append(element.html()))

    let tab = document.createElement('div')
    tab.className = 'wme-ui-tab form-group'
    tab.append(header)
    tab.append(content)

    return tab
  }
}

export { WMEUIHelperTab }

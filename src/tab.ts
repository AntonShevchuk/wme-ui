import { WMEUIHelperContainer } from './container'
import { unsafePolicy } from './unsafe-policy'

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
    let header = document.createElement('div')
    header.className = 'panel-header-component settings-header'
    header.style.alignItems = 'center'
    header.style.display = 'flex'
    header.style.gap = '9px'
    header.style.justifyContent = 'stretch'
    header.style.padding = '8px'
    header.style.width = '100%'

    if (this.icon) {
      let icon = document.createElement('i')
      icon.className = 'w-icon panel-header-component-icon w-icon-' + this.icon
      icon.style.fontSize = '24px'
      header.append(icon)
    }

    if (this.image) {
      let img = document.createElement('img')
      img.style.height = '42px'
      img.src = this.image
      header.append(img)
    }

    let title = document.createElement('div')
    title.className = 'feature-id-container'
    title.innerHTML = unsafePolicy.createHTML(
      '<wz-overline>' + this.title + '</wz-overline>'
    )
    header.append(title)

    let controls = document.createElement('div')
    controls.className = 'button-toolbar'

    this.elements.forEach(element => controls.append(element.html()))

    let group = document.createElement('div')
    group.className = 'form-group'
    group.append(header)
    group.append(controls)

    return group
  }
}

export { WMEUIHelperTab }

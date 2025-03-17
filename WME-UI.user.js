// ==UserScript==
// @name         WME UI
// @version      0.2.6
// @description  UI Library for Waze Map Editor Greasy Fork scripts
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-ui/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://anton.shevchuk.name&size=64
// @grant        none
// ==/UserScript==

/* jshint esversion: 8 */
/* global W, I18n */

// WARNING: this is unsafe!
let unsafePolicy = {
  createHTML: string => string
}

// Feature testing
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  unsafePolicy = window.trustedTypes.createPolicy('unsafe', {
    createHTML: string => string,
  })
}

class WMEUI {
  /**
   * Normalize title or UID
   * @param string
   * @returns {string}
   */
  static normalize (string) {
    return string.replace(/\W+/gi, '-').toLowerCase()
  }

  /**
   * Inject CSS styles
   * @param {String} css
   * @return void
   */
  static addStyle (css) {
    let style = document.createElement('style')
    style.type = 'text/css' // is required
    style.innerHTML = unsafePolicy.createHTML(css)
    document.querySelector('head').appendChild(style)
  }

  /**
   * Add translation for the I18n object
   * @param {String} uid
   * @param {Object} data
   * @return void
   */
  static addTranslation (uid, data) {
    if (!data.en) {
      console.error('Default translation `en` is required')
    }
    let locale = I18n.currentLocale()
    I18n.translations[locale][uid] = data[locale] || data.en
  }

  /**
   * Create and register shortcut
   * @param {String} name
   * @param {String} desc
   * @param {String} group
   * @param {String} title
   * @param {String} shortcut
   * @param {Function} callback
   * @param {Object} scope
   * @return void
   */
  static addShortcut (name, desc, group, title, shortcut, callback, scope = null) {
    new WMEUIShortcut(name, desc, group, title, shortcut, callback, scope).register()
  }
}

/**
 * God class, create it once
 */
class WMEUIHelper {
  constructor (uid) {
    this.uid = WMEUI.normalize(uid)
    this.index = 0
  }

  /**
   * Generate unque ID
   * @return {string}
   */
  generateId () {
    this.index++
    return this.uid + '-' + this.index
  }

  /**
   * Create a panel for the sidebar
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperPanel}
   */
  createPanel (title, attributes = {}) {
    return new WMEUIHelperPanel(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a tab for the sidebar
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperTab}
   */
  createTab (title, attributes = {}) {
    return new WMEUIHelperTab(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a modal window
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperModal}
   */
  createModal (title, attributes = {}) {
    return new WMEUIHelperModal(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a field set
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperFieldset}
   */
  createFieldset (title, attributes = {}) {
    return new WMEUIHelperFieldset(this.uid, this.generateId(), title, attributes)
  }
}

/**
 * Basic for all UI elements
 */
class WMEUIHelperElement {
  constructor (uid, id, title = null, attributes = {}) {
    this.uid = uid
    this.id = id
    this.title = title
    // HTML attributes
    this.attributes = attributes
    // DOM element
    this.element = null
    // Children
    this.elements = []
  }

  /**
   * Add WMEUIHelperElement to container
   * @param {WMEUIHelperElement} element
   * @return {WMEUIHelperElement} element
   */
  addElement (element) {
    this.elements.push(element)
    return element
  }

  /**
   * @param {HTMLElement} element
   * @return {HTMLElement}
   */
  applyAttributes (element) {
    for (let attr in this.attributes) {
      if (this.attributes.hasOwnProperty(attr)) {
        element[attr] = this.attributes[attr]
      }
    }
    return element
  }

  /**
   * @return {HTMLElement}
   */
  html () {
    if (!this.element) {
      this.element = this.toHTML()
      this.element.className += ' ' + this.uid + ' ' + this.uid + '-' + this.id
    }
    return this.element
  }

  /**
   * Build and return HTML elements for injection
   * @return {HTMLElement}
   */
  toHTML () {
    throw new Error('Abstract method')
  }
}

/**
 * Basic for all UI containers
 */
class WMEUIHelperContainer extends WMEUIHelperElement {
  /**
   * Create and add button
   * For Tab Panel Modal Fieldset
   * @param {String} id
   * @param {String} title
   * @param {String} description
   * @param {Function} callback
   * @param {String} shortcut
   * @return {WMEUIHelperElement} element
   */
  addButton (id, title, description, callback, shortcut = null) {
    return this.addElement(new WMEUIHelperControlButton(this.uid, id, title, description, callback, shortcut))
  }

  /**
   * Create buttons
   * @param {Object} buttons
   */
  addButtons (buttons) {
    for (let btn in buttons) {
      if (buttons.hasOwnProperty(btn)) {
        this.addButton(
          btn,
          buttons[btn].title,
          buttons[btn].description,
          buttons[btn].callback,
          buttons[btn].shortcut,
        )
      }
    }
  }

  /**
   * Create checkbox
   * For Tab, Panel, Modal, or Fieldset
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {Boolean} checked
   * @return {WMEUIHelperElement} element
   */
  addCheckbox (id, title, callback, checked = false) {
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
   * @param {String} id
   * @param {String} innerHTML
   * @param {Object} attributes
   * @return {WMEUIHelperElement} element
   */
  addDiv (id, innerHTML = null, attributes = {}) {
    return this.addElement(new WMEUIHelperDiv(this.uid, id, innerHTML, attributes))
  }

  /**
   * Create and add WMEUIHelperFieldset element
   * For Tab, Panel, Modal
   * @param {String} id
   * @param {String} title
   * @return {WMEUIHelperElement} element
   */
  addFieldset (id, title) {
    return this.addElement(new WMEUIHelperFieldset(this.uid, id, title))
  }

  /**
   * Create text input
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {String} value
   * @return {WMEUIHelperElement} element
   */
  addInput (id, title, callback, value = '') {
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
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   * @param {Number} step
   * @return {WMEUIHelperElement} element
   */
  addNumber (id, title, callback, value = 0, min, max, step = 10) {
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
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {String} name
   * @param {String} value
   * @param {Boolean} checked
   * @return {WMEUIHelperElement} element
   */
  addRadio (id, title, callback, name, value, checked = false) {
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
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   * @param {Number} step
   * @return {WMEUIHelperElement} element
   */
  addRange (id, title, callback, value, min, max, step = 10) {
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
   * @param {String} id
   * @param {String} text
   * @return {WMEUIHelperElement} element
   */
  addText (id, text) {
    return this.addElement(new WMEUIHelperText(this.uid, id, text))
  }
}

class WMEUIHelperFieldset extends WMEUIHelperContainer {
  toHTML () {
    // Fieldset legend
    let legend = document.createElement('legend')
    legend.innerHTML = unsafePolicy.createHTML(this.title)

    // Container for buttons
    let controls = document.createElement('div')
    controls.className = 'controls'
    // Append buttons to container
    this.elements.forEach(element => controls.append(element.html()))

    let fieldset = document.createElement('fieldset')
    fieldset = this.applyAttributes(fieldset)
    fieldset.append(legend)
    fieldset.append(controls)
    return fieldset
  }
}

class WMEUIHelperPanel extends WMEUIHelperContainer {
  container () {
    return document.getElementById('edit-panel')
  }

  inject () {
    this.container().append(this.html())
  }

  toHTML () {
    // Label of the panel
    let label = document.createElement('label')
    label.className = 'control-label'
    label.innerHTML = unsafePolicy.createHTML(this.title)
    // Container for buttons
    let controls = document.createElement('div')
    controls.className = 'controls'
    // Append buttons to panel
    this.elements.forEach(element => controls.append(element.html()))
    // Build panel
    let group = document.createElement('div')
    group.className = 'form-group'
    group.append(label)
    group.append(controls)
    return group
  }
}

class WMEUIHelperTab extends WMEUIHelperContainer {
  constructor (uid, id, title, attributes = {}) {
    super(uid, id, title, attributes)
    this.icon = attributes.icon
    this.image = attributes.image
  }

  async inject () {
    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(this.uid)

    tabLabel.innerText = this.title
    tabLabel.title = this.title

    tabPane.append(this.html())
  }

  toHTML () {
    // Label of the panel
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
      '<div class="feature-id-container"><wz-overline>' + this.title + '</wz-overline></div>'
    )
    header.append(title)

    // Container for buttons
    let controls = document.createElement('div')
    controls.className = 'button-toolbar'

    // Append buttons to container
    this.elements.forEach(element => controls.append(element.html()))

    // Build a form group
    let group = document.createElement('div')
    group.className = 'form-group'
    group.append(header)
    group.append(controls)

    return group
  }
}

class WMEUIHelperModal extends WMEUIHelperContainer {
  container () {
    return document.getElementById('tippy-container')
  }

  inject () {
    this.container().append(this.html())
  }

  toHTML () {
    // Header and close button
    let close = document.createElement('a')
    close.className = 'close-panel'
    close.onclick = function () {
      panel.remove()
    }

    let title = document.createElement('h5')
    title.innerHTML = unsafePolicy.createHTML(this.title)

    let header = document.createElement('div')
    header.className = 'header'
    header.style.position = 'relative'
    header.prepend(title)
    header.prepend(close)

    // Body
    let body = document.createElement('div')
    body.className = 'body'

    // Append buttons to panel
    this.elements.forEach(element => body.append(element.html()))

    // Container
    let archivePanel = document.createElement('div')
    archivePanel.className = 'archive-panel'
    archivePanel.append(header)
    archivePanel.append(body)

    let panel = document.createElement('div')
    panel.id = 'wme-ui-panel-container'
    panel.style.width = '320px'
    panel.style.background = '#ffffff'
    panel.style.margin = '15px'
    panel.style.borderRadius = '5px'
    panel.className = '' // 'panel panel--to-be-deprecated show'
    panel.append(archivePanel)

    return panel
  }
}

/**
 * Just div, can be with text
 */
class WMEUIHelperDiv extends WMEUIHelperElement {
  toHTML () {
    let div = document.createElement('div')
    div = this.applyAttributes(div)
    div.id = this.uid + '-' + this.id
    if (this.title) {
      div.innerHTML = unsafePolicy.createHTML(this.title)
    }
    return div
  }
}

/**
 * Just a paragraph with text
 */
class WMEUIHelperText extends WMEUIHelperElement {
  toHTML () {
    let p = document.createElement('p')
    p = this.applyAttributes(p)
    p.innerHTML = unsafePolicy.createHTML(this.title)
    return p
  }
}

/**
 * Base class for controls
 */
class WMEUIHelperControl extends WMEUIHelperElement {
  constructor (uid, id, title, attributes = {}) {
    super(uid, id, title, attributes)
    if (!attributes.name) {
      this.attributes.name = this.id
    }
  }
}

/**
 * Input with label inside the div
 */
class WMEUIHelperControlInput extends WMEUIHelperControl {
  toHTML () {
    let input = document.createElement('input')
    input = this.applyAttributes(input)

    let label = document.createElement('label')
    label.htmlFor = input.id
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let container = document.createElement('div')
    container.className = 'controls-container'
    container.append(input)
    container.append(label)
    return container
  }
}

/**
 * Button with shortcut if needed
 */
class WMEUIHelperControlButton extends WMEUIHelperControl {
  constructor (uid, id, title, description, callback, shortcut = null) {
    super(uid, id, title)
    this.description = description
    this.callback = callback
    if (shortcut) {
      /* name, desc, group, title, shortcut, callback, scope */
      new WMEUIShortcut(
        this.uid + '-' + this.id,
        this.description,
        this.uid,
        title,
        shortcut,
        this.callback
      ).register()
    }
  }

  toHTML () {
    let button = document.createElement('button')
    button.className = 'waze-btn waze-btn-small waze-btn-white'
    button.innerHTML = unsafePolicy.createHTML(this.title)
    button.title = this.description
    button.onclick = this.callback
    return button
  }
}

/**
 * Based on the code from the WazeWrap library
 */
class WMEUIShortcut {
  /**
   * @param {String} name
   * @param {String} desc
   * @param {String} group
   * @param {String} title
   * @param {String} shortcut
   * @param {Function} callback
   * @param {Object} scope
   * @return {WMEUIShortcut}
   */
  constructor (name, desc, group, title, shortcut, callback, scope = null) {
    this.name = name
    this.desc = desc
    this.group = WMEUI.normalize(group) || 'default'
    this.title = title
    this.shortcut = null
    this.callback = callback
    this.scope = ('object' === typeof scope) ? scope : null

    /* Setup shortcut */
    if (shortcut && shortcut.length > 0) {
      this.shortcut = { [shortcut]: name }
    }
  }

  /**
   * @param {String} group name
   * @param {String} title of the shortcut section
   */
  static setGroupTitle (group, title) {
    group = WMEUI.normalize(group)

    if (!I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[group]) {
      I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[group] = {
        description: title,
        members: {}
      }
    } else {
      I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[group].description = title
    }
  }

  /**
   * Add translation for shortcut
   */
  addTranslation () {
    if (!I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[this.group]) {
      I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[this.group] = {
        description: this.title,
        members: {
          [this.name]: this.desc
        }
      }
    }
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[this.group].members[this.name] = this.desc
  }

  /**
   * Register group/action/event/shortcut
   */
  register () {
    /* Try to initialize a new group */
    this.addGroup()

    /* Clear existing actions with the same name and create new */
    this.addAction()

    /* Try to register new event */
    this.addEvent()

    /* Finally, register the shortcut */
    this.registerShortcut()
  }

  /**
   * Determines if the shortcut's action already exists.
   * @private
   */
  doesGroupExist () {
    return 'undefined' !== typeof W.accelerators.Groups[this.group]
      && 'undefined' !== typeof W.accelerators.Groups[this.group].members
  }

  /**
   * Determines if the shortcut's action already exists.
   * @private
   */
  doesActionExist () {
    return 'undefined' !== typeof W.accelerators.Actions[this.name]
  }

  /**
   * Determines if the shortcut's event already exists.
   * @private
   */
  doesEventExist () {
    return 'undefined' !== typeof W.accelerators.events.dispatcher._events[this.name]
      && W.accelerators.events.dispatcher._events[this.name].length > 0
      && this.callback === W.accelerators.events.dispatcher._events[this.name][0].func
      && this.scope === W.accelerators.events.dispatcher._events[this.name][0].obj
  }

  /**
   * Creates the shortcut's group.
   * @private
   */
  addGroup () {
    if (this.doesGroupExist()) return

    W.accelerators.Groups[this.group] = []
    W.accelerators.Groups[this.group].members = []
  }

  /**
   * Registers the shortcut's action.
   * @private
   */
  addAction () {
    if (this.doesActionExist()) {
      W.accelerators.Actions[this.name] = null
    }
    W.accelerators.addAction(this.name, { group: this.group })
  }

  /**
   * Registers the shortcut's event.
   * @private
   */
  addEvent () {
    if (this.doesEventExist()) return
    W.accelerators.events.register(this.name, this.scope, this.callback)
  }

  /**
   * Registers the shortcut's keyboard shortcut.
   * @private
   */
  registerShortcut () {
    if (this.shortcut) {
      /* Setup translation for shortcut */
      this.addTranslation()
      W.accelerators._registerShortcuts(this.shortcut)
    }
  }
}

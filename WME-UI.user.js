// ==UserScript==
// @name         WME UI
// @version      0.0.3
// @description  UI Library for Waze Map Editor Greasy Fork scripts
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-ui/issues
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @exclude      https://beta.waze.com/user/editor*
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
  });
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
   * Apply CSS styles
   */
  static addStyle (css) {
    let style = document.createElement('style')
    style.type = 'text/css' // is required
    style.innerHTML = unsafePolicy.createHTML(css)
    document.querySelector('head').appendChild(style)
  }

  /**
   * @param {String} uid
   * @param {Object} data
   */
  static addTranslation (uid, data) {
    if (!data.en) {
      console.error('Default translation `en` is required')
    }
    let locale = I18n.currentLocale()
    I18n.translations[locale][uid] = data[locale] || data.en
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
   * @param {String} description
   * @param {Object} attributes
   * @return {WMEUIHelperPanel}
   */
  createPanel (title, description = null, attributes = {}) {
    return new WMEUIHelperPanel(this.uid, this.generateId(), title, description, attributes)
  }

  /**
   * Create a tab for the sidebar
   * @param {String} title
   * @param {String} description
   * @param {Object} attributes
   * @return {WMEUIHelperTab}
   */
  createTab (title, description = null, attributes = {}) {
    return new WMEUIHelperTab(this.uid, this.generateId(), title, description, attributes)
  }

  /**
   * Create a modal window
   * @param {String} title
   * @param {String} description
   * @param {Object} attributes
   * @return {WMEUIHelperModal}
   */
  createModal (title, description = null) {
    return new WMEUIHelperModal(this.uid, this.generateId(), title, description)
  }

  /**
   * Create a field set
   * @param {String} title
   * @param {String} description
   * @param {Object} attributes
   * @return {WMEUIHelperFieldset}
   */
  createFieldset (title, description = null) {
    return new WMEUIHelperFieldset(this.uid, this.generateId(), title, description)
  }
}

/**
 * Basic for all UI elements
 */
class WMEUIHelperElement {
  constructor (uid, id, title, description = null, attributes = {}) {
    this.uid = uid
    this.id = id
    this.title = title
    this.description = description
    this.attributes = attributes
    this.domElement = null
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
    if (!this.domElement) {
      this.domElement = this.toHTML()
      this.domElement.className += ' ' + this.uid + ' ' + this.uid + '-' + this.id
    }
    return this.domElement
  }

  /**
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
  constructor (uid, id, title, description = null, attributes = {}) {
    super(uid, id, title, description, attributes)
    this.elements = []
    if (description) {
      this.addText('description', description)
    }
  }

  /**
   * Add HTMLElement to container
   * @param {WMEUIHelperElement} element
   */
  addElement (element) {
    this.elements.push(element)
  }

  /**
   * Create and add WMEUIHelperText element
   * For Tab, Panel, Modal, or Fieldset
   * @param {String} id
   * @param {String} text
   */
  addText (id, text) {
    return this.addElement(new WMEUIHelperText(this.uid, id, text))
  }

  /**
   * Create and add fieldset element
   * For Tab, Panel, Modal
   * @param {String} id
   * @param {String} title
   * @param {String} description
   */
  addFieldset (id, title, description) {
    return this.addElement(new WMEUIHelperFieldset(this.uid, id, title, description))
  }

  /**
   * Create checkbox
   * For Tab, Panel, Modal, or Fieldset
   * @param {String} id
   * @param {String} title
   * @param {String} description
   * @param {Function} callback
   * @param {String} value
   */
  addInput (id, title, description, callback, value = '') {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, description, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'text',
        'value': value,
      })
    )
  }

  /**
   * Create checkbox
   * For Tab, Panel, Modal, or Fieldset
   * @param {String} id
   * @param {String} title
   * @param {String} description
   * @param {Function} callback
   * @param {Bool} checked
   */
  addCheckbox (id, title, description, callback, checked = false) {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, description, {
        'id': this.uid + '-' + id,
        'onclick': callback,
        'type': 'checkbox',
        'value': 1,
        'checked': checked,
      })
    )
  }

  /**
   * Create radiobutton
   * @param {String} id
   * @param {String} title
   * @param {String} description
   * @param {Function} callback
   * @param {String} value
   * @param {Bool} checked
   */
  addRadio (id, title, description, callback, value, checked = false) {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, description, {
        'id': this.uid + '-' + id + '-' + value,
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
   * @param {String} description
   * @param {Function} callback
   * @param {Integer} min
   * @param {Integer} max
   * @param {Integer} value
   * @param {Integer} step
   */
  addRange (id, title, description, callback, min, max, value, step = 10) {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, description, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'range',
        'min': min,
        'max': max,
        'value': value,
        'step': step,
      })
    )
  }

  /**
   * Create and add button
   * For Tab Panel Modal Fieldset
   * @param {String} id
   * @param {String} title
   * @param {String} description
   * @param {Function} callback
   * @param {String} shortcut
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
    fieldset.append(legend, controls)
    return fieldset
  }
}

class WMEUIHelperPanel extends WMEUIHelperContainer {
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
  constructor (uid, id, title, description = null, attributes = {}) {
    super(uid, id, title, description, attributes)
    this.icon = attributes.icon ? attributes.icon : ''
  }

  container () {
    return document.querySelector('.tab-content')
  }

  inject () {
    this.container().append(this.html())
  }

  toHTML () {
    // Create tab toggler
    let li = document.createElement('li')
    li.innerHTML = unsafePolicy.createHTML(
      '<a href="#sidepanel-' + this.uid + '" id="' + this.uid + '" data-toggle="tab">' + this.title + '</a>'
    )
    document.querySelector('#user-tabs .nav-tabs').append(li)

    // Label of the panel
    let header = document.createElement('div')
    header.className = 'panel-header-component settings-header'
    header.innerHTML = unsafePolicy.createHTML(
      '<div class="panel-header-component-main">' + this.icon + '<div class="feature-id-container"><wz-overline>' + this.title + '</wz-overline></div></div>'
    )

    // Container for buttons
    let controls = document.createElement('div')
    controls.className = 'button-toolbar'

    // Append buttons to container
    this.elements.forEach(element => controls.append(element.html()))

    // Build form group
    let group = document.createElement('div')
    group.className = 'form-group'
    group.append(header)
    group.append(controls)

    // Section
    let pane = document.createElement('div')
    pane.id = 'sidepanel-' + this.uid // required by tab toggle, see above
    pane.className = 'tab-pane'
    pane.append(group)
    return pane
  }
}

class WMEUIHelperModal extends WMEUIHelperContainer {
  container () {
    return document.getElementById('panel-container')
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

    let header = document.createElement('div')
    header.className = 'header'
    header.innerHTML = unsafePolicy.createHTML(this.title)
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
    panel.className = 'panel show'
    panel.append(archivePanel)

    return panel
  }
}

class WMEUIHelperText extends WMEUIHelperElement {
  toHTML () {
    let p = document.createElement('p')
    p.innerHTML = unsafePolicy.createHTML(this.title)
    return p
  }
}

class WMEUIHelperControl extends WMEUIHelperElement {
  constructor (uid, id, title, description, attributes = {}) {
    super(uid, id, title, description, attributes)
    this.attributes.name = this.id
  }
}

class WMEUIHelperControlInput extends WMEUIHelperControl {
  toHTML () {
    let input = this.applyAttributes(document.createElement('input'))
    let label = document.createElement('label')
    label.htmlFor = input.id
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let container = document.createElement('div')
    container.title = this.description
    container.className = 'controls-container'
    container.append(input, label)
    return container
  }
}

class WMEUIHelperControlButton extends WMEUIHelperControl {
  constructor (uid, id, title, description, callback, shortcut = null) {
    super(uid, id, title, description)
    this.callback = callback
    if (shortcut) {
      /* name, desc, group, title, shortcut, callback, scope */
      new WMEUIShortcut(
        this.uid + '-' + this.id,
        this.description,
        this.uid,
        this.uid,
        shortcut,
        this.callback
      )
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
    this.group = group || 'default'
    this.title = title
    this.shortcut = {}
    this.callback = callback
    this.scope = ('object' === typeof scope) ? scope : null

    /* Setup translation for shortcut */
    if (shortcut.length > 0) {
      this.shortcut = { [shortcut]: name }
      WMEUIShortcut.addTranslation(this.group, this.title, this.name, this.desc)
    }

    /* Try to initialize new group */
    this.addGroup()

    /* Clear existing actions with same name and create new */
    this.addAction()

    /* Try to register new event */
    this.addEvent()

    /* Finally, register the shortcut */
    this.registerShortcut()
  }

  /**
   * @param {String} group name
   * @param {String} title of the shortcut section
   * @param {String} name of the shortcut
   * @param {String} description of the shortcut
   */
  static addTranslation (group, title, name, description) {
    if (!I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[group]) {
      I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[group] = {
        description: title,
        members: {
          [name]: description
        }
      }
    }
    I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[group].members[name] = description
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
    W.accelerators._registerShortcuts(this.shortcut)
  }
}

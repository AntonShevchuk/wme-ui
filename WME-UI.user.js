// ==UserScript==
// @name         WME UI
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @version      0.0.1
// @description  UI Library for Waze Map Editor Greasy Fork scripts
// @license      MIT License
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

/* global jQuery, W */

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
    style.innerHTML = css
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
  constructor (name, desc, group, title, shortcut, callback, scope= null) {
    this.name = name
    this.desc = desc
    this.group = group || 'default'
    this.title = title
    this.shortcut = {}
    this.callback = callback
    this.scope = ('object' === typeof scope) ? scope : null

    /* Setup translation for shortcut */
    if (shortcut.length > 0) {
      this.shortcut = {[shortcut]:name}
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
  static addTranslation(group, title, name, description) {
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

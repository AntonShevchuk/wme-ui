// ==UserScript==
// @name         WME UI
// @version      0.6.0
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

(function () {
    'use strict';

    let unsafePolicy = { createHTML: (string) => string };
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        unsafePolicy = window.trustedTypes.createPolicy('unsafe', {
            createHTML: (string) => string,
        });
    }

    class WMEUI {
        /**
         * Get or create a WME SDK instance (lazy)
         */
        static get sdk() {
            if (!this._sdk) {
                this._sdk = getWmeSdk({ scriptId: 'wme-ui', scriptName: 'WME UI' });
            }
            return this._sdk;
        }
        /**
         * Get current locale code from WME SDK
         * Falls back to I18n or 'en' if SDK is not yet available
         */
        static getLocale() {
            if (!this._locale) {
                try {
                    this._locale = this.sdk.Settings.getLocale().localeCode;
                }
                catch (e) {
                    // SDK is not available yet (called before bootstrap)
                    this._locale = 'en';
                }
            }
            return this._locale;
        }
        /**
         * Normalize title or UID
         */
        static normalize(string) {
            return string.replace(/\W+/gi, '-').toLowerCase();
        }
        /**
         * Inject CSS styles
         */
        static addStyle(css) {
            const style = document.createElement('style');
            style.innerHTML = unsafePolicy.createHTML(css);
            document.querySelector('head').appendChild(style);
        }
        /**
         * Register translations for a script
         */
        static addTranslation(uid, data) {
            if (!data.en) {
                console.error('Default translation `en` is required');
                return;
            }
            // Store internally
            this._translations[uid] = data;
        }
        /**
         * Get translation by script name
         * Falls back to English if current locale not available
         */
        static t(uid) {
            const locale = this.getLocale();
            return this._translations[uid]?.[locale]
                || this._translations[uid]?.['en']
                || {};
        }
    }
    WMEUI._translations = {};
    WMEUI._locale = null;
    WMEUI._sdk = null;

    class WMEUIHelperElement {
        constructor(uid, id, title = null, attributes = {}) {
            this.uid = uid;
            this.id = id;
            this.title = title;
            this.attributes = attributes;
            this.element = null;
            this.elements = [];
        }
        /**
         * Add WMEUIHelperElement to the container
         * If already rendered, appends the new child to the live DOM
         */
        addElement(element) {
            this.elements.push(element);
            if (this.element) {
                const container = this.getChildContainer();
                if (container) {
                    container.append(element.html());
                }
            }
            return element;
        }
        /**
         * Remove WMEUIHelperElement from the container
         */
        removeElement(element) {
            const index = this.elements.indexOf(element);
            if (index !== -1) {
                this.elements.splice(index, 1);
                element.html().remove();
            }
        }
        /**
         * Find the child container element in the rendered DOM
         * Subclasses use .controls or .button-toolbar as the container for children
         */
        getChildContainer() {
            if (!this.element)
                return null;
            return this.element.querySelector('.wme-ui-controls')
                || this.element.querySelector('.wme-ui-tab-content')
                || this.element.querySelector('.wme-ui-body')
                || this.element;
        }
        /**
         * Apply attributes to the HTML element
         */
        applyAttributes(element) {
            for (const [attr, value] of Object.entries(this.attributes)) {
                element[attr] = value;
            }
            return element;
        }
        /**
         * Get or build HTML element
         */
        html() {
            if (!this.element) {
                this.element = this.toHTML();
                this.element.className += ' ' + this.uid + ' ' + this.uid + '-' + this.id;
            }
            return this.element;
        }
        /**
         * Build and return HTML elements for injection
         */
        toHTML() {
            throw new Error('Abstract method');
        }
    }

    /**
     * Base class for controls
     */
    class WMEUIHelperControl extends WMEUIHelperElement {
        constructor(uid, id, title, attributes = {}) {
            super(uid, id, title, attributes);
            if (!attributes.name) {
                this.attributes.name = this.id;
            }
        }
    }
    /**
     * Input with label inside the div
     */
    class WMEUIHelperControlInput extends WMEUIHelperControl {
        toHTML() {
            let input = document.createElement('input');
            input = this.applyAttributes(input);
            let label = document.createElement('label');
            label.htmlFor = input.id || this.uid + '-' + this.id;
            label.innerHTML = unsafePolicy.createHTML(this.title);
            let container = document.createElement('div');
            container.className = 'controls-container';
            container.append(input);
            container.append(label);
            return container;
        }
    }
    /**
     * Button with a shortcut if needed
     */
    class WMEUIHelperControlButton extends WMEUIHelperControl {
        constructor(uid, id, title, description, callback, attributes = {}) {
            super(uid, id, title, attributes);
            this.description = description;
            this.callback = callback;
        }
        toHTML() {
            let button = document.createElement('button');
            button.className = 'waze-btn waze-btn-small waze-btn-white';
            button.innerHTML = unsafePolicy.createHTML(this.title);
            button.title = this.description;
            button.onclick = this.callback;
            this.applyAttributes(button);
            return button;
        }
    }

    class WMEUIHelperDiv extends WMEUIHelperElement {
        toHTML() {
            let div = document.createElement('div');
            div.className = 'wme-ui-helper-div';
            div.id = this.uid + '-' + this.id;
            div = this.applyAttributes(div);
            if (this.title) {
                div.innerHTML = unsafePolicy.createHTML(this.title);
            }
            return div;
        }
    }

    class WMEUIHelperText extends WMEUIHelperElement {
        toHTML() {
            let p = document.createElement('p');
            p = this.applyAttributes(p);
            p.innerHTML = unsafePolicy.createHTML(this.title);
            return p;
        }
        /**
         * Update text content after rendering
         */
        setText(text) {
            this.title = text;
            if (this.element) {
                this.element.innerHTML = unsafePolicy.createHTML(text);
            }
        }
    }

    class WMEUIHelperContainer extends WMEUIHelperElement {
        /**
         * Create and add WMEUIHelperControlButton element
         */
        addButton(id, title, description, callback, attributes = {}) {
            return this.addElement(new WMEUIHelperControlButton(this.uid, id, title, description, callback, attributes));
        }
        /**
         * Create buttons
         */
        addButtons(buttons) {
            for (let key in buttons) {
                if (buttons.hasOwnProperty(key)) {
                    this.addButton(key, buttons[key].title, buttons[key].description, buttons[key].callback);
                }
            }
        }
        /**
         * Create checkboxes from an object
         * Each key becomes a checkbox with title, callback, and checked state
         */
        addCheckboxes(checkboxes) {
            for (const key in checkboxes) {
                if (checkboxes.hasOwnProperty(key)) {
                    this.addCheckbox(key, checkboxes[key].title, checkboxes[key].callback, checkboxes[key].checked || false);
                }
            }
        }
        /**
         * Create and add WMEUIHelperControlInput element
         */
        addCheckbox(id, title, callback, checked = false) {
            return this.addElement(new WMEUIHelperControlInput(this.uid, id, title, {
                'id': this.uid + '-' + id,
                'onclick': callback,
                'type': 'checkbox',
                'value': '1',
                'checked': checked,
            }));
        }
        /**
         * Create and add WMEUIHelperDiv element
         */
        addDiv(id, innerHTML = null, attributes = {}) {
            return this.addElement(new WMEUIHelperDiv(this.uid, id, innerHTML, attributes));
        }
        /**
         * Create and add WMEUIHelperFieldset element
         */
        addFieldset(id, title, attributes = {}) {
            return this.addElement(new WMEUIHelperContainer._fieldsetClass(this.uid, id, title, attributes));
        }
        /**
         * Create text input
         */
        addInput(id, title, callback, value = '') {
            return this.addElement(new WMEUIHelperControlInput(this.uid, id, title, {
                'id': this.uid + '-' + id,
                'onchange': callback,
                'type': 'text',
                'value': value,
            }));
        }
        /**
         * Create number input
         */
        addNumber(id, title, callback, value = 0, min, max, step = 10) {
            return this.addElement(new WMEUIHelperControlInput(this.uid, id, title, {
                'id': this.uid + '-' + id,
                'onchange': callback,
                'type': 'number',
                'value': value,
                'min': min,
                'max': max,
                'step': step,
            }));
        }
        /**
         * Create radiobutton
         */
        addRadio(id, title, callback, name, value, checked = false) {
            return this.addElement(new WMEUIHelperControlInput(this.uid, id, title, {
                'id': this.uid + '-' + id,
                'name': name,
                'onclick': callback,
                'type': 'radio',
                'value': value,
                'checked': checked,
            }));
        }
        /**
         * Create range input
         */
        addRange(id, title, callback, value, min, max, step = 10) {
            return this.addElement(new WMEUIHelperControlInput(this.uid, id, title, {
                'id': this.uid + '-' + id,
                'onchange': callback,
                'type': 'range',
                'value': value,
                'min': min,
                'max': max,
                'step': step,
            }));
        }
        /**
         * Create and add WMEUIHelperText element
         */
        addText(id, text) {
            return this.addElement(new WMEUIHelperText(this.uid, id, text));
        }
    }

    var css_248z$3 = ".wme-ui-panel-group {\n  /* panel container */\n}\n\n.wme-ui-label {\n  /* panel title label */\n}\n\n.wme-ui-panel-controls {\n  /* panel controls container */\n  padding: 8px;\n}\n";

    function injectPanelStyles() {
        if (!document.querySelector('style[data-wme-ui-panel]')) {
            const style = document.createElement('style');
            style.setAttribute('data-wme-ui-panel', '');
            style.innerHTML = unsafePolicy.createHTML(css_248z$3);
            document.head.appendChild(style);
        }
    }
    class WMEUIHelperPanel extends WMEUIHelperContainer {
        container() {
            return document.getElementById('edit-panel');
        }
        inject() {
            this.container()?.append(this.html());
        }
        toHTML() {
            injectPanelStyles();
            let label = document.createElement('wz-label');
            label.htmlFor = '';
            label.className = 'wme-ui-label';
            label.innerHTML = unsafePolicy.createHTML(this.title);
            let controls = document.createElement('div');
            controls.className = 'wme-ui-panel-controls';
            this.elements.forEach(element => controls.append(element.html()));
            let group = document.createElement('div');
            group.className = 'wme-ui-panel-group form-group';
            group.append(label);
            group.append(controls);
            return group;
        }
    }

    var css_248z$2 = ".wme-ui-tab-header {\n  align-items: center;\n  display: flex;\n  gap: 9px;\n  justify-content: stretch;\n  padding: 8px;\n  width: 100%;\n}\n\n.wme-ui-tab-header .wme-ui-tab-icon {\n  font-size: 24px;\n}\n\n.wme-ui-tab-header .wme-ui-tab-image {\n  height: 42px;\n}\n\n.wme-ui-tab-title {\n  /* tab title container */\n}\n\n.wme-ui-tab-content {\n  padding: 8px;\n}\n\n.wme-ui-tab-group {\n  /* tab root container */\n}";

    function injectTabStyles() {
        if (!document.querySelector('style[data-wme-ui-tab]')) {
            const style = document.createElement('style');
            style.setAttribute('data-wme-ui-tab', '');
            style.innerHTML = unsafePolicy.createHTML(css_248z$2);
            document.head.appendChild(style);
        }
    }
    class WMEUIHelperTab extends WMEUIHelperContainer {
        constructor(uid, id, title, attributes = {}) {
            super(uid, id, title, attributes);
            this.sidebar = attributes.sidebar;
            this.icon = attributes.icon;
            this.image = attributes.image;
        }
        async inject() {
            const { tabLabel, tabPane } = await this.sidebar.registerScriptTab(this.uid);
            tabLabel.innerText = this.title;
            tabLabel.title = this.title;
            tabPane.append(this.html());
        }
        toHTML() {
            injectTabStyles();
            let header = document.createElement('div');
            header.className = 'wme-ui-tab-header panel-header-component settings-header';
            if (this.icon) {
                let icon = document.createElement('i');
                icon.className = 'wme-ui-tab-icon w-icon panel-header-component-icon w-icon-' + this.icon;
                header.append(icon);
            }
            if (this.image) {
                let img = document.createElement('img');
                img.className = 'wme-ui-tab-image';
                img.src = this.image;
                header.append(img);
            }
            let title = document.createElement('div');
            title.className = 'wme-ui-tab-title feature-id-container';
            title.innerHTML = unsafePolicy.createHTML('<wz-overline>' + this.title + '</wz-overline>');
            header.append(title);
            let content = document.createElement('div');
            content.className = 'wme-ui-tab-content';
            this.elements.forEach(element => content.append(element.html()));
            let group = document.createElement('div');
            group.className = 'wme-ui-tab-group form-group';
            group.append(header);
            group.append(content);
            return group;
        }
    }

    var css_248z$1 = ".wme-ui-modal {\n  width: 320px;\n  background: #fff;\n  margin: 15px;\n  border-radius: 5px;\n}\n\n.wme-ui-modal-container {\n  position: relative;\n}\n\n.wme-ui-modal-header {\n  position: relative;\n}\n\n.wme-ui-modal-header h5 {\n  padding: 16px 16px 0;\n}\n\n.wme-ui-modal-close {\n  background: #fff;\n  border: 1px solid #ececec;\n  border-radius: 100%;\n  cursor: pointer;\n  font-size: 20px;\n  height: 20px;\n  line-height: 16px;\n  position: absolute;\n  right: 14px;\n  text-indent: -2px;\n  top: 14px;\n  transition: all 150ms;\n  width: 20px;\n  z-index: 99;\n}\n\n.wme-ui-modal-body {\n  max-height: 70vh;\n  overflow: auto;\n}\n\n.wme-ui-modal-footer {\n  padding: 4px 0;\n}\n";

    function injectModalStyles() {
        if (!document.querySelector('style[data-wme-ui-modal]')) {
            const style = document.createElement('style');
            style.setAttribute('data-wme-ui-modal', '');
            style.innerHTML = unsafePolicy.createHTML(css_248z$1);
            document.head.appendChild(style);
        }
    }
    class WMEUIHelperModal extends WMEUIHelperContainer {
        container() {
            return document.getElementById('tippy-container');
        }
        inject() {
            this.container()?.append(this.html());
        }
        toHTML() {
            injectModalStyles();
            let modal = document.createElement('div');
            modal.className = 'wme-ui-modal';
            this.applyAttributes(modal);
            let close = document.createElement('button');
            close.className = 'wme-ui-modal-close';
            close.innerText = '\u00d7';
            close.onclick = function () {
                modal.remove();
            };
            let title = document.createElement('h5');
            title.innerHTML = unsafePolicy.createHTML(this.title);
            let header = document.createElement('div');
            header.className = 'wme-ui-modal-header';
            header.prepend(title);
            header.prepend(close);
            let body = document.createElement('div');
            body.className = 'wme-ui-modal-body';
            this.elements.forEach(element => body.append(element.html()));
            let footer = document.createElement('div');
            footer.className = 'wme-ui-modal-footer';
            let container = document.createElement('div');
            container.className = 'wme-ui-modal-container';
            container.append(header);
            container.append(body);
            container.append(footer);
            modal.append(container);
            return modal;
        }
    }

    var css_248z = ".wme-ui-legend {\n  /* fieldset legend/title */\n}\n\n.wme-ui-fieldset-controls {\n  /* fieldset controls container */\n}\n";

    function injectFieldsetStyles() {
        if (!document.querySelector('style[data-wme-ui-fieldset]')) {
            const style = document.createElement('style');
            style.setAttribute('data-wme-ui-fieldset', '');
            style.innerHTML = unsafePolicy.createHTML(css_248z);
            document.head.appendChild(style);
        }
    }
    class WMEUIHelperFieldset extends WMEUIHelperContainer {
        toHTML() {
            injectFieldsetStyles();
            let legend = document.createElement('legend');
            legend.className = 'wme-ui-legend';
            legend.innerHTML = unsafePolicy.createHTML(this.title);
            let controls = document.createElement('div');
            controls.className = 'wme-ui-fieldset-controls';
            this.elements.forEach(element => controls.append(element.html()));
            let fieldset = document.createElement('fieldset');
            fieldset = this.applyAttributes(fieldset);
            fieldset.append(legend);
            fieldset.append(controls);
            return fieldset;
        }
    }
    // Register with container to break circular dependency
    WMEUIHelperContainer._fieldsetClass = WMEUIHelperFieldset;

    class WMEUIHelper {
        constructor(uid) {
            this.uid = WMEUI.normalize(uid);
            this.index = 0;
        }
        /**
         * Generate unique ID
         */
        generateId() {
            this.index++;
            return this.uid + '-' + this.index;
        }
        /**
         * Create a panel for the sidebar
         */
        createPanel(title, attributes = {}) {
            return new WMEUIHelperPanel(this.uid, this.generateId(), title, attributes);
        }
        /**
         * Create a tab for the sidebar
         */
        createTab(title, attributes = {}) {
            return new WMEUIHelperTab(this.uid, this.generateId(), title, attributes);
        }
        /**
         * Create a modal window
         */
        createModal(title, attributes = {}) {
            return new WMEUIHelperModal(this.uid, this.generateId(), title, attributes);
        }
        /**
         * Create a field set
         */
        createFieldset(title, attributes = {}) {
            return new WMEUIHelperFieldset(this.uid, this.generateId(), title, attributes);
        }
    }

    Object.assign(window, {
        WMEUI, WMEUIHelper,
        WMEUIHelperElement, WMEUIHelperContainer,
        WMEUIHelperFieldset, WMEUIHelperPanel, WMEUIHelperTab, WMEUIHelperModal,
        WMEUIHelperDiv, WMEUIHelperText,
        WMEUIHelperControl, WMEUIHelperControlInput, WMEUIHelperControlButton,
    });

})();

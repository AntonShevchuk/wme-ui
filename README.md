# WME UI
UI Library for Waze Map Editor Greasy Fork scripts

## Methods

### WMEUI
* `WMEUI.addTranslation(name, translation)` – add translation to the `I180n` object, to call use syntax like this `I180n.t(name).element`
* `WMEUI.addStyle(css)` – inject CSS to the page
* `WMEUI.addShortcut (name, desc, group, title, shortcut, callback, scope = null)` - create shortcut

### WMEUIHelper

* `createPanel (title, description = null, attributes = {})` – create a panel for the sidebar container
* `createTab (title, description = null, attributes = {})` – create a tab for the sidebar container
* `createModal (title, description = null)` – create a modal window container
* `createFieldset (title, description = null)` – create a field container

### WMEUIHelperContainer
A parent class for all containers

* `addElement (element)` - add `WMEUIHelperElement` to a container
* `addDiv (id, innerHTML, attributes)` - add `WMEUIHelperDiv` to a container
* `addText (id, text)` - add `WMEUIHelperText` to a container
* `addFieldset (id, title, description)` - add `WMEUIHelperFieldset` to a container
* `addInput (id, title, callback, value = '')` - add `WMEUIHelperControlInput` with `type=text` to a container
* `addNumber (id, title, callback, value = 0, min, max, step = 10)` - `WMEUIHelperControlInput` with `type=number` to a container
* `addCheckbox (id, title, callback, checked = false)` - add `WMEUIHelperControlInput` with `type=checkbox` to a container
* `addRadio (id, title, callback, name, value, checked = false)` - add `WMEUIHelperControlInput` with `type=radio` to a container
* `addRange (id, title, callback, value, min, max, step = 10)` - add `WMEUIHelperControlInput` with `type=range` to a container
* `addButton (id, title, description, callback, shortcut = null)` - add `WMEUIHelperControlButton` to a container
* `addButtons (buttons)` - add set of the `WMEUIHelperControlButton` to a container

### WMEUIHelperPanel
A container for the sidebar panel 

### WMEUIHelperTab
A container for the sidebar tab

### WMEUIHelperModal
A container for modal window

### WMEUIHelperFieldset
A container for field set HTML element

### WMEUIShortcut
Create shortcut for callback function

* `new WMEUIShortcut(name, description, group, title, shortcut, callback, scope = null)` - create shortcut

## Examples

```javascript
(function () {
  'use strict'

  const NAME = 'Script Name'

  // translation structure
  const TRANSLATION = {
    'en': {
      title: 'Copy address',
    },
    'uk': {
      title: 'Копіювати адресу',
    },
    'ru': {
      title: 'Копировать адреc',
    }
  }

  const STYLE = '.script-name { border: 1px solid #ccc }'

  // Add translation
  WMEUI.addTranslation(NAME, TRANSLATION)

  // Add custom style
  WMEUI.addStyle(STYLE)

  // Create shortcut
  new WMEUIShortcut(
    NAME + '-script',        // unique name
    I18n.t(NAME).title,      // description
    NAME,                    // group (use the same group for all shortcuts of the script)
    I18n.t(NAME).title,      // title shortcut section
    'C+D',                   // shortcut
    () => console.log('ok'), // callback
    null                     // scope
  )

  // buttons structure
  const BUTTONS = {
    A: {
      title: I180n.t(NAME).buttons.A.title,
      description: I180n.t(NAME).buttons.A.description,
      shortcut: 'S+49',
      callback: function() {
        console.log('Button 1');
        return false;
      }
    },
    B: {
      title: I180n.t(NAME).buttons.B.title,
      description: I180n.t(NAME).buttons.B.description,
      shortcut: 'S+50',
      callback: function() {
        console.log('Button 2');
        return false;
      }
    },
  };

  let helper, panel, modal, tab;

  $(document)
    .on('bootstrap.wme', function () {
      console.info('ready');

      helper = new WMEUIHelper(NAME);

      // Create buttons on the sidebar
      panel = helper.createPanel(I18n.t(NAME).title);
      panel.addButtons(BUTTONS);

      // Create buttons in the modal
      modal = helper.createModal(I18n.t(NAME).title);
      modal.addButtons(BUTTONS);

      // Create buttons on the sidebar in the dedicated tab
      tab = helper.createTab(I18n.t(NAME).title);
      tab.addButtons(BUTTONS);
      tab.inject();
    })
    .on('point.wme', (e, el) => {
      console.log('point', el);
      el.append(panel.toHTML());
    })
    .on('place.wme', (e, el) => {
      console.info('place', el);
      el.append(panel.toHTML());
    });
})();
```

## Links

Author homepage: https://anton.shevchuk.name/  
Author pet projects: https://hohli.com/  
Support author: https://donate.hohli.com/  
Script homepage: https://github.com/AntonShevchuk/wme-ui  
GreasyFork: https://greasyfork.org/en/scripts/450320-wme-ui  

# WME UI
UI Library for Waze Map Editor Greasy Fork scripts

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
Author homepage: http://anton.shevchuk.name/  
Script homepage: https://github.com/AntonShevchuk/wme-ui  
GreasyFork: https://greasyfork.org/en/scripts/450320-wme-ui  

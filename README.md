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
})();
```

## Links
Author homepage: http://anton.shevchuk.name/  
Script homepage: https://github.com/AntonShevchuk/wme-api-helper-ui/  
GreasyFork: https://greasyfork.org/uk/scripts/389577-apihelperui/

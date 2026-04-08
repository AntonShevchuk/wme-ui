# WME UI

UI Library for Waze Map Editor userscripts. Provides a set of helper classes to build sidebar tabs, panels, modals, fieldsets, and form controls.

## Require Script

```javascript
// @require https://update.greasyfork.org/scripts/450320/WME-UI.js
```

## Quick Start

```javascript
const NAME = 'My Script'

// Translations (English is required)
WMEUI.addTranslation(NAME, {
  en: { title: 'My Script', greeting: 'Hello!' },
  uk: { title: 'Мій скрипт', greeting: 'Привіт!' },
})

// Access translations (auto-detects locale, falls back to English)
WMEUI.t(NAME).title     // 'My Script' or 'Мій скрипт'
WMEUI.t(NAME).greeting  // 'Hello!' or 'Привіт!'

// Custom styles
WMEUI.addStyle('.my-script button { color: red; }')

// Create a helper instance (or use this.helper from WMEBase)
const helper = new WMEUIHelper(NAME)
```

## API Reference

### WMEUI (static)

| Method                             | Returns  | Description                                                    |
|------------------------------------|----------|----------------------------------------------------------------|
| `WMEUI.addTranslation(name, data)` | `void`   | Register translations (English required)                       |
| `WMEUI.t(name)`                    | `object` | Get translations — auto locale detection with English fallback |
| `WMEUI.getLocale()`                | `string` | Get current locale code from WME SDK (cached)                  |
| `WMEUI.addStyle(css)`              | `void`   | Inject CSS into the page                                       |
| `WMEUI.normalize(string)`          | `string` | Convert string to kebab-case ID                                |

### WMEUIHelper (factory)

```javascript
const helper = new WMEUIHelper('My Script')
```

| Method                               | Returns               | Description        |
|--------------------------------------|-----------------------|--------------------|
| `createTab(title, attributes?)`      | `WMEUIHelperTab`      | Sidebar tab        |
| `createPanel(title, attributes?)`    | `WMEUIHelperPanel`    | Sidebar panel      |
| `createModal(title, attributes?)`    | `WMEUIHelperModal`    | Modal window       |
| `createFieldset(title, attributes?)` | `WMEUIHelperFieldset` | Fieldset container |

### WMEUIHelperContainer (base for Tab, Panel, Modal, Fieldset)

| Method                                                     | Description                         |
|------------------------------------------------------------|-------------------------------------|
| `addButton(id, title, description, callback, attributes?)` | Add a button                        |
| `addButtons(buttons)`                                      | Add multiple buttons from an object |
| `addCheckbox(id, title, callback, checked?)`               | Add a checkbox                      |
| `addCheckboxes(checkboxes)`                                | Add multiple checkboxes from object |
| `addRadio(id, title, callback, name, value, checked?)`     | Add a radio button                  |
| `addInput(id, title, callback, value?)`                    | Add a text input                    |
| `addNumber(id, title, callback, value?, min, max, step?)`  | Add a number input                  |
| `addRange(id, title, callback, value, min, max, step?)`    | Add a range slider                  |
| `addText(id, text)`                                        | Add a paragraph                     |
| `addDiv(id, innerHTML?, attributes?)`                      | Add a div                           |
| `addFieldset(id, title, attributes?)`                      | Add a nested fieldset               |
| `addElement(element)`                                      | Add any WMEUIHelperElement          |
| `removeElement(element)`                                   | Remove a child element              |

### WMEUIHelperText

| Method          | Description                     |
|-----------------|---------------------------------|
| `setText(text)` | Update text content dynamically |

## Examples

### Translations

```javascript
const NAME = 'My Script'

// Register translations (in index.ts, before bootstrap)
WMEUI.addTranslation(NAME, {
  en: {
    title: 'My Script',
    buttons: { save: 'Save', cancel: 'Cancel' },
    settings: { theme: 'Dark mode', notifications: 'Notifications' },
  },
  uk: {
    title: 'Мій скрипт',
    buttons: { save: 'Зберегти', cancel: 'Скасувати' },
    settings: { theme: 'Темна тема', notifications: 'Сповіщення' },
  },
})

// Use anywhere in the script
WMEUI.t(NAME).title            // auto-detected locale
WMEUI.t(NAME).buttons.save     // nested access
WMEUI.getLocale()              // 'en', 'uk', etc.
```

### Tab with Settings

```javascript
$(document).on('bootstrap.wme', () => {
  const helper = new WMEUIHelper(NAME)

  const tab = helper.createTab(WMEUI.t(NAME).title, {
    sidebar: wmeSDK.Sidebar,
    image: GM_info.script.icon,  // or icon: 'polygon'
  })

  tab.addText('description', WMEUI.t(NAME).description)

  // Settings fieldset with checkboxes
  const settings = helper.createFieldset(WMEUI.t(NAME).settings.title)
  settings.addCheckbox(
    'option-a',
    'Enable feature A',
    (event) => console.log('A:', event.target.checked),
    true
  )
  tab.addElement(settings)

  // Batch checkboxes from settings object
  const options = helper.createFieldset('Options')
  options.addCheckboxes({
    theme: {
      title: WMEUI.t(NAME).settings.theme,
      callback: (event) => mySettings.set(['theme'], event.target.checked),
      checked: mySettings.get('theme'),
    },
    notifications: {
      title: WMEUI.t(NAME).settings.notifications,
      callback: (event) => mySettings.set(['notifications'], event.target.checked),
      checked: mySettings.get('notifications'),
    },
  })
  tab.addElement(options)

  tab.addText('info', '<a href="#">My Script</a> v1.0')
  tab.inject()
})
```

### Panel with Buttons

```javascript
const panel = helper.createPanel(WMEUI.t(NAME).title)

panel.addButtons({
  A: {
    title: 'Simplify',
    description: 'Simplify geometry',
    callback: () => console.log('Simplify clicked'),
  },
  B: {
    title: 'Straighten',
    description: 'Straighten geometry',
    callback: () => console.log('Straighten clicked'),
  },
})

// Button with custom attributes (e.g. extra CSS class)
panel.addButton('special', 'Action', 'Do something', callback, {
  className: 'waze-btn waze-btn-small waze-btn-white waze-btn-blue',
})

// Show panel when a segment is selected
$(document).on('segment.wme', (event, element, model) => {
  element.prepend(panel.html())
})
```

### Modal Window

```javascript
function showModal () {
  const modal = helper.createModal('Preview')

  modal.addDiv('content', '<p>Some content here</p>')
  modal.addButton('close', 'OK', 'Close modal', () => {
    modal.html().remove()
  })

  modal.inject()
}
```

### Radio Buttons

```javascript
const fieldset = helper.createFieldset('Map Provider')

fieldset.addRadio('map-google', 'Google Maps',
  () => settings.set(['provider'], 'google'),
  'provider', 'google', true
)
fieldset.addRadio('map-osm', 'OpenStreetMap',
  () => settings.set(['provider'], 'osm'),
  'provider', 'osm', false
)

tab.addElement(fieldset)
```

### Range Slider

```javascript
const fieldset = helper.createFieldset('Offset')

fieldset.addRange(
  'offset-x', 'Horizontal',
  (event) => console.log('Offset:', event.target.value),
  0, -20, 20, 0.1
)

tab.addElement(fieldset)
```

### Dynamic Content

```javascript
// Text with dynamic update
const counter = tab.addText('counter', 'Count: 0')
counter.setText('Count: 42')

// Add elements after rendering
const panel = helper.createPanel('Title')
element.prepend(panel.html())  // already in DOM

// New button appears immediately
panel.addButton('new', 'New Button', 'Added dynamically', () => {})
```

## Class Hierarchy

```
WMEUIHelperElement (base)
├── WMEUIHelperContainer (adds form control methods)
│   ├── WMEUIHelperTab      — sidebar tab
│   ├── WMEUIHelperPanel    — sidebar panel
│   ├── WMEUIHelperModal    — modal window
│   └── WMEUIHelperFieldset — fieldset grouping
├── WMEUIHelperDiv           — generic div
├── WMEUIHelperText          — paragraph with setText()
└── WMEUIHelperControl       — base for inputs
    ├── WMEUIHelperControlInput  — input/checkbox/radio/range
    └── WMEUIHelperControlButton — clickable button
```

## Development

```bash
npm install
npm run build       # build → dist/WME-UI.user.js
npm run watch       # rebuild on changes
npm test            # run tests
npm run test:watch  # tests in watch mode
```

### Project Structure

```
src/
├── meta.ts            # userscript header
├── globals.d.ts       # I18n, getWmeSdk declarations
├── unsafe-policy.ts   # Trusted Types polyfill
├── wmeui.ts           # WMEUI static class (translations, locale, styles)
├── element.ts         # WMEUIHelperElement base
├── container.ts       # WMEUIHelperContainer (form controls)
├── controls.ts        # Input + Button controls
├── fieldset.ts        # Fieldset container
├── panel.ts           # Sidebar panel
├── tab.ts + tab.css   # Sidebar tab
├── modal.ts + modal.css # Modal window
├── div.ts             # Div element
├── text.ts            # Text paragraph
├── helper.ts          # WMEUIHelper factory
└── index.ts           # global exports
```

## Links

Author homepage: https://anton.shevchuk.name/
Author pet projects: https://hohli.com/
Support author: https://donate.hohli.com/
Script homepage: https://github.com/AntonShevchuk/wme-ui
GreasyFork: https://greasyfork.org/en/scripts/450320-wme-ui

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

// Custom styles
WMEUI.addStyle('.my-script button { color: red; }')

// Create a helper instance
const helper = new WMEUIHelper(NAME)
```

## API Reference

### WMEUI (static)

| Method | Description |
|--------|-------------|
| `WMEUI.addTranslation(name, data)` | Register translations. Access via `I18n.t(name).key` |
| `WMEUI.addStyle(css)` | Inject CSS into the page |
| `WMEUI.normalize(string)` | Convert string to kebab-case ID |

### WMEUIHelper (factory)

```javascript
const helper = new WMEUIHelper('My Script')
```

| Method | Returns | Description |
|--------|---------|-------------|
| `createTab(title, attributes?)` | `WMEUIHelperTab` | Sidebar tab |
| `createPanel(title, attributes?)` | `WMEUIHelperPanel` | Sidebar panel |
| `createModal(title, attributes?)` | `WMEUIHelperModal` | Modal window |
| `createFieldset(title, attributes?)` | `WMEUIHelperFieldset` | Fieldset container |

### WMEUIHelperContainer (base for Tab, Panel, Modal, Fieldset)

| Method | Description |
|--------|-------------|
| `addButton(id, title, description, callback)` | Add a button |
| `addButtons(buttons)` | Add multiple buttons from an object |
| `addCheckbox(id, title, callback, checked?)` | Add a checkbox |
| `addRadio(id, title, callback, name, value, checked?)` | Add a radio button |
| `addInput(id, title, callback, value?)` | Add a text input |
| `addNumber(id, title, callback, value?, min, max, step?)` | Add a number input |
| `addRange(id, title, callback, value, min, max, step?)` | Add a range slider |
| `addText(id, text)` | Add a paragraph |
| `addDiv(id, innerHTML?, attributes?)` | Add a div |
| `addFieldset(id, title, attributes?)` | Add a nested fieldset |
| `addElement(element)` | Add any WMEUIHelperElement |
| `removeElement(element)` | Remove a child element |

### WMEUIHelperText

| Method | Description |
|--------|-------------|
| `setText(text)` | Update text content dynamically |

## Examples

### Tab with Settings

```javascript
$(document).on('bootstrap.wme', () => {
  const helper = new WMEUIHelper(NAME)

  const tab = helper.createTab(I18n.t(NAME).title, {
    sidebar: wmeSDK.Sidebar,
    image: GM_info.script.icon,  // or icon: 'polygon'
  })

  // Description text
  tab.addText('description', I18n.t(NAME).description)

  // Settings fieldset with checkboxes
  const settings = helper.createFieldset(I18n.t(NAME).settings.title)
  settings.addCheckbox(
    'option-a',
    'Enable feature A',
    (event) => console.log('A:', event.target.checked),
    true  // default checked
  )
  settings.addCheckbox(
    'option-b',
    'Enable feature B',
    (event) => console.log('B:', event.target.checked),
    false
  )
  tab.addElement(settings)

  // Number input
  const ranges = helper.createFieldset('Parameters')
  ranges.addNumber(
    'radius',
    'Search radius (m)',
    (event) => console.log('Radius:', event.target.value),
    200, 50, 1000, 50
  )
  tab.addElement(ranges)

  // Footer
  tab.addText('info', '<a href="#">My Script</a> v1.0')

  tab.inject()
})
```

### Panel with Buttons on Sidebar

```javascript
const helper = new WMEUIHelper(NAME)
const panel = helper.createPanel(I18n.t(NAME).title)

// Define buttons
const BUTTONS = {
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
}

panel.addButtons(BUTTONS)

// Show panel when a segment is selected
$(document).on('segment.wme', (event, element, model) => {
  element.prepend(panel.html())
})
```

### Modal Window

```javascript
const helper = new WMEUIHelper(NAME)

function showModal () {
  const modal = helper.createModal('Preview')

  // Add content
  modal.addDiv('content', '<p>Some content here</p>')
  modal.addButton('close', 'OK', 'Close modal', () => {
    modal.html().remove()
  })

  // Inject into page
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

const slider = fieldset.addRange(
  'offset-x', 'Horizontal', 
  (event) => {
    console.log('Offset:', event.target.value)
  },
  0,    // default value
  -20,  // min
  20,   // max
  0.1   // step
)

tab.addElement(fieldset)
```

### Dynamic Content Updates

```javascript
// Add text element
const counter = tab.addText('counter', 'Count: 0')

// Update later
counter.setText('Count: 42')

// Add elements after rendering
const panel = helper.createPanel('Title')
element.prepend(panel.html())  // rendered

// This button appears immediately in the live DOM
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
├── meta.ts          # userscript header
├── globals.d.ts     # I18n declaration + CSS module
├── unsafe-policy.ts # Trusted Types polyfill
├── wmeui.ts         # WMEUI static class
├── element.ts       # WMEUIHelperElement base
├── container.ts     # WMEUIHelperContainer (form controls)
├── controls.ts      # Input + Button controls
├── fieldset.ts      # Fieldset container
├── panel.ts         # Sidebar panel
├── tab.ts + tab.css # Sidebar tab
├── modal.ts + modal.css # Modal window
├── div.ts           # Div element
├── text.ts          # Text paragraph
├── helper.ts        # WMEUIHelper factory
└── index.ts         # global exports
```

## Links

Author homepage: https://anton.shevchuk.name/
Author pet projects: https://hohli.com/
Support author: https://donate.hohli.com/
Script homepage: https://github.com/AntonShevchuk/wme-ui
GreasyFork: https://greasyfork.org/en/scripts/450320-wme-ui
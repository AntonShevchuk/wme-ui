import { WMEUI } from './wmeui'
import { WMEUIHelper } from './helper'
import { WMEUIHelperElement } from './element'
import { WMEUIHelperContainer } from './container'
import { WMEUIHelperFieldset } from './fieldset'
import { WMEUIHelperPanel } from './panel'
import { WMEUIHelperTab } from './tab'
import { WMEUIHelperModal } from './modal'
import { WMEUIHelperDiv } from './div'
import { WMEUIHelperText } from './text'
import { WMEUIHelperControl, WMEUIHelperControlInput, WMEUIHelperControlButton } from './controls'

Object.assign(window, {
  WMEUI, WMEUIHelper,
  WMEUIHelperElement, WMEUIHelperContainer,
  WMEUIHelperFieldset, WMEUIHelperPanel, WMEUIHelperTab, WMEUIHelperModal,
  WMEUIHelperDiv, WMEUIHelperText,
  WMEUIHelperControl, WMEUIHelperControlInput, WMEUIHelperControlButton,
})

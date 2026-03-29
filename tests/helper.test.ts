// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from 'vitest'
import { WMEUIHelper } from '../src/helper'

// Need to import fieldset to register the circular dep
import '../src/fieldset'

describe('WMEUIHelper', () => {
  let helper: WMEUIHelper

  beforeEach(() => {
    helper = new WMEUIHelper('Test Script')
  })

  it('should normalize uid', () => {
    expect(helper.uid).toBe('test-script')
  })

  describe('generateId', () => {
    it('should generate incremental IDs', () => {
      expect(helper.generateId()).toBe('test-script-1')
      expect(helper.generateId()).toBe('test-script-2')
      expect(helper.generateId()).toBe('test-script-3')
    })
  })

  describe('createPanel', () => {
    it('should create a WMEUIHelperPanel', () => {
      const panel = helper.createPanel('My Panel')
      expect(panel).toBeTruthy()
      expect(panel.title).toBe('My Panel')
      expect(panel.uid).toBe('test-script')
    })
  })

  describe('createTab', () => {
    it('should create a WMEUIHelperTab', () => {
      const tab = helper.createTab('My Tab')
      expect(tab).toBeTruthy()
      expect(tab.title).toBe('My Tab')
      expect(tab.uid).toBe('test-script')
    })
  })

  describe('createModal', () => {
    it('should create a WMEUIHelperModal', () => {
      const modal = helper.createModal('My Modal')
      expect(modal).toBeTruthy()
      expect(modal.title).toBe('My Modal')
      expect(modal.uid).toBe('test-script')
    })
  })

  describe('createFieldset', () => {
    it('should create a WMEUIHelperFieldset', () => {
      const fieldset = helper.createFieldset('My Fieldset')
      expect(fieldset).toBeTruthy()
      expect(fieldset.title).toBe('My Fieldset')
      expect(fieldset.uid).toBe('test-script')
    })
  })
})

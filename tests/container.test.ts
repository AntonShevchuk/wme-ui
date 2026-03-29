// @vitest-environment happy-dom

import { describe, it, expect, vi } from 'vitest'
import { WMEUIHelperContainer } from '../src/container'

// Import fieldset to register the circular dependency
import '../src/fieldset'

// WMEUIHelperContainer is abstract (no toHTML), so create a concrete subclass for testing
class TestContainer extends WMEUIHelperContainer {
  toHTML (): HTMLElement {
    let div = document.createElement('div')
    this.elements.forEach(el => div.append(el.html()))
    return div
  }
}

describe('WMEUIHelperContainer', () => {
  describe('addButton', () => {
    it('should add a button element', () => {
      const container = new TestContainer('uid', 'id')
      const callback = vi.fn()
      const el = container.addButton('btn-1', 'Click Me', 'A button', callback)

      expect(el).toBeTruthy()
      expect(container.elements).toHaveLength(1)

      const html = el.html()
      expect(html.tagName).toBe('BUTTON')
      expect(html.innerHTML).toContain('Click Me')
      expect(html.title).toBe('A button')
    })
  })

  describe('addButtons', () => {
    it('should add multiple buttons from an object', () => {
      const container = new TestContainer('uid', 'id')
      container.addButtons({
        A: { title: 'Button A', description: 'Desc A', callback: vi.fn() },
        B: { title: 'Button B', description: 'Desc B', callback: vi.fn() },
      })

      expect(container.elements).toHaveLength(2)
    })
  })

  describe('addCheckbox', () => {
    it('should add a checkbox input element', () => {
      const container = new TestContainer('uid', 'id')
      const callback = vi.fn()
      const el = container.addCheckbox('chk-1', 'Check me', callback)

      expect(el).toBeTruthy()
      const html = el.html()
      const input = html.querySelector('input') as HTMLInputElement
      expect(input).toBeTruthy()
      expect(input.type).toBe('checkbox')
    })

    it('should support checked state', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addCheckbox('chk-2', 'Checked', vi.fn(), true)
      const html = el.html()
      const input = html.querySelector('input') as HTMLInputElement
      expect(input.checked).toBe(true)
    })
  })

  describe('addDiv', () => {
    it('should add a div element', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addDiv('div-1', '<strong>Hello</strong>')

      expect(el).toBeTruthy()
      const html = el.html()
      expect(html.tagName).toBe('DIV')
      expect(html.innerHTML).toContain('Hello')
    })

    it('should add an empty div when no innerHTML', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addDiv('div-2')
      const html = el.html()
      expect(html.tagName).toBe('DIV')
    })
  })

  describe('addText', () => {
    it('should add a paragraph element', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addText('txt-1', 'Hello text')

      expect(el).toBeTruthy()
      const html = el.html()
      expect(html.tagName).toBe('P')
      expect(html.innerHTML).toContain('Hello text')
    })
  })

  describe('addInput', () => {
    it('should add a text input', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addInput('inp-1', 'Name', vi.fn(), 'default')
      const html = el.html()
      const input = html.querySelector('input') as HTMLInputElement
      expect(input.type).toBe('text')
      expect(input.value).toBe('default')
    })
  })

  describe('addNumber', () => {
    it('should add a number input', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addNumber('num-1', 'Count', vi.fn(), 5, 0, 100, 1)
      const html = el.html()
      const input = html.querySelector('input') as HTMLInputElement
      expect(input.type).toBe('number')
      expect(input.value).toBe('5')
    })
  })

  describe('addRadio', () => {
    it('should add a radio input', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addRadio('rad-1', 'Option A', vi.fn(), 'group', 'a')
      const html = el.html()
      const input = html.querySelector('input') as HTMLInputElement
      expect(input.type).toBe('radio')
      expect(input.name).toBe('group')
      expect(input.value).toBe('a')
    })
  })

  describe('addFieldset', () => {
    it('should add a fieldset element', () => {
      const container = new TestContainer('uid', 'id')
      const el = container.addFieldset('fs-1', 'My Fieldset')
      expect(el).toBeTruthy()
      const html = el.html()
      expect(html.tagName).toBe('FIELDSET')
    })
  })
})

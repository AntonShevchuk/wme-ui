// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest'
import { WMEUIHelperElement } from '../src/element'

class TestElement extends WMEUIHelperElement {
  toHTML (): HTMLElement {
    let div = document.createElement('div')
    div.textContent = this.title || ''
    return div
  }
}

describe('WMEUIHelperElement', () => {
  it('should store constructor parameters', () => {
    const el = new TestElement('my-uid', 'my-id', 'My Title', { class: 'test' })
    expect(el.uid).toBe('my-uid')
    expect(el.id).toBe('my-id')
    expect(el.title).toBe('My Title')
    expect(el.attributes).toEqual({ class: 'test' })
  })

  it('should default title to null and attributes to empty object', () => {
    const el = new TestElement('uid', 'id')
    expect(el.title).toBeNull()
    expect(el.attributes).toEqual({})
  })

  describe('addElement', () => {
    it('should add child elements and return the added element', () => {
      const parent = new TestElement('uid', 'parent')
      const child = new TestElement('uid', 'child', 'Child')

      const result = parent.addElement(child)
      expect(result).toBe(child)
      expect(parent.elements).toHaveLength(1)
      expect(parent.elements[0]).toBe(child)
    })
  })

  describe('applyAttributes', () => {
    it('should apply attributes to an HTML element', () => {
      const el = new TestElement('uid', 'id', null, { id: 'test-id', className: 'test-class' })
      const div = document.createElement('div')
      el.applyAttributes(div)
      expect(div.id).toBe('test-id')
      expect(div.className).toBe('test-class')
    })
  })

  describe('html', () => {
    it('should build the element with uid/id classes', () => {
      const el = new TestElement('my-uid', 'my-id', 'Hello')
      const html = el.html()

      expect(html.tagName).toBe('DIV')
      expect(html.className).toContain('my-uid')
      expect(html.className).toContain('my-uid-my-id')
    })

    it('should cache the element on subsequent calls', () => {
      const el = new TestElement('uid', 'id', 'Hello')
      const first = el.html()
      const second = el.html()
      expect(first).toBe(second)
    })
  })

  describe('toHTML', () => {
    it('should throw on base class', () => {
      const el = new WMEUIHelperElement('uid', 'id')
      expect(() => el.toHTML()).toThrow('Abstract method')
    })
  })
})

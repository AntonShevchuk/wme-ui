// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WMEUI } from '../src/wmeui'

describe('WMEUI', () => {
  describe('normalize', () => {
    it('should replace non-word characters with dashes and lowercase', () => {
      expect(WMEUI.normalize('Hello World')).toBe('hello-world')
    })

    it('should handle multiple special characters', () => {
      expect(WMEUI.normalize('My Script!@#Name')).toBe('my-script-name')
    })

    it('should handle already normalized strings', () => {
      expect(WMEUI.normalize('already-normal')).toBe('already-normal')
    })
  })

  describe('addStyle', () => {
    it('should inject a style element into the head', () => {
      const css = '.test { color: red }'
      WMEUI.addStyle(css)

      const styles = document.querySelectorAll('head style')
      const lastStyle = styles[styles.length - 1]
      expect(lastStyle).toBeTruthy()
      expect(lastStyle.innerHTML).toContain('.test { color: red }')
    })
  })

  describe('addTranslation', () => {
    beforeEach(() => {
      ;(globalThis as any).I18n = {
        currentLocale: () => 'en',
        translations: { en: {} },
        t: (key: string) => (globalThis as any).I18n.translations.en[key],
      }
    })

    it('should add English translation by default', () => {
      WMEUI.addTranslation('test-script', {
        en: { title: 'Hello' },
        uk: { title: 'Привіт' },
      })

      expect((globalThis as any).I18n.translations.en['test-script']).toEqual({ title: 'Hello' })
    })

    it('should use locale-specific translation when available', () => {
      ;(globalThis as any).I18n.currentLocale = () => 'uk'
      ;(globalThis as any).I18n.translations.uk = {}

      WMEUI.addTranslation('test-script', {
        en: { title: 'Hello' },
        uk: { title: 'Привіт' },
      })

      expect((globalThis as any).I18n.translations.uk['test-script']).toEqual({ title: 'Привіт' })
    })

    it('should fall back to English when locale is not available', () => {
      ;(globalThis as any).I18n.currentLocale = () => 'fr'
      ;(globalThis as any).I18n.translations.fr = {}

      WMEUI.addTranslation('test-script', {
        en: { title: 'Hello' },
      })

      expect((globalThis as any).I18n.translations.fr['test-script']).toEqual({ title: 'Hello' })
    })

    it('should log error when en translation is missing', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      WMEUI.addTranslation('test-script', {
        uk: { title: 'Привіт' },
      })

      expect(consoleSpy).toHaveBeenCalledWith('Default translation `en` is required')
      consoleSpy.mockRestore()
    })
  })
})

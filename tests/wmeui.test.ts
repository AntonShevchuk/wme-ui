// @vitest-environment happy-dom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WMEUI } from '../src/wmeui'

// Mock getWmeSdk
let mockLocale = 'en'
;(globalThis as any).getWmeSdk = () => ({
  Settings: {
    getLocale: () => ({ localeCode: mockLocale, localeName: 'English' }),
  },
})

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
      mockLocale = 'en'
      ;(globalThis as any).I18n = {
        currentLocale: () => mockLocale,
        translations: { en: {}, uk: {}, fr: {} },
        t: (key: string) => (globalThis as any).I18n.translations[mockLocale]?.[key],
      }
      // Reset WMEUI internal state
      ;(WMEUI as any)._locale = null
      ;(WMEUI as any)._translations = {}
      ;(WMEUI as any)._sdk = null
    })

    it('should add English translation by default', () => {
      WMEUI.addTranslation('test-script', {
        en: { title: 'Hello' },
        uk: { title: 'Привіт' },
      })

      expect((globalThis as any).I18n.translations.en['test-script']).toEqual({ title: 'Hello' })
    })

    it('should use locale-specific translation when available', () => {
      mockLocale = 'uk'

      WMEUI.addTranslation('test-script', {
        en: { title: 'Hello' },
        uk: { title: 'Привіт' },
      })

      expect((globalThis as any).I18n.translations.uk['test-script']).toEqual({ title: 'Привіт' })
    })

    it('should fall back to English when locale is not available', () => {
      mockLocale = 'fr'

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

  describe('t', () => {
    beforeEach(() => {
      mockLocale = 'en'
      ;(WMEUI as any)._locale = null
      ;(WMEUI as any)._translations = {}
      ;(WMEUI as any)._sdk = null
      ;(globalThis as any).I18n = {
        translations: { en: {}, uk: {} },
      }
    })

    it('should return translation for current locale', () => {
      WMEUI.addTranslation('my-script', {
        en: { title: 'Hello' },
        uk: { title: 'Привіт' },
      })

      expect(WMEUI.t('my-script').title).toBe('Hello')
    })

    it('should return locale-specific translation', () => {
      mockLocale = 'uk'

      WMEUI.addTranslation('my-script', {
        en: { title: 'Hello' },
        uk: { title: 'Привіт' },
      })

      expect(WMEUI.t('my-script').title).toBe('Привіт')
    })

    it('should fall back to English', () => {
      mockLocale = 'fr'

      WMEUI.addTranslation('my-script', {
        en: { title: 'Hello' },
      })

      expect(WMEUI.t('my-script').title).toBe('Hello')
    })

    it('should return empty object for unknown uid', () => {
      expect(WMEUI.t('unknown')).toEqual({})
    })
  })

  describe('getLocale', () => {
    beforeEach(() => {
      ;(WMEUI as any)._locale = null
      ;(WMEUI as any)._sdk = null
    })

    it('should return locale from WME SDK', () => {
      mockLocale = 'uk'
      expect(WMEUI.getLocale()).toBe('uk')
    })

    it('should cache locale', () => {
      mockLocale = 'uk'
      WMEUI.getLocale()
      mockLocale = 'fr'
      expect(WMEUI.getLocale()).toBe('uk') // still cached
    })
  })
})

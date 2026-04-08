import { unsafePolicy } from './unsafe-policy'

class WMEUI {
  private static _translations: Record<string, Record<string, any>> = {}
  private static _locale: string | null = null
  private static _sdk: any = null

  /**
   * Get or create WME SDK instance (lazy)
   */
  private static get sdk (): any {
    if (!this._sdk) {
      this._sdk = getWmeSdk({ scriptId: 'wme-ui', scriptName: 'WME UI' })
    }
    return this._sdk
  }

  /**
   * Get current locale code from WME SDK
   * Falls back to I18n or 'en' if SDK is not yet available
   */
  static getLocale (): string {
    if (!this._locale) {
      try {
        this._locale = this.sdk.Settings.getLocale().localeCode
      } catch (e) {
        // SDK not available yet (called before bootstrap)
        try {
          this._locale = I18n.currentLocale()
        } catch (e) {
          this._locale = 'en'
        }
      }
    }
    return this._locale
  }

  /**
   * Normalize title or UID
   */
  static normalize (string: string): string {
    return string.replace(/\W+/gi, '-').toLowerCase()
  }

  /**
   * Inject CSS styles
   */
  static addStyle (css: string): void {
    const style = document.createElement('style')
    style.innerHTML = unsafePolicy.createHTML(css)
    document.querySelector('head').appendChild(style)
  }

  /**
   * Register translations for a script
   */
  static addTranslation (uid: string, data: Record<string, any>): void {
    if (!data.en) {
      console.error('Default translation `en` is required')
      return
    }

    // Store internally
    this._translations[uid] = data
  }

  /**
   * Get translation by script name
   * Falls back to English if current locale not available
   */
  static t (uid: string): any {
    const locale = this.getLocale()
    return this._translations[uid]?.[locale]
      || this._translations[uid]?.['en']
      || {}
  }
}

export { WMEUI }

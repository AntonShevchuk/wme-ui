import { unsafePolicy } from './unsafe-policy'

class WMEUI {
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
    let style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = unsafePolicy.createHTML(css)
    document.querySelector('head').appendChild(style)
  }

  /**
   * Add translation for the I18n object
   */
  static addTranslation (uid: string, data: Record<string, any>): void {
    if (!data.en) {
      console.error('Default translation `en` is required')
    }
    let locale = I18n.currentLocale()
    I18n.translations[locale][uid] = data[locale] || data.en
  }
}

export { WMEUI }

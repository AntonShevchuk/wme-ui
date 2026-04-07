declare const I18n: {
  currentLocale(): string
  translations: Record<string, any>
  t(key: string): any
}

declare module '*.css' {
  const content: string
  export default content
}

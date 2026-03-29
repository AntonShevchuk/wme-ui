import typescript from '@rollup/plugin-typescript'
import { readFileSync } from 'fs'

const meta = readFileSync('src/meta.ts', 'utf-8')
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
const banner = meta.replace('{{version}}', pkg.version)

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/WME-UI.user.js',
    format: 'iife',
    banner,
  },
  plugins: [
    typescript(),
  ],
}

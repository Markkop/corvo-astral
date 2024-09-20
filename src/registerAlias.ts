import { addAlias } from 'module-alias'
import path from 'path'

const rootPath = path.resolve(__dirname, '..')

addAlias('@types', path.join(rootPath, 'dist', 'types.js'))
addAlias('@stringsLang', path.join(rootPath, 'dist', 'stringsLang.js'))
addAlias('@managers', path.join(rootPath, 'dist', 'managers'))
addAlias('@commands', path.join(rootPath, 'dist', 'commands'))
addAlias('@baseCommands', path.join(rootPath, 'dist', 'baseCommands'))
addAlias('@utils', path.join(rootPath, 'dist', 'utils'))
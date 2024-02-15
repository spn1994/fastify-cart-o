//devido ao erro SyntaxError: Cannot use import statement outside a module, mudei para assim
import { config as configKnex } from './src/database'

const config = configKnex

export default config
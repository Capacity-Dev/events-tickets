import { mkdirSync } from 'node:fs'

mkdirSync(new URL('../tmp', import.meta.url).pathname, { recursive: true })

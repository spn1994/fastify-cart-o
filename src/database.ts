// só renomeei a importação
import { knex as setupKnex } from 'knex'
import { env } from './env'


//console.log(process.env)

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found.')
}

export const config = {
  client: 'sqlite',
  connection: {
    //ele executa em relação de onde está, da raiz
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
}
export const knex = setupKnex(config)
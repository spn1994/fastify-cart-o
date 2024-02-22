import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transaction'

export const app = fastify()

app.register(cookie)
//ordem do plugin é a ordem q vai executar
app.register(transactionsRoutes, {
  //todas rotas q tiverem transaction, estão definidas por esse puglin
  prefix: 'transactions',
})
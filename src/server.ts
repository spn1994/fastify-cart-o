import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transaction'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)
//ordem do plugin é a ordem q vai executar
app.register(transactionsRoutes, {
  //todas rotas q tiverem transaction, estão definidas por esse puglin
  prefix: 'transactions',
})
app.listen({
  port: env.PORT,
  //then retorna uma promisse
}).then(() => {
  console.log('HTTP Server Running!')
})
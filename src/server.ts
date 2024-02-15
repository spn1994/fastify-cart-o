import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transaction'


const app = fastify()
//ordem do plugin é a ordem q vai executar
app.register(transactionsRoutes)

app.listen({
  port: env.PORT,
  //then retorna uma promisse
}).then(() => {
  console.log('HTTP Server Running!')
})
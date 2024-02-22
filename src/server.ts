import { app } from './app'
import { env } from './env'


app.listen({
  port: env.PORT,
  //then retorna uma promisse
}).then(() => {
  console.log('HTTP Server Running!')
})
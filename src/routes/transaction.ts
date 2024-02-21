import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

//cookies > formas de manter contexto entre requisiçoes(coleta tudo que vc faz)

//request body: HTTps- criar ou editar aplicação

//plugin fastfy precisa ser assincrona
export async function transactionsRoutes(app: FastifyInstance) {  
  
  //hooklobal para esse contexto, se eu quiser q funcione pra todos, eu coloco la no server.js
  app.addHook('preHandler', async (request, reply) => {
    //console.log(`[${request.method}] ${request.url}`)
  })
  
  //rota par alistagem de todas transaçes
  app.get(
    '/',
    {//executa antes  da funçãoo q ta abaixo
      preHandler: [checkSessionIdExists],
    }, 
    async (request) => {
      const { sessionId } = request.cookies
      const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()
    
    return { transactions }
    },
  )

  //rota de detalhe de transaação unica
  app.get('/:id',
      {//executa antes  da funçãoo q ta abaixo
        preHandler: [checkSessionIdExists],
      }, 
    async (request) => {
      const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)
    //id unico, eu espero
    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id: id,
      })
      
      .first()
    //envio como objeto, pq se eu  quiser enviar mais coisa, eu envio
    return {
      transaction
    }
  })

  //resumo da conta
  app.get('/summary',
      {//executa antes  da funçãoo q ta abaixo
        preHandler: [checkSessionIdExists],
      }, 
      async (request) => {
        const { sessionId } = request.cookies

        const summary = await knex('transactions')
        .where('session_id', sessionId)
        // agrega todos valores da tabela
        .sum('amount', { as: 'amount' })
        .first()
    //em knex sempre retorna array 
       return { summary }
  })  

  app.post('/', async (request, reply) => {
    // request body { title, amounn, type: credit ou debit }
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    //n precisa se preocupar se n passar da linha do parse
    const {title, amount, type } = createTransactionBodySchema.parse(
      request.body,
      )
      
      let sessionId = request.cookies.sessionId
      //se n existir sessao, vai criar novo
      if (!sessionId) {
        sessionId = randomUUID()
          // reply salva 
        reply.setCookie('sessionId', sessionId, {
          //quais endereço vao poder acessar
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days duração cookie
        })
      }
  
//knex nao consegue identificar caMpos e tabelas de forma automatica
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    }) 
      // 201- criado com sucesso

    return reply.status(201).send()
  })
}
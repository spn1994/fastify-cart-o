import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

//cookies > formas de manter contexto entre requisiçoes(coleta tudo que vc faz)

//request body: HTTps- criar ou editar aplicação

//plugin fastfy precisa ser assincrona
export async function transactionsRoutes(app: FastifyInstance) {
  
  //rota par alistagem de todas transaçes
  app.get('/', async () => {
    const transactions = await knex('transactions').select()
    //envio como objeto, pq se eu  quiser enviar mais coisa, eu envio
    return { transactions }
  })

  //rota de detalhe de transaação unica
  app.get('/:id', async (request) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)
    //id unico, eu espero
    const transaction = await knex('transactions').where('id', id).first()

    return {
      transaction
    }
  })

  //resumo da conta
  app.get('/summary', async () => {
    const summary = await knex('transactions')
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
//knex nao consegue identificar caMpos e tabelas de forma automatica
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    }) 
      // 201- criado com sucesso

    return reply.status(201).send()
  })
}
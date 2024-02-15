import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

//request body: HTTps- criar ou editar aplicação

//plugin fastfy precisa ser assincrona
export async function transactionsRoutes(app: FastifyInstance) {
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

    await knex('transctions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    }) 
      // 201- criado com sucesso

    return reply.status(201).send()
  })
}
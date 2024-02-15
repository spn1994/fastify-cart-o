import { FastifyInstance } from 'fastify'
import { knex } from '../database'

//plugin fastfy precisa ser assincrona
export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transactions = await knex('transactions')
      .where('amount', 1000)
      .select('*')

    return transactions
  })
}
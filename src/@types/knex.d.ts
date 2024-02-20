//nome do arquivo vem para definiçãod e tipos, somente typescript(dentro do arquivo) pq knex n consegue identificar
//documentação knex tem q descrição
// eslint-disable-next-line
import { Knex } from 'knex'
// ou faça apenas:
// import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
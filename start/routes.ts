/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.get('/', async () => {
  return { info: 'https://github.com/CodigoPraTodos/api-ans-igr' }
})

Route
  .group(() => {
    Route.get('/instituicoes', 'InstituicoesController.teste') // todo: remover, apenas teste

    Route
      .group(() => {
        Route.get('/pesquisa/:query', 'InstituicoesController.searchInstituicoesPorNome')
        Route.get('/pesquisa/cobertura/:query', 'InstituicoesController.searchInstituicoesPorCobertura')
        Route.get('/pesquisa/porte/:query', 'InstituicoesController.searchInstituicoesPorPorte')
        Route.get('/:ansId', 'InstituicoesController.getInstituicao')
        Route.get('/lista/:ansIds', 'InstituicoesController.getInstituicaoLista')
        Route.get('/:ansId/classificacoes', 'ClassificacoesController.getClassificacoes')
        Route.get('/:ansId/classificacoes/:ano', 'ClassificacoesController.getClassificacoesAno')
        Route.get('/:ansId/classificacoes/:ano/:mes', 'ClassificacoesController.getClassificacoesMes')
      })
      .prefix('instituicoes')

  })
  .prefix('v1')
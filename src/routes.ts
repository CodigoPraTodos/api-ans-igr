import { Router } from "express";

import * as infoController from "./controllers/info";
import * as instituicoesController from "./controllers/instituicoes";

const router: Router = Router();

router.get("/", infoController.index);

router.get("/v1/instituicoes", instituicoesController.getInstituicaoRoot);
router.get("/v1/instituicoes/pesquisa/nome/:query", instituicoesController.searchInstituicoesPorNome);
router.get("/v1/instituicoes/pesquisa/porte/:query", instituicoesController.searchInstituicoesPorPorte);
router.get("/v1/instituicoes/pesquisa/cobertura/:query", instituicoesController.searchInstituicoesPorCobertura);
router.get("/v1/instituicoes/lista/:ansIds", instituicoesController.getInstituicaoLista);
router.get("/v1/instituicoes/:ansId", instituicoesController.getInstituicao);

export default router;

// Route.group(() => {
//   Route.group(() => {
//     // Route.get(
//     //   "/:ansId/classificacoes",
//     //   "ClassificacoesController.getClassificacoes"
//     // );
//     Route.get("/:ansId/:ano", "InstituicoesController.getInstituicaoAno");
//     Route.get("/:ansId/:ano/:mes", "InstituicoesController.getInstituicaoMes");
//   }).prefix("instituicoes");
// }).prefix("v1");

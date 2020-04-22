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
router.get("/v1/instituicoes/:ansId/:ano", instituicoesController.getInstituicaoAno);
router.get("/v1/instituicoes/:ansId/:ano/:mes", instituicoesController.getInstituicaoAnoMes);
router.get("/v1/instituicoes/:ansId", instituicoesController.getInstituicao);

export default router;

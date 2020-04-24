import { Router } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import * as infoController from "./controllers/info";
import * as instituicoesController from "./controllers/instituicoes";
import config from "./config";

const router: Router = Router();

router.get("/", infoController.index);

/**
 * @swagger
 * tags:
 *   name: Instituicoes
 *   description: Instituicoes
 */

/**
 * @swagger
 * path:
 *  /instituicoes/:
 *    get:
 *      summary: Lista de Instituicoes
 *      tags: [Instituicoes]
 *      responses:
 *        "200":
 *          description: Lista de Instituicoes
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/InstituicoesApi'
 */
router.get("/v1/instituicoes", instituicoesController.getInstituicaoRoot);
router.get("/v1/instituicoes/pesquisa/nome/:query", instituicoesController.searchInstituicoesPorNome);
router.get("/v1/instituicoes/pesquisa/porte/:query", instituicoesController.searchInstituicoesPorPorte);
router.get("/v1/instituicoes/pesquisa/cobertura/:query", instituicoesController.searchInstituicoesPorCobertura);
router.get("/v1/instituicoes/lista/:ansIds", instituicoesController.getInstituicaoLista);
router.get("/v1/instituicoes/:ansId/:ano", instituicoesController.getInstituicaoAno);
router.get("/v1/instituicoes/:ansId/:ano/:mes", instituicoesController.getInstituicaoAnoMes);
router.get("/v1/instituicoes/:ansId", instituicoesController.getInstituicao);

// Swagger set up
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "CPT API da ANS IGR",
            version: "0.0.1",
            description: "Um projeto que expõe os dados da ANS IGR",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/",
            },
            contact: {
                name: "CodigoPraTodos",
                url: "https://codigopratodos.com",
                email: "contato@codigopratodos.com",
            },
        },
        servers: [
            {
                url: `http://${config.app.host}:${config.app.port}/v1/`,
            },
        ],
    },
    apis: ["**/*.ts"],
};

const specs = swaggerJsDoc(options);
router.use("/docs", swaggerUi.serve);
router.get(
    "/docs",
    swaggerUi.setup(specs, {
        explorer: true,
    }),
);

export default router;

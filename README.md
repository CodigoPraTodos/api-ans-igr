# API ANS IGR

Índice Geral de Reclamações - Agência de Nacional de Saúde Suplementar

Descrição e Fórmulas de Cálculos: http://www.ans.gov.br/planos-de-saude-e-operadoras/informacoes-e-avaliacoes-de-operadoras/indice-de-reclamacoes

Dados: http://www.dados.gov.br/dataset/indice-de-reclamacoes

IGR Corrente (últimos 12 meses de dados): http://www.ans.gov.br/portal/upload/indicedereclamacoes/igr.csv

IGR Anual desde 2015: http://www.dados.gov.br/dataset/indice-de-reclamacoes/resource/c6332d27-bffe-43bf-a678-7331dffba53f

## Iniciativa da Comunidade CodigoPraTodos

Porque todos podem acessar dados livres!

## Como rodar o projeto

Você precisa instalar na sua máquina:

-   docker (ou ter um postgres rodando)
-   nodejs versão 12.x
-   yarn

Então rode os seguintes comandos:

```
git clone https://github.com/CodigoPraTodos/api-ans-igr
docker-compose up -d   # se vc usa docker pra iniciar o banco
yarn                   # instala pacotes do node
cp .env.example .env   # copia nossas configuracoes de exemplo
yarn migration:run     # cria tabelas no banco
yarn dev               # inicia servidor
```

Carga de todos os arquivos:

```
yarn cmd:carga data/igr.csv
yarn cmd:carga data/IGR_2019.csv --anual
yarn cmd:carga data/IGR_2018.csv --anual
yarn cmd:carga data/IGR_2017.csv --anual
yarn cmd:carga data/IGR_2016.csv --anual
yarn cmd:carga data/IGR_2015.csv --anual
```

Veja a lista de instituicoes em http://localhost:3333/v1/instituicoes

# API ANS IGR

Índice Geral de Reclamações - Agência de Nacional de Saúde Suplementar

## Iniciativa da Comunidade CodigoPraTodos

Porque todos podem acessar dados livres!

## Como rodar o projeto

Você precisa instalar na sua máquina:

- docker (ou ter um postgres rodando)
- nodejs versão 12.x
- yarn

Então rode os seguintes comandos:

```
git clone https://github.com/CodigoPraTodos/api-ans-igr
docker-compose up -d                          # se vc usa docker pra iniciar o banco
yarn                                          # instala pacotes do node
cp .env.example .env                          # copia nossas configuracoes de exemplo
node ace build                                # compila nossos arquivos
node ace migration:run                        # cria tabelas no banco
node ace carga:anual ENDERECO_ARQUIVO_CSV     # carrega dados
node ace serve --watch                        # inicia servidor
```

Acesse http://localhost:3333/health e verifique que todos os serviços estão healthy

Veja a lista de instituicoes em http://localhost:3333/instituicoes

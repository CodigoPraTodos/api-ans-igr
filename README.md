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
docker-compose up -d      # se vc usa docker
yarn
node ace serve --watch
```

Acesse http://localhost:3333/health e verifique que todos os serviços estão healthy
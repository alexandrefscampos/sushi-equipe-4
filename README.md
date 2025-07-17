# Backend Sushi - NestJS

## Descrição

Backend para aplicação de delivery de sushi desenvolvido com NestJS. Fornece uma API RESTful para gerenciar o menu e pedidos.

## Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run start:dev

# Executar em modo produção
npm run start:prod
```

## Endpoints


## Estrutura do Projeto

```
src/
├── data/
│   └── menu.json          # Dados mockados do menu
├── menu/
│   ├── menu.controller.ts # Controller do menu
│   ├── menu.service.ts    # Service do menu
│   └── menu.module.ts     # Módulo do menu
├── app.module.ts          # Módulo principal
└── main.ts               # Arquivo principal
```

## Configurações

- **Porta**: 3001
- **CORS**: Habilitado para localhost:3000 e localhost:3001
- **Prefixo**: `/api` para todas as rotas

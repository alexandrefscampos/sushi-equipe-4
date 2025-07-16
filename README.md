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

### Menu

- **GET /api/menu** - Retorna todos os itens do menu
- **GET /api/menu?categoria=temaki** - Retorna itens por categoria
- **GET /api/menu?disponivel=true** - Retorna apenas itens disponíveis
- **GET /api/menu/:id** - Retorna um item específico por ID

### Exemplos de Uso

```bash
# Buscar todos os itens do menu
curl http://localhost:3001/api/menu

# Buscar apenas temakis
curl http://localhost:3001/api/menu?categoria=temaki

# Buscar apenas itens disponíveis
curl http://localhost:3001/api/menu?disponivel=true

# Buscar item específico
curl http://localhost:3001/api/menu/1
```

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

## Próximos Passos

Para implementar o endpoint POST /order:

1. Criar um módulo de pedidos (order)
2. Criar estrutura de dados para armazenar pedidos
3. Implementar validação de dados
4. Adicionar endpoint POST /api/order 
# 💊 Farmácia SaudeMais - Sistema CRUD

Projeto desenvolvido com **NestJS**, **TypeORM** e **PostgreSQL** para gerenciar uma farmácia fictícia.  
O sistema implementa autenticação JWT, controle de acesso por papéis (**Gerente**, **Farmacêutico**, **Atendente**) e documentação via **Swagger**.  

---

## 🚀 Tecnologias Utilizadas
- **Node.js** (back-end)
- **NestJS** (framework principal)
- **TypeORM** (ORM para banco de dados relacional)
- **PostgreSQL** (banco de dados)
- **Class-Validator** (validações nos DTOs)
- **nestjs-paginate** (paginação nas listagens)
- **JWT (JSON Web Token)** (autenticação)
- **Guards e Decorators** (controle de papéis/roles)
- **Swagger** (documentação interativa)
- **Middleware** (logs de requisições)
- **Exception Filters** (tratamento global de erros)

---

## 📂 Estrutura de Pastas
```
src/
├── auth/                # Módulo de autenticação (JWT + Users)
│   ├── dto/             # DTOs de login e criação de usuário
│   ├── auth.controller.ts
│   └── auth.service.ts
│
├── cliente/             # Módulo Cliente (CRUD)
│   ├── dto/             # DTOs de criação/atualização
│   ├── cliente.entity.ts
│   └── cliente.service.ts
│
├── funcionario/         # Módulo Funcionário (CRUD + roles)
│   ├── dto/
│   ├── funcionario.entity.ts
│   └── funcionario.service.ts
│
├── remedio/             # Módulo Remédio (CRUD)
│   ├── dto/
│   ├── remedio.entity.ts
│   └── remedio.service.ts
│
├── common/              # Código compartilhado
│   ├── decorators/      # @Roles()
│   ├── guards/          # RolesGuard
│   └── filters/         # Exception filter global
│
├── app.module.ts        # Configuração principal
└── main.ts              # Bootstrap da aplicação
```

---

## 🛠️ Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/farmacia-saudemais.git
cd farmacia-saudemais
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz com:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=saudemais

# JWT
JWT_SECRET=supersecreto
JWT_EXPIRES_IN=1h

# Porta da aplicação
PORT=3000
```

### 4. Crie o banco no PostgreSQL
```sql
CREATE DATABASE saudemais;
```

### 5. Execute a aplicação
```bash
npm run start:dev
```

---

## 📖 Documentação com Swagger

Acesse:
```
http://localhost:3000/docs
```

Todos os endpoints estarão documentados, incluindo payloads de exemplo, roles exigidas e códigos de resposta.

---

## 🔐 Fluxo de Autenticação e Papéis

### Papéis (roles):
- **GERENTE**
  - Pode criar/atualizar/deletar funcionários
  - Pode criar/deletar clientes
  - Pode criar usuários (contas de acesso)
- **FARMACÊUTICO**
  - Pode criar/atualizar/deletar remédios
  - Pode listar clientes/remédios
- **ATENDENTE**
  - Pode criar/atualizar clientes
  - Pode listar clientes
  - Não pode deletar clientes

### Fluxo:
1. Criar o **seed-admin** (primeiro gerente)
   - `POST /auth/seed-admin`
   - Cria automaticamente o usuário `admin@saudemais.com / admin123`

2. Fazer login
   - `POST /auth/login`
   - Retorna um `access_token` (JWT)

3. Autorizar no Swagger
   - Clique em **Authorize** → cole `Bearer <token>`

4. Criar Funcionários
   - `POST /funcionarios`
   - Exemplo:
   ```json
   {
     "nome": "Maria Souza",
     "cpf": "12345678900",
     "cargo": "ATENDENTE",
     "salario": 2000,
     "dataAdmissao": "2025-01-10",
     "email": "maria.souza@saudemais.com"
   }
   ```

5. Criar Usuários vinculados ao Funcionário
   - `POST /auth/users`
   - Exemplo:
   ```json
   {
     "email": "maria.souza@saudemais.com",
     "password": "123456",
     "role": "ATENDENTE",
     "funcionarioId": 3
   }
   ```

6. Usar o login com esse novo usuário para acessar endpoints permitidos ao seu papel.

---

## 📊 Exemplos de Payloads

### Criar Cliente
```json
{
  "nome": "João Silva",
  "cpf": "98765432100",
  "telefone": "83988887777",
  "email": "joao.silva@email.com",
  "endereco": "Rua A, 123 - Centro"
}
```

### Criar Remédio
```json
{
  "nomeComercial": "Dipirona 1g",
  "principioAtivo": "Dipirona",
  "fabricante": "GenMed",
  "preco": 12.5,
  "receitaObrigatoria": false,
  "estoque": 100
}
```

---

## ⚙️ Funcionalidades Especiais
- **Paginação** com `?limit=&page=&search=`
- **Validações automáticas** (`class-validator`)
- **Guards** para controle de acesso por papéis
- **Middleware de log** para requisições
- **Filtros globais** para padronizar mensagens de erro
- **Swagger** para documentação e testes interativos

---

## 👨‍💻 Autor
Desenvolvido por mim, Ítalo Costa.
Projeto didático para demonstrar uso do **NestJS** e boas práticas em APIs REST.

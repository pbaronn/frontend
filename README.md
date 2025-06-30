# 📋 Documentação Completa - Rotas, Login e Usuários

## 🔐 Autenticação e Login

### Endpoint de Login
```
POST /api/auth/login
```

**Corpo da requisição:**
```json
{
  "email": "joao.silva@empresa.com",
  "password": "123456"
}
```

**Resposta de sucesso:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Headers necessários para requisições autenticadas:**
```
x-auth-token: [token_jwt_aqui]
Content-Type: application/json
```

---

## 👥 Usuários Disponíveis para Teste

### Funcionários (Employee)
| Nome | Email | Senha | Função |
|------|-------|-------|--------|
| João Silva | joao.silva@empresa.com | 123456 | Submeter relatórios de despesa |
| Maria Santos | maria.santos@empresa.com | 123456 | Submeter relatórios de despesa |

### Gestores (Manager)
| Nome | Email | Senha | Função |
|------|-------|-------|--------|
| Pedro Oliveira | pedro.oliveira@empresa.com | 123456 | Aprovar/rejeitar despesas, gerenciar funcionários |
| Ana Costa | ana.costa@empresa.com | 123456 | Aprovar/rejeitar despesas, gerenciar funcionários |

### Diretores (Director)
| Nome | Email | Senha | Função |
|------|-------|-------|--------|
| Carlos Ferreira | carlos.ferreira@empresa.com | 123456 | Verificar assinaturas, visualizar relatórios assinados |
| Lucia Rodrigues | lucia.rodrigues@empresa.com | 123456 | Verificar assinaturas, visualizar relatórios assinados |

---

## 🛣️ Rotas da API

### 🔐 Autenticação
| Método | Rota | Descrição | Autenticação | Roles |
|--------|------|-----------|--------------|-------|
| POST | `/api/auth/login` | Login de usuário | ❌ | Todos |

### 👥 Usuários
| Método | Rota | Descrição | Autenticação | Roles |
|--------|------|-----------|--------------|-------|
| POST | `/api/users` | Criar usuário | ❌ | Todos |
| GET | `/api/users` | Listar usuários | ✅ | Manager, Director |
| PUT | `/api/users/:id` | Editar usuário | ✅ | Manager, Director |
| DELETE | `/api/users/:id` | Excluir usuário | ✅ | Manager, Director |
| POST | `/api/users/quick-create` | Criar usuário rápido (dev) | ❌ | Todos |

### 📊 Relatórios
| Método | Rota | Descrição | Autenticação | Roles |
|--------|------|-----------|--------------|-------|
| POST | `/api/reports/submit` | Submeter relatório | ✅ | Employee |
| POST | `/api/reports/sign/:id` | Assinar relatório | ✅ | Manager |
| GET | `/api/reports/pending` | Listar pendentes | ✅ | Manager |
| GET | `/api/reports/signed` | Listar assinados | ✅ | Director |
| GET | `/api/reports/:id` | Buscar por ID | ✅ | Todos |

---

## 📝 Exemplos de Uso das Rotas

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@empresa.com",
    "password": "123456"
  }'
```

### 2. Criar Usuário
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Funcionário",
    "email": "novo@empresa.com",
    "password": "Senha123",
    "role": "employee"
  }'
```

### 3. Listar Usuários (precisa autenticação)
```bash
curl -X GET http://localhost:5000/api/users \
  -H "x-auth-token: [seu_token_aqui]" \
  -H "Content-Type: application/json"
```

### 4. Editar Usuário
```bash
curl -X PUT http://localhost:5000/api/users/[user_id] \
  -H "x-auth-token: [seu_token_aqui]" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome Atualizado",
    "email": "atualizado@empresa.com",
    "role": "manager"
  }'
```

### 5. Excluir Usuário
```bash
curl -X DELETE http://localhost:5000/api/users/[user_id] \
  -H "x-auth-token: [seu_token_aqui]"
```

### 6. Submeter Relatório (com arquivo)
```bash
curl -X POST http://localhost:5000/api/reports/submit \
  -H "x-auth-token: [seu_token_aqui]" \
  -F "description=Almoço com cliente" \
  -F "amount=45.50" \
  -F "dataHash=abc123..." \
  -F "receipt=@/caminho/para/recibo.jpg"
```

### 7. Listar Relatórios Pendentes
```bash
curl -X GET http://localhost:5000/api/reports/pending \
  -H "x-auth-token: [seu_token_aqui]"
```

### 8. Assinar Relatório
```bash
curl -X POST http://localhost:5000/api/reports/sign/[report_id] \
  -H "x-auth-token: [seu_token_aqui]" \
  -H "Content-Type: application/json" \
  -d '{
    "signature": "assinatura_digital_aqui"
  }'
```

### 9. Listar Relatórios Assinados
```bash
curl -X GET http://localhost:5000/api/reports/signed \
  -H "x-auth-token: [seu_token_aqui]"
```

---

## 🌐 Rotas do Frontend

### Páginas Principais
| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Página inicial | Todos |
| `/login` | Página de login | Não autenticados |
| `/dashboard` | Dashboard principal | Autenticados |

### Funcionários
| Rota | Descrição | Roles |
|------|-----------|-------|
| `/dashboard/employees` | CRUD de funcionários | Manager, Director |

### Despesas
| Rota | Descrição | Roles |
|------|-----------|-------|
| `/dashboard/expenses/submit` | Submeter despesa | Employee |
| `/dashboard/expenses/pending` | Despesas pendentes | Manager |
| `/dashboard/expenses/sign/[id]` | Assinar despesa | Manager |
| `/dashboard/expenses/signed` | Despesas assinadas | Director |
| `/dashboard/expenses/validate/[id]` | Validar despesa | Manager |
| `/dashboard/expenses/verify/[id]` | Verificar assinatura | Director |

---

## 🔧 Como Testar o Sistema

### 1. Iniciar o Servidor
```bash
# Terminal 1 - Backend
cd backend
node server-working.js

# Terminal 2 - Frontend
cd frontend
  npm run build
  npm start
```

### 2. Acessar o Sistema
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 3. Fluxo de Teste Completo

#### Passo 1: Login como Funcionário
1. Acesse http://localhost:3000/login
2. Use as credenciais:
   - Email: `joao.silva@empresa.com`
   - Senha: `123456`

#### Passo 2: Submeter Relatório
1. Vá para "Nova Despesa"
2. Preencha os dados
3. Anexe um recibo
4. Envie o relatório

#### Passo 3: Login como Gestor
1. Faça logout
2. Login com:
   - Email: `pedro.oliveira@empresa.com`
   - Senha: `123456`

#### Passo 4: Aprovar Relatório
1. Vá para "Despesas Pendentes"
2. Clique em "Assinar"
3. Assine digitalmente o relatório

#### Passo 5: Login como Diretor
1. Faça logout
2. Login com:
   - Email: `carlos.ferreira@empresa.com`
   - Senha: `123456`

#### Passo 6: Verificar Assinatura
1. Vá para "Despesas Assinadas"
2. Verifique a autenticidade da assinatura

---

## 🛡️ Validações e Segurança

### Validações de Usuário
- Nome: 2-50 caracteres, apenas letras
- Email: formato válido
- Senha: mínimo 6 caracteres, 1 maiúscula, 1 minúscula, 1 número
- Role: employee, manager ou director

### Validações de Relatório
- Descrição: 10-500 caracteres
- Valor: positivo entre 0.01 e 999999.99
- Hash: obrigatório
- Arquivo: imagem ou PDF até 5MB

### Medidas de Segurança
- Rate limiting: 100 req/15min, 5 login/15min
- JWT com expiração de 5 horas
- Senhas criptografadas com bcrypt
- Validação e sanitização de entrada
- Headers de segurança (Helmet)
- CORS configurado

---

## 📞 Suporte

Para dúvidas ou problemas:
- **Email**: suporte@empresa.com
- **GitHub Issues**: [Link para issues]
- **Documentação**: [SECURITY.md](./SECURITY.md)

---

## 🔄 Atualizações

### Versão 1.0.0
- ✅ Sistema completo implementado
- ✅ 6 usuários de teste criados
- ✅ Todas as rotas funcionais
- ✅ Medidas de segurança ativadas
- ✅ Frontend responsivo
- ✅ Deploy no GitHub Pages configurado 
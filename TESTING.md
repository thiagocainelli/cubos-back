# 🧪 Guia de Testes - Cubos Backend

Este documento descreve como executar e manter os testes do projeto Cubos Backend.

## 📋 Visão Geral

O projeto utiliza **Jest** como framework de testes principal, com suporte completo a TypeScript e mocks para dependências externas.

## 🚀 Executando os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes em CI (sem watch, com cobertura)
npm run test:ci
```

### Executar Testes Específicos

```bash
# Executar testes de um arquivo específico
npm test -- auth.service.test.ts

# Executar testes de um diretório específico
npm test -- src/_core/auth/__tests__/

# Executar testes com um padrão específico
npm test -- --testNamePattern="should login successfully"
```

## 🏗️ Estrutura dos Testes

```
src/
├── __tests__/                    # Configurações globais de teste
│   ├── setup.ts                  # Setup global do Jest
│   ├── mocks/                    # Mocks compartilhados
│   │   └── prisma.mock.ts       # Mock do Prisma Client
│   └── utils/                    # Utilitários para testes
│       └── test.utils.ts         # Helpers e dados de teste
├── _core/
│   ├── auth/__tests__/          # Testes de autenticação
│   ├── middlewares/__tests__/   # Testes de middlewares
│   └── __tests__/               # Testes de funcionalidades core
├── users/__tests__/             # Testes de usuários
├── movies/__tests__/            # Testes de filmes
├── storage/__tests__/           # Testes de storage
└── integrations/__tests__/      # Testes de integrações
```

## 🎯 Cobertura de Testes

### Módulos Testados

- ✅ **Autenticação**: Login, registro, refresh token, middleware JWT
- ✅ **Usuários**: CRUD, validações, tipos de usuário
- ✅ **Filmes**: CRUD, filtros, paginação, avaliações
- ✅ **Storage**: Upload, download, gerenciamento de arquivos
- ✅ **Integrações**: S3 R2, SMTP, email
- ✅ **Utilitários**: Criptografia, JWT, decorators
- ✅ **Exceções**: HTTP exceptions, Prisma error handling
- ✅ **Configurações**: Swagger, inicialização

### Estatísticas de Cobertura

```bash
npm run test:coverage
```

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## 🔧 Configuração do Jest

### jest.config.js

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/app.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
};
```

### Setup Global (src/**tests**/setup.ts)

- Configuração de variáveis de ambiente para testes
- Mock do console para reduzir ruído
- Configurações globais do Jest

## 🎭 Sistema de Mocks

### Mocks do Prisma

```typescript
// src/__tests__/mocks/prisma.mock.ts
export const mockPrisma = {
  users: { findUnique: jest.fn(), create: jest.fn() },
  movies: { findMany: jest.fn(), update: jest.fn() },
  storage: { findUnique: jest.fn(), create: jest.fn() },
};
```

### Mocks de Serviços Externos

- **AWS SDK**: Mockado para testes S3 R2
- **Resend**: Mockado para testes de email
- **JWT**: Mockado para testes de autenticação

## 📝 Padrões de Teste

### Estrutura AAA (Arrange, Act, Assert)

```typescript
describe('UserService', () => {
  it('should create user successfully', async () => {
    // Arrange
    const userData = { name: 'John', email: 'john@example.com' };
    mockPrisma.users.create.mockResolvedValue(userData);

    // Act
    const result = await createUser(userData);

    // Assert
    expect(result).toBeDefined();
    expect(result.name).toBe(userData.name);
  });
});
```

### Testes de Erro

```typescript
it('should throw error when user not found', async () => {
  // Arrange
  mockPrisma.users.findUnique.mockResolvedValue(null);

  // Act & Assert
  await expect(getUser('invalid-id')).rejects.toThrow('User not found');
});
```

### Testes de Integração

```typescript
it('should handle full authentication flow', async () => {
  // Arrange
  const credentials = { email: 'test@example.com', password: 'password' };

  // Act
  const loginResult = await login(credentials);
  const user = await verifyToken(loginResult.token);

  // Assert
  expect(user.email).toBe(credentials.email);
});
```

## 🧹 Limpeza e Manutenção

### Limpeza de Mocks

```typescript
beforeEach(() => {
  clearAllMocks();
});

function clearAllMocks() {
  jest.clearAllMocks();
  Object.values(mockPrisma).forEach((mock) => {
    if (typeof mock === 'object' && mock !== null) {
      Object.values(mock).forEach((method) => {
        if (typeof method === 'function') {
          (method as jest.Mock).mockClear();
        }
      });
    }
  });
}
```

### Restauração de Estado

```typescript
afterEach(() => {
  // Cleanup após cada teste
});

afterAll(() => {
  // Cleanup global após todos os testes
});
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de Importação de Módulos

```bash
Error: Cannot find module 'src/_core/prisma.pg'
```

**Solução**: Verificar se o mock está sendo aplicado corretamente:

```typescript
jest.mock('../../_core/prisma.pg', () => ({
  __esModule: true,
  default: mockPrisma,
}));
```

#### 2. Testes Falhando por Timeout

```bash
Timeout - Async callback was not invoked within the 10000ms timeout
```

**Solução**: Aumentar o timeout ou verificar se o mock está retornando Promise:

```typescript
(mockPrisma.users.findUnique as jest.Mock).mockResolvedValue(userData);
```

#### 3. Mocks Não Funcionando

**Solução**: Verificar a ordem dos imports e mocks:

```typescript
// 1. Mock primeiro
jest.mock('../service');

// 2. Import depois
import { Service } from '../service';
```

### Debug de Testes

```bash
# Executar com mais detalhes
npm test -- --verbose

# Executar um teste específico com debug
npm test -- --testNamePattern="should login" --verbose

# Executar com console.log visível
npm test -- --silent=false
```

## 📊 Relatórios de Cobertura

### HTML Report

Após executar `npm run test:coverage`, abra:

```
coverage/lcov-report/index.html
```

### LCOV Report

Para integração com CI/CD:

```
coverage/lcov.info
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
- name: Run Tests
  run: npm run test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### GitLab CI

```yaml
test:
  script:
    - npm run test:ci
  coverage: '/All files[^|]*\|[^|]*\|[^|]*\|[^|]*\s+(\d+)/'
```

## 📚 Recursos Adicionais

### Documentação Jest

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest with TypeScript](https://jestjs.io/docs/getting-started#using-typescript)

### Boas Práticas

- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)

### Ferramentas Relacionadas

- **ts-jest**: Transformador TypeScript para Jest
- **@types/jest**: Tipos TypeScript para Jest
- **supertest**: Testes de integração HTTP

## 🤝 Contribuindo com Testes

### Adicionando Novos Testes

1. Crie o arquivo de teste no diretório `__tests__` correspondente
2. Siga o padrão de nomenclatura: `*.test.ts`
3. Use a estrutura AAA (Arrange, Act, Assert)
4. Adicione mocks apropriados para dependências externas
5. Execute os testes localmente antes de fazer commit

### Exemplo de Novo Teste

```typescript
// src/newModule/__tests__/newService.test.ts
import { mockPrisma } from '../../_core/__tests__/mocks/prisma.mock';
import { newService } from '../newService';

describe('NewService', () => {
  beforeEach(() => {
    clearAllMocks();
  });

  it('should perform operation successfully', async () => {
    // Arrange
    const input = { data: 'test' };
    mockPrisma.table.create.mockResolvedValue({ id: 1, ...input });

    // Act
    const result = await newService(input);

    // Assert
    expect(result).toBeDefined();
    expect(mockPrisma.table.create).toHaveBeenCalledWith({ data: input });
  });
});
```

---

**Nota**: Mantenha os testes atualizados conforme o código evolui. Testes são uma parte essencial da qualidade do software e devem ser tratados com a mesma importância que o código de produção.

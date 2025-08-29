import dotenv from 'dotenv';

// Carrega variáveis de ambiente para testes
dotenv.config({ path: '.env.test' });

// Configurações globais para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing-only';
process.env.ENCRYPTION_KEY = 'dGVzdC1lbmNyeXB0aW9uLWtleS1mb3ItdGVzdGluZy1vbmx5';

// Mock do console para reduzir ruído nos testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configuração global do Jest
beforeAll(() => {
  // Setup global antes de todos os testes
});

afterAll(() => {
  // Cleanup global após todos os testes
});

beforeEach(() => {
  // Setup antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup após cada teste
});

# 🕐 Sistema de Cron - Notificações de Lançamentos de Filmes

## 📋 Visão Geral

Este sistema implementa um cron job que executa diariamente às **08:00 AM** para enviar e-mails notificando todos os usuários sobre filmes lançados no dia.

## 🎯 Funcionalidades

- **Cron Automático**: Execução diária às 08:00 AM (timezone Brasil)
- **Notificações por E-mail**: Envio automático para todos os usuários
- **Template HTML Responsivo**: E-mail bonito e estilizado
- **API de Controle**: Endpoints para gerenciar e testar o cron
- **Logs Detalhados**: Monitoramento completo das execuções

## 🏗️ Arquitetura

```
src/integrations/cron/
├── movieReleaseNotification.service.ts  # Serviço principal do cron
├── initCron.service.ts                  # Inicialização de todos os crons
├── cron.controller.ts                   # Controller para API
├── cron.routes.ts                      # Rotas da API
├── templates/
│   └── movieReleaseEmail.template.ts   # Template HTML do e-mail
└── index.ts                            # Exportações
```

## ⚙️ Configuração

### Variáveis de Ambiente Necessárias

```bash
# E-mail (Resend)
RESEND_API_KEY=sua_chave_api_resend
RESEND_EMAIL_SENDER=remetente@dominio.com

# Cloudflare R2 (para posters dos filmes)
CLOUDFLARE_R2_BUCKET=nome_do_bucket
CLOUDFLARE_R2_ENDPOINT=https://account_id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=chave_acesso
CLOUDFLARE_R2_SECRET_ACCESS_KEY=chave_secreta
CLOUDFLARE_R2_PUBLIC_URL=https://cdn.dominio.com
```

## 🚀 Como Usar

### 1. Inicialização Automática

O cron é iniciado automaticamente quando o servidor é iniciado:

```typescript
// src/server.ts
const cronService = CronInitService.getInstance();
cronService.startAllCrons();
```

### 2. Controle Manual via API

#### Verificar Status dos Crons

```bash
GET /api/v1/cron/status
```

#### Testar Notificações Manualmente

```bash
POST /api/v1/cron/test-movie-notifications
```

#### Parar Todos os Crons

```bash
POST /api/v1/cron/stop
```

#### Reiniciar Todos os Crons

```bash
POST /api/v1/cron/restart
```

### 3. Uso Programático

```typescript
import { CronInitService } from './integrations/cron';

// Iniciar cron
const cronService = CronInitService.getInstance();
cronService.startAllCrons();

// Testar manualmente
await cronService.testMovieReleaseNotifications();

// Parar cron
cronService.stopAllCrons();
```

## 📧 Template do E-mail

O e-mail inclui:

- **Header**: Título e data atual
- **Lista de Filmes**: Todos os filmes lançados no dia
- **Detalhes**: Gênero, situação, data de lançamento, avaliação
- **Poster**: Imagem do filme (se disponível)
- **Footer**: Links e informações da empresa
- **Design Responsivo**: Funciona em desktop e mobile

### Características do Template

- ✅ HTML5 semântico
- ✅ CSS inline para compatibilidade
- ✅ Design responsivo
- ✅ Gradientes e animações
- ✅ Emojis para melhor UX
- ✅ Cores atrativas e modernas

## 🔄 Cronograma

- **Frequência**: Diário
- **Horário**: 08:00 AM
- **Timezone**: America/Sao_Paulo (Brasil)
- **Expressão Cron**: `0 8 * * *`

## 📊 Monitoramento

### Logs de Execução

```
🕐 Executando cron de notificação de lançamentos de filmes...
🎬 Encontrados 3 filme(s) lançado(s) hoje
👥 Enviando notificações para 150 usuário(s)
✅ E-mail enviado para: usuario1@email.com
✅ E-mail enviado para: usuario2@email.com
🎉 Processo de notificação concluído
```

### Logs de Erro

```
❌ Erro no cron de notificação de filmes: [detalhes do erro]
❌ Erro ao enviar e-mail para usuario@email.com: [detalhes]
```

## 🧪 Testes

### Teste Manual

```typescript
// Via API
POST / api / v1 / cron / test - movie - notifications;

// Via código
await cronService.testMovieReleaseNotifications();
```

### Teste de Template

```typescript
import { generateMovieReleaseEmailHTML } from './templates/movieReleaseEmail.template';

const html = generateMovieReleaseEmailHTML(mockMovies);
console.log(html); // Visualizar HTML gerado
```

## 🔧 Manutenção

### Adicionar Novo Cron

1. Criar novo serviço em `src/integrations/cron/`
2. Adicionar ao `CronInitService`
3. Adicionar rotas de controle se necessário
4. Documentar no README

### Modificar Template

1. Editar `movieReleaseEmail.template.ts`
2. Testar com diferentes dados
3. Verificar responsividade
4. Atualizar documentação

## 🚨 Troubleshooting

### Cron Não Executa

- Verificar logs do servidor
- Confirmar timezone configurado
- Verificar se o serviço foi iniciado
- Testar manualmente via API

### E-mails Não Enviados

- Verificar variáveis de ambiente
- Confirmar API key do Resend
- Verificar logs de erro
- Testar serviço de e-mail isoladamente

### Template Não Renderiza

- Verificar dados dos filmes
- Confirmar campos obrigatórios
- Testar com dados mock
- Verificar console do navegador

## 📝 Notas Importantes

- O cron só executa se houver filmes com `releaseDate` igual ao dia atual
- Usuários sem e-mail são ignorados automaticamente
- E-mails são enviados em paralelo para melhor performance
- O sistema é resiliente a falhas individuais de envio
- Logs detalhados facilitam debugging

## 🔮 Futuras Melhorias

- [ ] Sistema de retry para e-mails falhados
- [ ] Métricas e analytics de envio
- [ ] Templates personalizáveis por usuário
- [ ] Agendamento flexível de notificações
- [ ] Integração com webhooks
- [ ] Dashboard de monitoramento

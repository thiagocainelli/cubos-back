import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import express from 'express';

// Config i18n
import i18n from './_core/config/i18n';
import i18nextMiddleware from 'i18next-http-middleware';

// Swagger
import { setupSwagger } from './_core/swagger';

// Middlewares Error
import { errorHandler } from './_core/middlewares/errorHandler.middleware';

// Routes Postgres
import userRoutes from './users/users.routes';
import authRoutes from './_core/auth/auth.routes';
import auditsRoutes from './audits/audits.routes';
import errorLogsRoutes from './errorLogs/errorLogs.routes';
import finishingsRoutes from './finishings/finishings.routes';
import fittingsRoutes from './fittings/fittings.routes';
import glassPricingsRoutes from './glassPricings/glassPricings.routes';
import pricingGlobalSettingsRoutes from './pricingGlobalSettings/pricingGlobalSettings.routes';
import orcamentosRoutes from './orcamentos/orcamentos.routes';
import pedidosRoutes from './pedidos/pedidos.routes';
import storageRoutes from './storage/storage.routes';
import googleVisionRoutes from './integrations/googleVision/googleVision.routes';
import webGlassRoutes from './integrations/webGlass/webGlass.routes';
import chatRoutes from './chat/chat.routes';
import superAdminDashboardRoutes from './dashboards/superAdmin/dashboard.routes';
import adminDashboardRoutes from './dashboards/admin/routes/adminDashboard.routes';
import colaboradorDashboardRoutes from './dashboards/colaborador/routes/colaboradorDashboard.routes';
import representativeDashboardRoutes from './dashboards/representative/routes/representativeDashboard.routes';
import comunicacoesRoutes from './comunicacoes/comunicacoes.routes';
import tabelaDescontoAcrescimoClienteRoutes from './tabelaDescontoAcrescimoCliente/tabelaDescontoAcrescimoCliente.routes';
import notificationsRoutes from './notifications/notifications.routes';
import aticClientRoutes from './integrations/autotrac/atic-client.routes';

// Mysql
import clientsRoutes from './clients/clients.routes';
import ordersRoutes from './orders/orders.routes';
import representativesRoutes from './users/representatives.routes';
import productsRoutes from './products/products.routes';
import subgrupoProdRoutes from './subgrupoProd/subgrupoProd.routes';
import userGroupsRoutes from './userGroups/userGroups.routes';
import formapagtoRoutes from './formapagto/formapagto.routes';
import parcelasRoutes from './parcelas/parcelas.routes';
import tipoEntregaRoutes from './tipoEntrega/tipoEntrega.routes';
import transportadorRoutes from './transportador/transportador.routes';
import cidadeRoutes from './cidade/cidade.routes';
import glassRoutingRulesRoutes from './glassRoutingRules/glassRoutingRules.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(i18nextMiddleware.handle(i18n));

app.get('/', (_req, res) => {
  res.json({ message: 'API is running' });
});

// Postgres
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/audits', auditsRoutes);
app.use('/api/v1/errorLogs', errorLogsRoutes);
app.use('/api/v1/finishings', finishingsRoutes);
app.use('/api/v1/fittings', fittingsRoutes);
app.use('/api/v1/glassPricings', glassPricingsRoutes);
app.use('/api/v1/representatives', representativesRoutes);
app.use('/api/v1/pricingGlobalSettings', pricingGlobalSettingsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orcamentos', orcamentosRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);
app.use('/api/v1/storage', storageRoutes);
app.use('/api/v1/google-vision', googleVisionRoutes);
app.use('/api/v1/webglass', webGlassRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/dashboards/superAdmin', superAdminDashboardRoutes);
app.use('/api/v1/dashboards/admin', adminDashboardRoutes);
app.use('/api/v1/dashboards/colaborador', colaboradorDashboardRoutes);
app.use('/api/v1/dashboards/representative', representativeDashboardRoutes);
app.use('/api/v1/comunicacoes', comunicacoesRoutes);
app.use('/api/v1/tabelaDescontoAcrescimoCliente', tabelaDescontoAcrescimoClienteRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/autotrac', aticClientRoutes);

// Postgres
app.use('/api/v1/clients', clientsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/subgrupoProd', subgrupoProdRoutes);
app.use('/api/v1/userGroups', userGroupsRoutes);
app.use('/api/v1/formapagto', formapagtoRoutes);
app.use('/api/v1/parcelas', parcelasRoutes);
app.use('/api/v1/tipoEntrega', tipoEntregaRoutes);
app.use('/api/v1/transportador', transportadorRoutes);
app.use('/api/v1/cidade', cidadeRoutes);
app.use('/api/v1/glass-routing-rules', glassRoutingRulesRoutes);

setupSwagger(app);
app.use(errorHandler as express.ErrorRequestHandler);

export default app;

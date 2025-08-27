import { PrismaClient as PostgresClient } from '../../prisma-outputs/postgres-client';

const prisma = new PostgresClient();

export default prisma;

import prisma from '../../_core/prisma.pg';

export const getAllUsersEmails = async (): Promise<string[]> => {
  try {
    const users = await prisma.users.findMany({
      where: {
        email: {
          not: null,
        },
        deletedAt: null,
      },
      select: {
        email: true,
      },
    });

    const emails = users
      .map((user) => user.email)
      .filter((email): email is string => email !== null);

    return emails;
  } catch (error) {
    console.error('Erro ao buscar e-mails dos usuários:', error);
    throw new Error('Erro ao buscar e-mails dos usuários');
  }
};

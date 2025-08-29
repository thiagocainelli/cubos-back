import * as cron from 'node-cron';
import { sendEmailService } from '../smtpEmail/service/sendEmail.service';
import { getMoviesReleasedToday } from '../../movies/services/getMoviesReleasedToday.service';
import { getAllUsersEmails } from '../../users/services/getAllUsersEmails.service';
import { generateMovieReleaseEmailHTML } from './templates/movieReleaseEmail.template';

export class MovieReleaseNotificationService {
  private static instance: MovieReleaseNotificationService;
  private cronJob: cron.ScheduledTask | null = null;

  private constructor() {}

  public static getInstance(): MovieReleaseNotificationService {
    if (!MovieReleaseNotificationService.instance) {
      MovieReleaseNotificationService.instance = new MovieReleaseNotificationService();
    }
    return MovieReleaseNotificationService.instance;
  }

  public startCronJob(): void {
    // Executa todos os dias às 8:00 AM
    this.cronJob = cron.schedule(
      '00 8 * * *',
      async () => {
        console.log('🕐 Executando cron de notificação de lançamentos de filmes...');
        await this.sendMovieReleaseNotifications();
      },
      {
        timezone: 'America/Sao_Paulo', // Timezone do Brasil
      },
    );

    console.log('✅ Cron de notificação de lançamentos de filmes iniciado (10:45 AM diário)');
  }

  public stopCronJob(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('⏹️ Cron de notificação de lançamentos de filmes parado');
    }
  }

  private async sendMovieReleaseNotifications(): Promise<void> {
    try {
      // Buscar filmes lançados hoje
      const moviesReleasedToday = await getMoviesReleasedToday();

      if (moviesReleasedToday.length === 0) {
        console.log('📽️ Nenhum filme lançado hoje');
        return;
      }

      console.log(`🎬 Encontrados ${moviesReleasedToday.length} filme(s) lançado(s) hoje`);

      // Buscar todos os usuários
      const userEmails = await getAllUsersEmails();

      if (userEmails.length === 0) {
        console.log('👥 Nenhum usuário encontrado para envio');
        return;
      }

      console.log(`📧 Enviando notificações para ${userEmails.length} usuário(s)`);

      // Enviar e-mail para cada usuário
      await sendEmailService(
        userEmails,
        '🎬 LANÇAMENTOS DO DIA',
        generateMovieReleaseEmailHTML(moviesReleasedToday),
      );
      console.log('🎉 Processo de notificação concluído');
    } catch (error) {
      console.error('❌ Erro no cron de notificação de filmes:', error);
    }
  }

  // Método para teste manual
  public async sendNotificationsManually(): Promise<void> {
    console.log('🔧 Executando notificações manualmente...');
    await this.sendMovieReleaseNotifications();
  }
}

import { MovieReleaseNotificationService } from './movieReleaseNotification.service';

export class CronInitService {
  private static instance: CronInitService;
  private movieReleaseService: MovieReleaseNotificationService;

  private constructor() {
    this.movieReleaseService = MovieReleaseNotificationService.getInstance();
  }

  public static getInstance(): CronInitService {
    if (!CronInitService.instance) {
      CronInitService.instance = new CronInitService();
    }
    return CronInitService.instance;
  }

  public startAllCrons(): void {
    console.log('🚀 Iniciando todos os serviços de cron...');

    try {
      // Iniciar cron de notificação de filmes
      this.movieReleaseService.startCronJob();

      console.log('✅ Todos os crons foram iniciados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao iniciar crons:', error);
    }
  }

  public stopAllCrons(): void {
    console.log('⏹️ Parando todos os serviços de cron...');

    try {
      // Parar cron de notificação de filmes
      this.movieReleaseService.stopCronJob();

      console.log('✅ Todos os crons foram parados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao parar crons:', error);
    }
  }

  // Método para teste manual
  public async testMovieReleaseNotifications(): Promise<void> {
    console.log('🧪 Testando notificações de lançamento de filmes...');
    await this.movieReleaseService.sendNotificationsManually();
  }
}

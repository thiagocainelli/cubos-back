import { initModules } from './_init/init.service';
import app from './app';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  try {
    await initModules();
    app.listen(PORT, () => {
      console.info(`🚀 Application is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error during application initialization:', error);
    process.exit(1);
  }
}

bootstrap();

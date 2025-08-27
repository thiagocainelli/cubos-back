import app from '/app';
import { initModules } from './_init/init.service';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  try {
    await initModules();
    app.listen(PORT, () => {
      console.info(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error during system initialization:', error);
    process.exit(1);
  }
}

bootstrap();

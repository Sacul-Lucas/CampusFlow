import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3500;
  void app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend-dev running on port ${PORT}`);
  });
}
void bootstrap();

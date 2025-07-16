import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir requisições do frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3001);
  console.log(`Servidor rodando na porta ${process.env.PORT || 3001}`);
}
bootstrap(); 
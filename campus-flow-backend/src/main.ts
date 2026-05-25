/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import multer from 'multer';
import dns from 'dns';
import { UploadService } from './uploads/upload.service';
import { multerConfig } from './uploads/multer.config';
import cors from 'cors';

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const uploadService = app.get(UploadService);
  const uploader = multer(multerConfig);
  const server = app.getHttpAdapter().getInstance() as express.Express;

  app.use(
    cors({
      origin: 'https://campus-flow-7a5e.vercel.app', // Allow only your Vercel frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }),
  );

  app.options("*", cors({
    origin: "https://campus-flow-7a5e.vercel.app",
    credentials: true
  }));

  server.post(
    '/uploads/thumbnails',
    uploader.single('file'),
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: 'Arquivo não enviado' });
      }

      try {
        const result = await uploadService.uploadFile(
          req.file,
          'lives/thumbnails',
        );
        return res.json(result);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Falha ao enviar thumbnail';
        return res.status(500).json({
          message,
        });
      }
    },
  );

  server.post('/uploads/banners', uploader.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Arquivo não enviado' });
    }

    try {
      const result = await uploadService.uploadFile(req.file, 'lives/banners');
      return res.json(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Falha ao enviar banner';
      return res.status(500).json({
        message,
      });
    }
  });

  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads'), {
      extensions: ['png', 'jpg', 'jpeg', 'webp'],
    }),
  );
  app.use(
    '/seed',
    express.static(join(process.cwd(), 'uploads', 'seed'), {
      extensions: ['png', 'jpg', 'jpeg', 'webp'],
    }),
  );

  const PORT = process.env.PORT || 3500;
  void app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend-dev running on port ${PORT}`);
  });
}
void bootstrap();

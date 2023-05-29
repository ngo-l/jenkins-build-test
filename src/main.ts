import { NestFactory } from '@nestjs/core'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors(corsOptions)
  await app.listen(3000)
}

const corsOptions: CorsOptions = {
  origin: '*',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true,
}

bootstrap()

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationService } from './services/LocationService';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, LocationService],
})
export class AppModule {}

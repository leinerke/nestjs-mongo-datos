import { Global, Module } from '@nestjs/common';
import { MongoClient } from 'mongodb';

import config from '../config';
import { ConfigType } from '@nestjs/config';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'MONGO',
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { mongo } = configService;
        const uri = `${mongo.connection}://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/?authSource=admin&readPreference=primary`;
        const client = new MongoClient(uri);
        await client.connect();
        return client.db(mongo.dbName);
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'MONGO'],
})
export class DatabaseModule {}

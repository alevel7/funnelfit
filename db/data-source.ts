import { ConfigModule, ConfigService } from "@nestjs/config";
import { config } from 'dotenv';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";

config({ path: `.env.${process.env.NODE_ENV}` });
const configService = new ConfigService();

console.log(process.env.NODE_ENV);

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.getOrThrow<string>('DB_HOST'),
    port: configService.getOrThrow<number>('DB_PORT'),
    username: configService.getOrThrow<string>('USERNAME'),
    password: configService.getOrThrow<string>('PASSWORD'),
    database: configService.getOrThrow<string>('DATABASE'),
    synchronize: true, // Set to false in production
    logging: true, // Enable logging for debugging
    migrationsTableName: 'migrations',
    migrationsRun: false,
    // entities: ['dist/**/*.entity.{js,ts}'],
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: ['dist/db/migrations/*.js'],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false // For development only
    },
}
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
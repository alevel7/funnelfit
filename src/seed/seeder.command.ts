import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { SeedService } from './seed.service';

async function runSeeders() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
    const userSeeder = app.get(SeedService);
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Optional: Clear existing data
    // await userSeeder.clear();
    
    // Seed users
    await userSeeder.seedUsers();
    
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

runSeeders();
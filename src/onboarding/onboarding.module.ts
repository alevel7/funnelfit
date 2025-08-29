import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';

@Module({
  imports: [],
  controllers: [OnboardingController],
  providers: [],
})
export class OnboardingModule {}

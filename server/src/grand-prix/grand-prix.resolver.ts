import { Query, Resolver } from '@nestjs/graphql';
import { GrandPrix } from '../entities/grand-prix.entity';
import { GrandPrixService } from './grand-prix.service';

@Resolver(() => GrandPrix)
export class GrandPrixResolver {
  constructor(private readonly grandPrixService: GrandPrixService) {}

  @Query(() => [GrandPrix], { name: 'allGrandPrix' })
  async findAll() {
    return this.grandPrixService.findAll();
  }

  @Query(() => [GrandPrix], { name: 'upcomingGrandPrix' })
  async findUpcoming() {
    return this.grandPrixService.findUpcoming();
  }

  @Query(() => [GrandPrix], { name: 'pastGrandPrix' })
  async findPast() {
    return this.grandPrixService.findPast();
  }

  @Query(() => GrandPrix, { name: 'nextGrandPrix', nullable: true })
  async findNext() {
    return this.grandPrixService.findNext();
  }
}

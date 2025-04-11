import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        return {
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          introspection: true,
          sortSchema: true,
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions?.status,
            };
          },
        };
      },
    }),
  ],
  providers: [],
})
export class AppModule {}

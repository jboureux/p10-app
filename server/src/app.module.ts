import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JoinRequestModule } from './join-request/join-request.module';
import { LeagueModule } from './league/league.module';

@Module({
  imports: [
    UsersModule,
    JoinRequestModule,
    LeagueModule,
    AuthModule,
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
            const originalError = error.extensions?.originalError as Error;

            if (!originalError) {
              return {
                message: error.message,
                code: error.extensions?.code,
              };
            }

            // Vérifier si l'erreur est une HttpException (qui a une propriété statusCode)
            if ('statusCode' in originalError) {
              return {
                message: originalError.message,
                code: originalError.statusCode,
              };
            }

            return {
              message: originalError.message,
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

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { BetSelectionResultModule } from './bet-selection-result/bet-selection-result.module';
import { ErgastModule } from './ergast/ergast.module';
import { GrandPrixModule } from './grand-prix/grand-prix.module';
import { JoinRequestModule } from './join-request/join-request.module';
import { LeagueModule } from './league/league.module';
import { PubSubModule } from './public-subscription/public-subscription.module';
import { UsersModule } from './users/users.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ErgastModule,
    AuthModule,
    UsersModule,
    LeagueModule,
    JoinRequestModule,
    BetSelectionResultModule,
    GrandPrixModule,
    PubSubModule,
    PrometheusModule.register(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'dev-secret',
        }),
      ],
      inject: [JwtService],
      useFactory: (jwtService: JwtService) => {
        return {
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          introspection: true,
          sortSchema: true,
          context: async ({ req, connectionParams }) => {
            if (connectionParams) {
              const token =
                connectionParams.Authorization ||
                connectionParams.authorization;
              if (token) {
                const decoded = jwtService.verify(token.replace('Bearer ', ''));
                return {
                  req: {
                    headers: connectionParams,
                    user: {
                      userId: decoded.sub,
                      email: decoded.email,
                      role: decoded.role,
                    },
                  },
                };
              }
            }
            return { req };
          },
          formatError: (error) => {
            const originalError = error.extensions?.originalError as Error;

            if (!originalError) {
              return {
                message: error.message,
                code: error.extensions?.code,
              };
            }

            if ('statusCode' in originalError) {
              return {
                message: originalError.message,
                code: (originalError as any).statusCode,
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

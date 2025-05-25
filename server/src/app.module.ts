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
import { F1ApiModule } from './f1-api/f1-api.module';
import { JoinRequestModule } from './join-request/join-request.module';
import { LeagueModule } from './league/league.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ErgastModule,
    F1ApiModule,
    AuthModule,
    UsersModule,
    LeagueModule,
    JoinRequestModule,
    BetSelectionResultModule,
    PubSubModule,
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

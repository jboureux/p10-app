import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { join } from 'node:path';
import { AuthModule } from './auth/auth.module';
import { BetSelectionResultModule } from './bet-selection-result/bet-selection-result.module';
import { JoinRequestModule } from './join-request/join-request.module';
import { LeagueModule } from './league/league.module';
import { OpenF1Module } from './openf1/openf1.module';
import { UsersModule } from './users/users.module';
import { ErgastModule } from './ergast/ergast.module';

@Module({
  imports: [
    UsersModule,
    JoinRequestModule,
    LeagueModule,
    AuthModule,
    BetSelectionResultModule,
    OpenF1Module,
    ErgastModule,
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
          // subscriptions: {
          //   'graphql-ws': {
          //     onConnect: async (ctx) => {
          //       const raw =
          //         ctx.connectionParams?.Authorization ||
          //         ctx.connectionParams?.authorization;
          //       const token =
          //         typeof raw === 'string' ? raw.replace('Bearer ', '') : '';

          //       console.log('>> WebSocket connected with token:', token);

          //       if (!token) return {};

          //       const decoded = jwtService.verify(token);
          //       console.log('>> Decoded user:', decoded);

          //       // ✅ On injecte directement dans le context WebSocket
          //       return {
          //         user: {
          //           userId: decoded.sub,
          //           email: decoded.email,
          //           role: decoded.role,
          //         },
          //       };
          //     },
          //   },
          // },
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

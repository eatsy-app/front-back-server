import dotenv from 'dotenv';
// Configura dotenv
dotenv.config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { createServer } from 'http';
import { execute, subscribe, GraphQLError } from 'graphql'
import { ApolloServer, ForbiddenError } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './api/lib/typeDefs'
import { graphqlUploadExpress } from 'graphql-upload'
import jwt from 'jsonwebtoken'
import resolvers from './api/lib/resolvers'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import indexRoutes, { cookie } from './api/lib/router'
import { ironSession } from 'iron-session/express'
import { getUserFromToken, parseCookies } from './api/lib/utils'

// config ports
const GRAPHQL_PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 8080;

(async () => {
  const pubsub = new PubSub();

  // Initialization apps
  const app = express();
  app.use(
    cors({
      methods: ['GET', 'POST'],
      origin: [
        process.env.WEB_CLIENT,
        process.env.WEB_ADMIN_STORE,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'https://eatsy-client.vercel.app',
      ],
      credentials: true
    })
  );

  app.use(morgan('dev'))
  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }))
  app.use(
    ironSession({
      ...cookie
    })
  );
  app.post('/image', (req, res) => { res.json('/image api') })
  app.use(express.json({ limit: '50mb' }))
  app.use('/image', (req, res) => {
    res.send('ONLINE PORT IMAGES!')
  })
  // Routes
  app.use('/static', express.static('public'))
  // this folder for this application will be used to store public files
  app.use('/uploads', express.static('uploads'));
  app.use('/api', indexRoutes);
  // Middleware
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    typeDefs, resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: (async ({ req, res }) => {
      try {
        let tokenClient
        let User = {}
        //  Initialize Array empty
        const setCookies = []
        const setHeaders = []
        tokenClient = req.headers.authorization?.split(' ')[1]
        const token = tokenClient
        const restaurant = req.headers.restaurant || {}
        // eslint-disable-next-line
        parseCookies(req)
        res.setHeader('x-token-access', `${token}`)
        res.setHeader('Access-Control-Allow-Origin', '*')
        // @ts-ignore
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH')

        const { error, message } = await getUserFromToken(tokenClient)
        const AUTHO_USER_KEY = process.env.AUTHO_USER_KEY
        const userAgent = req.headers['user-agent'];
        if (token) {
          User = await jwt.verify(token, AUTHO_USER_KEY)
          return { req, userAgent, setCookies: setCookies || [], setHeaders: setHeaders || [], User: User || {}, restaurant: restaurant || {} }
        } else if (tokenClient) {
          User = await jwt.verify(tokenClient, AUTHO_USER_KEY)
          return { req, userAgent, setCookies: setCookies || [], setHeaders: setHeaders || [], User: User || {}, restaurant: restaurant || {} }
        }
        return { req, userAgent, setCookies: [], setHeaders: [], User: User || {}, restaurant: restaurant || {} }
      } catch (error) {
        if (error.message === 'jwt expired') return new ForbiddenError('Token expired')
        if (error.message === 'jwt expired') throw new GraphQLError(error.message, {
          extensions: { code: 'FORBIDDEN', message: { message: 'Token expired' } }
        })
      }
    }),

  });
  await server.start();
  server.applyMiddleware({ app });
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, webSocket, context) => {
        console.log(connectionParams)
        if (connectionParams?.headers?.restaurant || connectionParams?.restaurant) {
          const restaurant = connectionParams?.headers?.restaurant ?? connectionParams.restaurant;
          console.log("connection", restaurant);
          return { pubsub, restaurant };
        }
        throw new Error("Restaurant not provided in connection params");
      },
    },
    {
      server:
        httpServer,
      path:
        server.graphqlPath
    }
  );

  httpServer.listen(GRAPHQL_PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${GRAPHQL_PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${GRAPHQL_PORT}${server.graphqlPath}`
    );
  });
})();

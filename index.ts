import 'dotenv/config';

import assert from 'assert';
import consola from 'consola'
import cors from 'cors';
import delay from 'delay';
import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import {Sequelize} from 'sequelize';

import {GitHubBot} from './lib/github_bot.js';
import {createErrorResponse} from './lib/responses.js';
import {createToothVersionModel} from './models/tooth_version.js';
import {router as routerSearchTeeth} from './routes/search/teeth.js';
import {router as routerTeeth} from './routes/teeth.js';

const ENV_DEFAULTS = {
  GITHUB_BOT_EXPIRE: '600',
  GITHUB_BOT_INTERVAL: '60',
  GITHUB_BOT_TOKEN: '',
  LISTEN_PORT: '80',
  LOG_LEVEL: '3',
  POSTGRES_DATABASE: 'postgres',
  POSTGRES_HOST: 'localhost',
  POSTGRES_PASSWORD: 'postgres',
  POSTGRES_PORT: '5432',
  POSTGRES_USER: 'postgres',
};

async function main() {
  // Load environment variables.
  const githubBotExpire =
      parseInt(process.env.GITHUB_BOT_EXPIRE ?? ENV_DEFAULTS.GITHUB_BOT_EXPIRE);
  const githubBotInterval = parseInt(
      process.env.GITHUB_BOT_INTERVAL ?? ENV_DEFAULTS.GITHUB_BOT_INTERVAL);
  const githubBotToken =
      process.env.GITHUB_BOT_TOKEN ?? ENV_DEFAULTS.GITHUB_BOT_TOKEN;
  const listenPort =
      parseInt(process.env.LISTEN_PORT ?? ENV_DEFAULTS.LISTEN_PORT);
  const logLevel = parseInt(process.env.LOG_LEVEL ?? ENV_DEFAULTS.LOG_LEVEL);
  const postgresDatabase =
      process.env.POSTGRES_DATABASE ?? ENV_DEFAULTS.POSTGRES_DATABASE;
  const postgresHost = process.env.POSTGRES_HOST ?? ENV_DEFAULTS.POSTGRES_HOST;
  const postgresPassword =
      process.env.POSTGRES_PASSWORD ?? ENV_DEFAULTS.POSTGRES_PASSWORD;
  const postgresPort =
      parseInt(process.env.POSTGRES_PORT ?? ENV_DEFAULTS.POSTGRES_PORT);
  const postgresUser = process.env.POSTGRES_USER ?? ENV_DEFAULTS.POSTGRES_USER;

  // Set up logging.
  consola.level = logLevel;

  // Set up database.
  const sequelize =
      new Sequelize(postgresDatabase, postgresUser, postgresPassword, {
        host: postgresHost,
        port: postgresPort,
        dialect: 'postgres',
        logging: false
      });

  await waitForConnection(sequelize);

  const toothVersionModel = createToothVersionModel(sequelize);

  await sequelize.sync();

  // Set up web server.
  const app = express();

  app.use(morgan('tiny'));
  app.use(cors());
  app.use(express.urlencoded({extended: false}));
  app.use((req, _, next) => {
    req.app.locals.toothVersionModel = toothVersionModel;

    next();
  });

  app.use('/search/teeth', routerSearchTeeth);
  app.use('/teeth', routerTeeth);

  app.use(((err, _, res, _next) => {
            assert(err instanceof Error);

            if (createHttpError.isHttpError(err)) {
              res.status(err.statusCode)
                  .send(createErrorResponse(err.statusCode, err.message));

            } else {
              consola.error(`unexpected error: ${err.message}`);

              res.status(500).send(
                  createErrorResponse(500, 'internal server error'));
            }
          }) as express.ErrorRequestHandler);

  app.use((_, res) => {
    res.status(403).send({
      code: 403,
      message: 'forbidden',
    });
  });

  app.listen(listenPort, () => {
    consola.info(`listening on port ${listenPort}`);
  });

  // Set up GitHub bot.
  const gitHubBot = new GitHubBot(
      toothVersionModel, githubBotExpire, githubBotInterval, githubBotToken);
  await gitHubBot.start();
}

async function waitForConnection(sequelize: Sequelize) {
  let isConnected = false;
  while (!isConnected) {
    try {
      await sequelize.authenticate();
      isConnected = true;

    } catch (err) {
      assert(err instanceof Error);
      consola.error(`database is not ready: ${err.message}`);
      consola.log('retrying in 5 seconds...');
      await delay(5000);
    }
  }
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});

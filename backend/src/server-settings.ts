import express from 'express';
import {createServer} from 'http';
import cors from 'cors';
import compression from 'compression';
import logger from 'morgan';
import helmet from 'helmet';
import i18n from 'i18n';
import {config} from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import {errorHandlerMiddleware} from 'error-handler-express-ts';
 import swaggerSpec from './docs/configuration';
import {rateLimiter} from './middlewares/rateLimiter'
import routers from './routers-version';
import {getConnectionTest} from "./config/database";


const app = express();
const httpServer = createServer(app);
config();

class ServerSettings {

  mountServer() {
    this.corsOrigin();
    this.settings();
    this.testDatabaseConnection();
    this.middlewares();
    this.docs();
  }

  private corsOrigin() {
    const corsOptions = {
      origin: ['http://localhost:5173',],
      methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 200
    };

     app.use(cors(corsOptions));
  };

  private settings() {

    app.use(compression());
    // Parse application/json request body
    app.use(express.json());

    // Parse application/x-www-form-urlencoded request body
    app.use(express.urlencoded({extended: false}));

    app.use(logger('dev'));

    // Parse application/x-www-form-urlencoded request body
    app.use(express.urlencoded({limit: '50mb', extended: false, parameterLimit: 500000}));

    i18n.configure({
      locales: ['en', 'es'],
      directory: __dirname + '/locales',
      defaultLocale: 'en',
      cookie: 'lang',
      queryParameter: 'lang'
    });
  };

  private middlewares() {
    app.use(helmet()); // Helmet para seguridad
    app.use(express.json({limit: '50mb'})); // Parse application/json request body
    app.use(i18n.init); // Inicialización de i18n
    app.use(rateLimiter); // Middleware de limitador de velocidad
  }

  private docs() {
    app.use('/swagger-api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  };

  // Verificar la conexión antes de levantar el servidor
  async testDatabaseConnection(): Promise<void> {
    try {
      console.log('Testing database connection...');
      const client = await getConnectionTest();

      if (client) {
        console.log('✔ Database connection successful');
        client.release();  // Liberar la conexión después de la prueba

        // Iniciar el servidor
        this.routes();

      } else {
        console.error('Database connection failed ❌. Server not started.');
        process.exit(1);  // Salir del proceso si falla la conexión
      }
    } catch (error) {
      console.error('Error during server startup:', error);
      process.exit(1);
    }
  };

  private routes() {
    const port = process.env.PORT || 3001;
    app.set('port', port);
    app.use('/', routers);
    console.log(`✔ rutas cargadas...`);
    app.use(errorHandlerMiddleware);
    httpServer.listen(port, () => {
      console.log(`Servidor Corriendo en http://localhost:${port}`);
      console.log(`Documentación swagger corriendo en http://localhost:${port}/swagger-api-docs/`);
    });
  };

}

export default new ServerSettings();



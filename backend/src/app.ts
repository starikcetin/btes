import express, { Response as ExResponse, Request as ExRequest } from 'express';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { RegisterRoutes } from './__gen/routes';
import * as expressPing from 'express-ping';
import { requestLoggerMiddleware } from './restMiddlewares/requestLoggerMiddleware';

export const app = express();

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Generate Swagger UI
app.use(
  '/swagger',
  swaggerUi.serve,
  async (_req: ExRequest, res: ExResponse) => {
    return res.send(
      swaggerUi.generateHTML(await import('./__gen/swagger.json'))
    );
  }
);

app.use(expressPing.ping());

app.use(requestLoggerMiddleware);

RegisterRoutes(app);

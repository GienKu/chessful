import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import './config/db-connection';
import { userRoutes } from './routes/userRoutes';
import { errorHandler } from './middlewares/handleErrors';
import { passportConfig } from './config/passport/passport';

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  const pathToEnv = path.resolve(__dirname, '..', '.env');
  dotenv.config({ path: pathToEnv });
}

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL;

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_BASE_URL,
    credentials: true,
  })
);

passportConfig(app);
app.use(userRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is Fire at ${process.env.BASE_URL}`);
});

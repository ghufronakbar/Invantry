import { configDotenv } from 'dotenv';
configDotenv()
// import './cron/notification.js';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { BASE_URL_API, PORT } from './constant/index.js';
import userAgentResponse from './middleware/userAgentResponse.js';
import routes from './routes/index.js';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

//PARSE APPLICATION JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(userAgentResponse);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ROUTES
app.use('/api', routes);

app.get('/', (req, res) => {
  userAgentResponse(req, res, () => {
    return res.status(200).json({ status: 200, message: "Hello World" });
  }
  );
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server started on port ${PORT} ⚡`);
  console.log(BASE_URL_API);
});
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import posts from './routes/posts';
import demux from './services/demux';
import io from './utils/io';

const app = express();

app.use(cors());

app.use('/posts', posts());

const server = app.listen(process.env.PORT, () =>
  console.info(`Example app listening on port ${process.env.PORT}!`),
);

io.connect(server);

demux.watch();

// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'dotenv/config';

import cors from 'cors';
import debug from 'debug';
import express from 'express';
import { routes } from './routes';
import demux from './services/demux';
import io from './utils/io';

const app = express();

app.use(cors());

app.use('/posts', routes.posts);

const server = app.listen(process.env.PORT, () =>
  debug('info')(
    `Example app listening on http://localhost:${process.env.PORT} !`,
  ),
);

io.connect(server);

demux.watch();
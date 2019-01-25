// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'dotenv/config';

import cors from 'cors';
import debug from 'debug';
import express from 'express';
import expressGraphql from 'express-graphql';
import { buildSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import mongoose from 'mongoose';
import path from 'path';
import { Model as QuestionModel } from './questions';
import { QuestionRepository } from './repositories/QuestionRepository';
import { routes } from './routes';
import { actionReader, actionWatcher as demux } from './services/demux';
import * as io from './utils/io';

const app = express();

const schema = buildSchema(
  importSchema(path.join(__dirname, 'schema.graphql')),
);

// tslint:disable-next-line:comment-format
// app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/blockQuestions');

const questionRepository = new QuestionRepository(QuestionModel);

const root = {
  getQuestion: questionRepository.getQuestion,
};

app.use(
  '/graphql',
  expressGraphql({
    graphiql: true,
    rootValue: root,
    schema,
  }),
);
app.use('/posts', routes.posts);

const server = app.listen(process.env.PORT, () =>
  debug('info')(
    `Example app listening on http://localhost:${process.env.PORT} !`,
  ),
);

io.connect(server);

(async () => {
  await actionReader.initialize();
  demux.watch();
})();

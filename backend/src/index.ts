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
import { QuestionRepository } from './repositories/questionRepository';
import { actionReader, actionWatcher as demux } from './services/demux';

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
  getQuestions: questionRepository.getQuestions,
};

app.use(
  '/graphql',
  expressGraphql({
    graphiql: true,
    rootValue: root,
    schema,
  }),
);

app.listen(process.env.PORT, () =>
  debug('info')(
    `Example app listening on http://localhost:${process.env.PORT} !`,
  ),
);

(async () => {
  await actionReader.initialize();
  demux.watch();
})();

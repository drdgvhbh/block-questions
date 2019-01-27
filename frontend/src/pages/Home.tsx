import React from 'react';
import {
  Button,
  Theme,
  createStyles,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

interface Question {
  title: string;
  content: string;
}

interface GetQuestionsQuery {
  questions: Question[];
}

const GET_QUESTIONS = gql`
  {
    questions {
      title
      content
    }
  }
`;

const styles = (theme: Theme) =>
  createStyles({
    uppercase: {
      textTransform: 'capitalize',
    },
  });

export interface HomeProps extends WithStyles<typeof styles> {}

const Home = (props: HomeProps) => {
  const { classes } = props;

  return (
    <React.Fragment>
      <div>
        <h2>My first Apollo app 🚀</h2>
      </div>
      <Link to="/questions/ask">
        <Button className={classes.uppercase} variant="contained">
          ask question
        </Button>
      </Link>
      <Query query={GET_QUESTIONS}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          const { questions } = data as GetQuestionsQuery;
          return questions.map((question) => <div>${question.title}</div>);
        }}
      </Query>
    </React.Fragment>
  );
};

export default withStyles(styles)(Home);

import React from 'react';
import {
  Button,
  Theme,
  createStyles,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

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
    </React.Fragment>
  );
};

export default withStyles(styles)(Home);

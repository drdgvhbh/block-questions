import React from 'react';
import {
  Paper,
  Typography,
  Theme,
  createStyles,
  withStyles,
  WithStyles,
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    uppercase: {
      textTransform: 'capitalize',
    },
  });

export interface AskQuestionProps extends WithStyles<typeof styles> {}

const AskQuestion = (props: AskQuestionProps) => {
  const { classes } = props;
  return (
    <Paper elevation={1}>
      <form>
        <Typography className={classes.uppercase} variant="h5">
          ask a question
        </Typography>
      </form>
    </Paper>
  );
};

export default withStyles(styles)(AskQuestion);

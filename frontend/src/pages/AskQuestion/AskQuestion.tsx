import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Theme,
  createStyles,
  withStyles,
  WithStyles,
  TextField,
  Button,
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    uppercase: {
      textTransform: 'capitalize',
    },
    block: {
      display: 'block',
    },
  });

export interface AskQuestionProps extends WithStyles<typeof styles> {
  askQuestion(payload: { title: string; content: string }): void;
}

const AskQuestion = (props: AskQuestionProps) => {
  const { classes, askQuestion } = props;

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  return (
    <Paper elevation={1}>
      <form>
        <Typography className={classes.uppercase} variant="h5">
          ask a question
        </Typography>
        <TextField
          label={
            <Typography className={classes.uppercase}>question</Typography>
          }
          value={title}
          variant="outlined"
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label={<Typography className={classes.uppercase}>content</Typography>}
          value={content}
          variant="outlined"
          fullWidth
          onChange={(e) => setContent(e.target.value)}
          multiline
        />
        <Button
          variant="contained"
          onClick={() => {
            askQuestion({ title, content });
          }}
        >
          Ask Question
        </Button>
      </form>
    </Paper>
  );
};

export default withStyles(styles)(AskQuestion);

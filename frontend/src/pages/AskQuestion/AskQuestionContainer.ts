import AskQuestion from './AskQuestion';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Actions } from '@/redux/questions';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      askQuestion: Actions.askQuestion,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AskQuestion);

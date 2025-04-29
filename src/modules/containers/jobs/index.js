/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Jobs from '../../pages/jobs';
import { getAllJobAction, fakeActionJob } from '../../../apis/jobs/job.actions';

const mapStateToProps = (state) => ({
  GetAllJobResponse: state.Jobs.GetAllJobResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getAllJobAction,
    fakeActionJob,
  }, dispatch,
);

const JobsEkasha = connect(mapStateToProps, mapDispatchToProps)(Jobs);

export default JobsEkasha;

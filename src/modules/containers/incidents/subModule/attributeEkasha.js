/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AttributeAnalysis from '../../../pages/incidents/lib/subModule/overview/lib/AttributeAnalysis';
import { changeAttributeAnalysisAction, changeFieldAttributeAnalysisAction, fakeAttributeAnalysisAction } from '../../../../apis/incidents/subModule/AttributeAnalysis/AttributeAnalysis.action';
import { fakeActionDashboard } from '../../../../apis/dashboard/dashboard.actions';
import { fetchFieldsForDetails, fakeActionPanel } from '../../../../apis/panel/panel.action';

const mapStateToProps = (state) => ({
  ChangeAttributeAnalysisResponse: state.AttributeAnalysis.ChangeAttributeAnalysisResponse,
  ChangeFieldAttributeAnalysisResponse:
      state.AttributeAnalysis.ChangeFieldAttributeAnalysisResponse,
  FatchFieldsDetailsResponse: state.Panel.FatchFieldsDetailsResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    changeAttributeAnalysisAction,
    changeFieldAttributeAnalysisAction,
    fakeAttributeAnalysisAction,
    fakeActionDashboard,
    fetchFieldsForDetails,
    fakeActionPanel,
  }, dispatch,
);

const AttributeAnalysisEkasha = connect(mapStateToProps, mapDispatchToProps)(AttributeAnalysis);

export default AttributeAnalysisEkasha;

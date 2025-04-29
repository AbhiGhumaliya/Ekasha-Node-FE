import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Zone from '../../pages/administration/lib/zone';
import {
  DeleteZoneAction, ReadAllZoneAction, ReadOneAction, AddZoneAction,
  UpdateZoneAction, fakeActionZone,
} from '../../../apis/administration/zone/zone.action';

const mapStateToProps = (state) => ({
  DeleteZoneResponse: state.Zone.DeleteZoneResponse,
  GetAllZoneResponse: state.Zone.GetAllZoneResponse,
  GetOneZoneResponse: state.Zone.GetOneZoneResponse,
  AddZoneResponse: state.Zone.AddZoneResponse,
  UpdateZoneResponse: state.Zone.UpdateZoneResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    DeleteZoneAction,
    ReadAllZoneAction,
    ReadOneAction,
    AddZoneAction,
    UpdateZoneAction,
    fakeActionZone,
  }, dispatch,
);

const ZoneEkasha = connect(mapStateToProps, mapDispatchToProps)(Zone);

export default ZoneEkasha;

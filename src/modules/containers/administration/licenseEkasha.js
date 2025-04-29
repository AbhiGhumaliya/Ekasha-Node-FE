import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import License from '../../pages/administration/lib/license';
import { getAllLicenseAction, fakeActionLicense, uploadLicenseAction } from '../../../apis/administration/license/license.action';
import { getUserPermissions } from '../../../apis/authentication/auth.actions';

const mapStateToProps = (state) => ({
  GetLicenseResponse: state.License.GetLicenseResponse,
  UploadLicenseResponse: state.License.UploadLicenseResponse,
}
);

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    fakeActionLicense,
    getAllLicenseAction,
    uploadLicenseAction,
    getUserPermissions,
  }, dispatch,
);

const LicenseEkasha = connect(mapStateToProps, mapDispatchToProps)(License);

export default LicenseEkasha;

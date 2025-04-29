import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import EvidenceEkasha from '../../../../../../containers/incidents/subModule/evidenceEkasha';
import {
  getAllEvidenceAction, createEvidenceAction, deleteEvidenceAction,
  getEvidenceFilessize, filePreview, cyberMRIAssetAction, submitCyberMRIAction,
  fakeEvidenceAction,
} from '../../../../../../../apis/incidents/subModule/Evidence/Evidence.action';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const EvidenceData = [
  {
    discription: 'sdfgsdfhsg',
    type: 'note',
    cyberMri: false,
    token: 'ia397b3cb-6497-45d1-9f7a-638f3746c4be',
    eDataToken: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
    createdDate: '2025-01-31T09:56:49Z',
    ownerName: 'Ekasha Admin',
    fileSize: '',
    name: 'sdfg',
    customerID: 'Customer_1',
    cyberMriReportStatus: false,
    cyberMriTaskId: null,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    incidentId: 1,
  },
  {
    discription: '',
    type: 'ip',
    cyberMri: false,
    token: 'zc43092ac-498b-44e4-905a-a15e981c65c6',
    eDataToken: '',
    createdDate: '2025-01-31T09:55:54Z',
    ownerName: 'Ekasha Admin',
    fileSize: '',
    name: '10.1.2.3',
    customerID: 'Customer_1',
    cyberMriReportStatus: false,
    cyberMriTaskId: null,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    incidentId: 1,
  },
  {
    discription: '',
    type: 'hash',
    cyberMri: false,
    token: 'd7ff7dcd1-0816-499e-831e-2c90fcec869f',
    eDataToken: '',
    createdDate: '2025-02-01T09:05:25Z',
    ownerName: 'Ekasha Admin',
    fileSize: '',
    name: 'd41d8cd98f00b204e9800998ecf8427e',
    customerID: 'Customer_1',
    cyberMriReportStatus: false,
    cyberMriTaskId: null,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    incidentId: 1,
  },
  {
    token: 'z27ea4e45-d2a3-42e2-8d9a-d81dbae0bf50',
    dupCount: 1,
    type: 'URL',
    incidentId: 1,
    eDataToken: '',
    ownerName: 'Ekasha Admin',
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    name: 'https://example.com/path/to/resource',
    cyberMriTaskId: null,
    cyberMri: false,
    cyberMriReportStatus: false,
    jobId: null,
    typeViseData: { ownerToken: 'Ekasha Admin' },
    createdDate: '2025-02-01T14:38:51Z',
    customerID: 'Customer_1',
  },
  {
    discription: '',
    type: 'file',
    cyberMri: false,
    token: 'qfca52706-7fde-4286-870b-966e5765e098',
    eDataToken: 'nb5c15f21-27e8-4367-8137-a1b6054d22e1',
    createdDate: '2025-01-30T04:50:00Z',
    ownerName: 'Ekasha Admin',
    fileSize: 0,
    name: '162524_Ransomware.pdf',
    customerID: 'Customer_1',
    cyberMriReportStatus: false,
    cyberMriTaskId: null,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    incidentId: 1,
  },
  {
    token: 'u96dd632f-6e28-42b6-ad44-b4bdff3a8052',
    dupCount: 1,
    type: 'domain',
    incidentId: 1,
    eDataToken: '',
    ownerName: 'Ekasha Admin',
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    name: 'example.com',
    cyberMriTaskId: null,
    cyberMri: false,
    cyberMriReportStatus: false,
    jobId: null,
    typeViseData: { ownerToken: 'Ekasha Admin' },
    createdDate: '2025-02-03T10:22:02Z',
    customerID: 'Customer_1',
  },
  {
    discription: '',
    type: '',
    cyberMri: false,
    token: 'zc43092ac-498b-44e4-905a-a15e981c65c6',
    eDataToken: '',
    createdDate: '',
    ownerName: '',
    fileSize: '',
    name: '',
    customerID: 'Customer_1',
    cyberMriReportStatus: false,
    cyberMriTaskId: null,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    incidentId: 1,
  },
];
const createEvidenceData = {
  code: 200,
  message: 'Evidence created.',
  status: true,
  data: [
    {
      token: 'zc43092ac-498b-44e4-905a-a15e981c65c6',
      dupCount: 1,
      type: 'IP',
      incidentId: '8',
      eDataToken: '',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      name: '10.1.2.3',
      cyberMriTaskId: null,
      cyberMri: false,
      cyberMriReportStatus: false,
      jobId: null,
      typeViseData: { ownerToken: 'Ekasha Admin' },
      createdDate: '2025-01-31T15:25:53Z',
      customerID: 'Ekasha',
    },
  ],
  module: 'evidence',
  operation: 'create',
  userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
};
const GetCyberMriAssetResponse = {
  code: 200,
  message: 'Data fetched.',
  status: true,
  data: [
    {
      value: '1',
      name: 'Asset 1',
    },
    {
      value: '2',
      name: 'Asset 2',
    },
  ],
};
const deleteEvidenceData = {
  code: 200,
  message: 'Evidence deleted.',
  status: true,
};
const previewFileData = {
  code: 200,
  message: 'File data fatch.',
  status: true,
  data: {
    fileName: '162524_Ransomware.pdf',
    fileSize: 0,
    bytes: '',
    mimType: 'application/pdf',
    status: true,
  },
};
const PreviewFileResponse = {
  code: 200,
  message: 'File previewed.',
  status: true,
  data: {
    file: 'test',
    fileName: 'test.pdf',
    fileSize: 1024,
    bytes: '1024',
    mimType: 'application/pdf',
    status: true,
  },
};
const FileSizeResponse = {
  code: 200,
  message: 'File size fetched.',
  status: true,
  data: [
    {
      fileName: '162524_Ransomware.pdf',
      status: true,
      size: 12280,
    },
  ],
};
const FileSizeResponseFalseFile = {
  code: 200,
  message: 'File size fetched.',
  status: true,
  data: [
    {
      fileName: 'Ransomware.pdf',
      size: 25999,
      status: false,
    },
  ],
};
const selectIncidentNotClosed = {
  status: 'Running',
};
const selectIncidentClosed = {
  status: 'Closed',
};

const actionProps = {
  IncidentId: 1,
  getAllEvidenceAction,
  fakeEvidenceAction,
  createEvidenceAction,
  getEvidenceFilessize,
  deleteEvidenceAction,
  filePreview,
  submitCyberMRIAction,
  cyberMRIAssetAction,
};
const initialData = {
  Evidence: {
    GetAllEvidenceResponse: {
      code: 200,
      message: 'Evidence data get.',
      status: true,
      data: {
        totalElement: EvidenceData,
        totalPages: 1,
        totalCount: 1,
        currentPage: 0,
      },
    },
  },
};
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  EvidenceEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Render component without permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('NA', 'incidents', 'evidence'));
    setUp(actionProps, initial);
  });
  it('should not render component', () => {
    expect(getById('dont_have_pr_evidence')).toBeInTheDocument();
  });
});

describe('Permission Read Only', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'incidents', 'evidence'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Should show no permission message', () => {
    fireEvent.click(getById('evidence_create'));
    fireEvent.click(getById('submit_to_cyberMRI_qfca52706-7fde-4286-870b-966e5765e098'));
    fireEvent.click(getById('preview_evidence_qfca52706-7fde-4286-870b-966e5765e098'));
    fireEvent.click(getById('delete_evidence_qfca52706-7fde-4286-870b-966e5765e098'));
  });
});

describe('Search Functionality', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'evidence'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Search Functionality', () => {
    fireEvent.change(getById('Incident_Evidence_searchBox'), { target: { value: '16' } });
    jest.runAllTimers();
    jest.advanceTimersByTime(300);
    expect(getById('Incident_Evidence_searchBox')).toHaveValue('16');
    fireEvent.click(getById('ekasha_searchInput_clearSearch_Incident_Evidence_searchBox'));
    expect(getById('Incident_Evidence_searchBox')).toHaveValue('');
  });
});

describe('Response Handle', () => {
  describe('True Response', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.CreateEvidenceResponse = createEvidenceData;
      initial.Evidence.GetCyberMriAssetResponse = GetCyberMriAssetResponse;
      initial.Evidence.DeleteEvidenceResponse = deleteEvidenceData;
      initial.Evidence.PreviewFileResponse = previewFileData;
      initial.Evidence.GetFileSizeResponse = FileSizeResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('ekasha_evidence_wrapper')).toBeInTheDocument();
    });
  });
  describe('Page Response Error', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.GetAllEvidenceResponse = {
        code: 200,
        message: 'Evidence data get.',
        status: true,
        data: {
          totalElement: [],
          totalPages: 1,
          totalCount: 0,
          currentPage: 1,
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('ekasha_evidence_wrapper')).toBeInTheDocument();
    });
  });
  describe('False Response', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.GetAllEvidenceResponse = {
        code: 400,
        message: 'Evidence not fetched.',
        status: false,
      };
      initial.Evidence.CreateEvidenceResponse = {
        code: 400,
        message: 'Evidence not created.',
        status: false,
      };
      initial.Evidence.GetCyberMriAssetResponse = {
        code: 400,
        message: 'Asset not fetched.',
        status: false,
      };
      initial.Evidence.DeleteEvidenceResponse = {
        code: 400,
        message: 'Evidence not deleted.',
        status: false,
      };
      initial.Evidence.PreviewFileResponse = {
        code: 400,
        message: 'File not previewed.',
        status: false,
      };
      initial.Evidence.GetFileSizeResponse = {
        code: 400,
        message: 'File size not fetched.',
        status: false,
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('ekasha_evidence_wrapper')).toBeInTheDocument();
    });
  });
});

describe('Add Functionality', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'evidence'));
  });
  describe('Add with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Add Open', () => {
      fireEvent.click(getById('evidence_create'));
    });
  });
  describe('Add with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
      fireEvent.click(getById('evidence_create'));
      jest.runAllTimers();
    });
    beforeAll(() => {
      document.execCommand = jest.fn();
    });
    it('Add with IP', () => {
      fireEvent.change(getById('iEvidence_value'), { target: { value: '10.1' } });
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: '' } });
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: '10.1.2.3' } });
      fireEvent.click(getById('evidence_add'));
    });
    it('Add with HASH', () => {
      fireEvent.click(getById('Radio_Name_create_ldap_status_Hash'));
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: '8f00b204e9800998ecf8427e' } });
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: 'd41d8cd98f00b204e9800998ecf8427e' } });
      fireEvent.click(getById('evidence_add'));
    });
    it('Add with URL', () => {
      fireEvent.click(getById('Radio_Name_create_ldap_status_URL'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: 'dsf' } });
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: 'https://example.com/path/to/resource' } });
      fireEvent.click(getById('evidence_add'));
    });
    it('Add with DOMAIN', () => {
      fireEvent.click(getById('Radio_Name_create_ldap_status_Domain'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: 'fsd' } });
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('iEvidence_value'), { target: { value: 'example.com' } });
      fireEvent.click(getById('evidence_add'));
    });
    it('Add with NOTES', async () => {
      fireEvent.click(getById('Radio_Name_create_ldap_status_Notes'));
      fireEvent.click(getById('evidence_add'));

      fireEvent.change(getById('notes_newName'), { target: { value: 'dsfs' } });
      fireEvent.click(getById('evidence_add'));

      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('notes_newName'), { target: { value: '' } });
      fireEvent.click(getById('evidence_add'));
      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });

      fireEvent.click(getById('notes_bold'));
      fireEvent.click(getById('notes_italic'));
      fireEvent.click(getById('notes_underline'));

      fireEvent.click(getById('notes_justifyLeft'));
      fireEvent.click(getById('notes_justifyCenter'));
      fireEvent.click(getById('notes_justifyRight'));

      fireEvent.click(getById('notes_indent'));
      fireEvent.click(getById('notes_outdent'));
      fireEvent.click(getById('notes_insertUnorderedList'));

      fireEvent.input(getById('noteDesc'), { target: { innerText: 'test' } });
      fireEvent.keyDown(getById('noteDesc'), { keyCode: 68, key: 'd', code: 'KeyD' });
      const pasteEvent = {
        preventDefault: jest.fn(),
        clipboardData: {
          getData: jest.fn().mockReturnValue('Test content'),
        },
      };
      fireEvent.paste(getById('noteDesc'), pasteEvent);
      fireEvent.drop(getById('noteDesc'), { keyCode: 65, clipboardData: { getData: () => 'test' } });

      fireEvent.click(getById('evidence_add'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
    it('NOTES Validations', () => {
      fireEvent.click(getById('Radio_Name_create_ldap_status_Notes'));
      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });
      const pasteEvent = {
        preventDefault: jest.fn(),
        clipboardData: {
          getData: jest.fn().mockReturnValue('Test content'),
        },
      };
      fireEvent.paste(getById('noteDesc'), pasteEvent);
      fireEvent.input(getById('noteDesc'), { target: { innerText: 'test asfasd'.repeat(70) } });
      fireEvent.keyDown(getById('noteDesc'), { keyCode: 68 });
      fireEvent.keyDown(getById('noteDesc'), { keyCode: 65, preventDefault: jest.fn() });
      fireEvent.keyDown(getById('noteDesc'), { keyCode: 13 });
      fireEvent.paste(getById('noteDesc'), pasteEvent);
      fireEvent.input(getById('noteDesc'), { target: { innerHTML: '&nbsp;' } });
      fireEvent.click(getById('evidence_add'));
    });
    it('Add with File', () => {
      fireEvent.click(getById('Radio_Name_create_ldap_status_File'));
      fireEvent.click(getById('evidence_add'));
    });
  });
});

describe('File Upload', () => {
  describe('File Upload success', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.GetFileSizeResponse = FileSizeResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should handle license file upload', async () => {
      fireEvent.click(getById('evidence_create'));
      fireEvent.click(getById('Radio_Name_create_ldap_status_File'));
      const FileUploadDrop = getById('fileuploadModal');
      expect(FileUploadDrop).toBeInTheDocument();
      const mockFile = {
        uid: 'rc-upload-1738648567984-12',
        name: '162524_Ransomware.pdf',
        lastModified: 1738404334777,
        lastModifiedDate: new Date('2025-02-01T10:05:34.777Z'),
        size: 12280,
        type: 'application/pdf',
        percent: 0,
        originFileObj: {
          uid: 'rc-upload-1738648567984-12',
        },
      };
      let fileInput = getById('fileuploadModal');
      fireEvent.change(fileInput, { target: { files: [mockFile] } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const RemoveFile = getById('iFiles_close0');
      expect(document.getElementById('iFiles_close0')).toBeInTheDocument();
      expect(RemoveFile).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(RemoveFile);
      });
      fileInput = getById('fileuploadModal');
      fireEvent.change(fileInput, { target: { files: [mockFile] } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const submitButton = getById('evidence_add');
      await act(async () => {
        fireEvent.click(submitButton);
      });
    });
  });
  describe('File Upload failed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.GetFileSizeResponse = FileSizeResponseFalseFile;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should handle license file upload failed', async () => {
      fireEvent.click(getById('evidence_create'));
      fireEvent.click(getById('Radio_Name_create_ldap_status_File'));

      const FileUploadDrop = getById('fileuploadModal');
      expect(FileUploadDrop).toBeInTheDocument();

      const mockFile = {
        uid: 'rc-upload-1738648567984-4',
        name: 'Ransomware.pdf',
        lastModified: 1738404334777,
        lastModifiedDate: new Date('2025-02-01T10:55:34.777Z'),
        size: 122800,
        type: 'application/pdf',
        percent: 0,
        originFileObj: {
          uid: 'rc-upload-1738648567984-4',
        },
      };
      let fileInput = getById('fileuploadModal');
      fireEvent.change(fileInput, { target: { files: [mockFile] } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const TryAgain = getById('iFiles_try0');
      await act(async () => {
        fireEvent.click(TryAgain);
      });

      fileInput = getById('fileuploadModal');
      fireEvent.change(fileInput, { target: { files: [] } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      const submitButton = getById('evidence_add');
      await act(async () => {
        fireEvent.click(submitButton);
      });
    });
  });
});

describe('Preview Functionality', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'evidence'));
  });
  describe('Preview with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Preview Open', () => {
      fireEvent.click(getById('preview_evidence_ia397b3cb-6497-45d1-9f7a-638f3746c4be'));
    });
  });
  describe('Preview with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    beforeAll(() => {
      global.URL.createObjectURL = jest.fn(() => 'mocked-url');
      document.execCommand = jest.fn();
    });
    it('Preview with IP', () => {
      fireEvent.click(getById('preview_evidence_zc43092ac-498b-44e4-905a-a15e981c65c6'));
    });
    it('Preview with HASH', () => {
      fireEvent.click(getById('preview_evidence_d7ff7dcd1-0816-499e-831e-2c90fcec869f'));
      fireEvent.click(getById('ekasha_model_close_preview_evidence_modal'));
    });
    it('Preview with URL', () => {
      fireEvent.click(getById('preview_evidence_z27ea4e45-d2a3-42e2-8d9a-d81dbae0bf50'));
      fireEvent.click(getById('preview_URL_copy'));
    });
    it('Preview with DOMAIN', () => {
      fireEvent.click(getById('preview_evidence_u96dd632f-6e28-42b6-ad44-b4bdff3a8052'));
    });
    it('Preview with NOTES', () => {
      fireEvent.click(getById('preview_evidence_ia397b3cb-6497-45d1-9f7a-638f3746c4be'));
    });
    it('Preview with File', () => {
      fireEvent.click(getById('preview_evidence_qfca52706-7fde-4286-870b-966e5765e098'));
      fireEvent.click(getById('previewICon_close'));
    });
  });
  describe('Preview with PreviewFileResponse', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.PreviewFileResponse = PreviewFileResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    beforeAll(() => {
      document.execCommand = jest.fn();
    });
    it('Preview with File', async () => {
      fireEvent.click(getById('preview_evidence_qfca52706-7fde-4286-870b-966e5765e098'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      fireEvent.click(getById('Download_File'));
      fireEvent.click(getById('previewICon_close'));
    });
  });
});

describe('CyberMRI Functionality', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'evidence'));
  });
  describe('CyberMRI with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('CyberMRI Open', () => {
      fireEvent.click(getById('submit_to_cyberMRI_qfca52706-7fde-4286-870b-966e5765e098'));
    });
  });
  describe('CyberMRI with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.GetCyberMriAssetResponse = GetCyberMriAssetResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('CyberMRI with HASH', async () => {
      fireEvent.click(getById('submit_to_cyberMRI_d7ff7dcd1-0816-499e-831e-2c90fcec869f'));
      fireEvent.mouseDown(getById('cyberMRI_asset'));
      const options = screen.getAllByText('Asset 1');
      fireEvent.click(options[0]);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      fireEvent.click(getById('cyberMRI_add'));
    });
    it('CyberMRI with URL', () => {
      fireEvent.click(getById('submit_to_cyberMRI_z27ea4e45-d2a3-42e2-8d9a-d81dbae0bf50'));
      fireEvent.click(getById('ekasha_model_close_cyberMRI_modal'));
    });
    it('CyberMRI with File', () => {
      fireEvent.click(getById('submit_to_cyberMRI_qfca52706-7fde-4286-870b-966e5765e098'));
    });
  });
});

describe('Delete Functionality', () => {
  describe('Delete with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Delete Open', () => {
      fireEvent.click(getById('delete_evidence_qfca52706-7fde-4286-870b-966e5765e098'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('delete_evidence_qfca52706-7fde-4286-870b-966e5765e098'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Delete with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Delete Open', () => {
      fireEvent.click(getById('delete_evidence_qfca52706-7fde-4286-870b-966e5765e098'));
    });
  });
});

describe('CyberMRI Functionality', () => {
  describe('CyberMRI with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.GetCyberMriAssetResponse = GetCyberMriAssetResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('CyberMRI Open', () => {
      fireEvent.click(getById('submit_to_cyberMRI_qfca52706-7fde-4286-870b-966e5765e098'));
      fireEvent.click(getById('ekasha_model_close_cyberMRI_modal'));
      fireEvent.click(getById('submit_to_cyberMRI_qfca52706-7fde-4286-870b-966e5765e098'));
      fireEvent.click(getById('cyberMRI_add'));
      // selectOption(getById('cyberMRI_asset'), 'Asset 1');
      // fireEvent.click(getById('cyberMRI_add'));
    });
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'evidenceListTableTbody',
  mockActionName: 'getAllEvidenceAction',
  mockResulteData: EvidenceData,
  responseKey: 'Evidence.GetAllEvidenceResponse',
  dataFormat: '',
});

const socketData = [{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'add',
    status: true,
    data: {
      token: 'zc43092ac-498b-44e4-905a-a15e981c65c6',
      dupCount: 1,
      type: 'IP',
      incidentId: 1,
      eDataToken: '',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      name: '10.1.2.3',
      cyberMriTaskId: null,
      cyberMri: false,
      cyberMriReportStatus: false,
      jobId: null,
      typeViseData: { ownerToken: 'Ekasha Admin' },
      createdDate: '2025-01-31T15:25:53Z',
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'add',
    status: true,
    data: {
      token: 'zc43092ac-498b-44e4-905a-a15e981c65c6',
      dupCount: 1,
      type: 'IP',
      incidentId: 1,
      eDataToken: '',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      name: '10.1.2.3',
      cyberMriTaskId: null,
      cyberMri: false,
      cyberMriReportStatus: false,
      jobId: null,
      typeViseData: { ownerToken: 'Ekasha Admin' },
      createdDate: '2025-01-31T15:25:53Z',
      customerID: 'EKASHA',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'create',
    status: true,
    data: [
      {
        token: 'ia397b3cb-6497-45d1-9f7a-638f3746c4be',
        dupCount: 1,
        type: 'note',
        incidentId: 1,
        eDataToken: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        name: 'sdfg',
        cyberMriTaskId: null,
        cyberMri: false,
        cyberMriReportStatus: false,
        jobId: null,
        typeViseData: {
          ownerName: 'Ekasha Admin',
          evidence: true,
          name: 'sdfg',
          customerID: 'Customer_1',
          description: 'sdfgsdfhsg',
          incidentId: 1,
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          type: 'note',
          token: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
        },
        createdDate: '2025-01-31T15:26:49.160998638+05:30',
        customerID: 'Customer_1',
        discription: 'sdfgsdfhsg',
      },
    ],
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'create',
    status: true,
    data: [
      {
        token: 'ia397b3cb-6497-45d1-9f7a-638f3746c4be',
        dupCount: 1,
        type: 'note',
        incidentId: 1,
        eDataToken: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
        ownerName: 'Ekasha Admin',
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        name: 'sdfg',
        cyberMriTaskId: null,
        cyberMri: false,
        cyberMriReportStatus: false,
        jobId: null,
        typeViseData: {
          ownerName: 'Ekasha Admin',
          evidence: true,
          name: 'sdfg',
          customerID: 'Customer_1',
          description: 'sdfgsdfhsg',
          incidentId: 1,
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          type: 'note',
          token: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
        },
        createdDate: '2025-01-31T15:26:49.160998638+05:30',
        customerID: 'EKASHA',
        discription: 'sdfgsdfhsg',
      },
    ],
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'update',
    status: true,
    data: {
      token: 'ia397b3cb-6497-45d1-9f7a-638f3746c4be',
      dupCount: 1,
      type: 'note',
      incidentId: 1,
      eDataToken: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      name: 'sdfg',
      cyberMriTaskId: null,
      cyberMri: false,
      cyberMriReportStatus: false,
      jobId: null,
      typeViseData: {
        ownerName: 'Ekasha Admin',
        evidence: true,
        name: 'sdfg',
        customerID: 'Customer_1',
        description: 'sdfgsdfhsg',
        incidentId: 1,
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        type: 'note',
        token: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      },
      createdDate: '2025-01-31T15:26:49.160998638+05:30',
      customerID: 'Customer_1',
      discription: 'sdfgsdfhsg',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'update',
    status: true,
    data: {
      token: 'ia397b3cb-6497-45d1-9f7a-638f3746c4be',
      dupCount: 1,
      type: 'note',
      incidentId: 1,
      eDataToken: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      name: 'dsfsdgfsdf',
      cyberMriTaskId: null,
      cyberMri: false,
      cyberMriReportStatus: false,
      jobId: null,
      typeViseData: {
        ownerName: 'Ekasha Admin',
        evidence: true,
        name: 'sdfg',
        customerID: 'Customer_1',
        description: 'sdfgsdfhsg',
        incidentId: 1,
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        type: 'note',
        token: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      },
      createdDate: '2025-01-31T15:26:49.160998638+05:30',
      customerID: 'Customer_1',
      discription: 'sdfgsdfhsg',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'update',
    status: true,
    data: {
      token: 'sdfgdgfh-7fde-4286-870b-966e5765e098',
      dupCount: 1,
      type: 'note',
      incidentId: 1,
      eDataToken: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      name: '',
      cyberMriTaskId: null,
      cyberMri: false,
      cyberMriReportStatus: false,
      jobId: null,
      typeViseData: {
        ownerName: 'Ekasha Admin',
        evidence: true,
        name: 'sdfg',
        customerID: 'Customer_1',
        description: 'sdfgsdfhsg',
        incidentId: 1,
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        type: 'note',
        token: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      },
      createdDate: '2025-01-31T15:26:49.160998638+05:30',
      customerID: 'Customer_1',
      discription: 'sdfgsdfhsg',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'update',
    status: true,
    data: {
      token: 'fgdhdfg-7fde-4286-870b-966e5765e098',
      dupCount: 1,
      type: 'note',
      incidentId: 1,
      eDataToken: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      name: 'sdfg',
      cyberMriTaskId: null,
      cyberMri: false,
      cyberMriReportStatus: false,
      jobId: null,
      typeViseData: {
        ownerName: 'Ekasha Admin',
        evidence: true,
        name: 'sdfg',
        customerID: 'Customer_1',
        description: 'sdfgsdfhsg',
        incidentId: 1,
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        type: 'note',
        token: 'eba411ab6-0c6d-4473-8700-0da46a904b35',
      },
      createdDate: '2025-01-31T15:26:49.160998638+05:30',
      customerID: 'Customer_1',
      discription: 'sdfgsdfhsg',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'delete',
    status: true,
    data: 'qfca52706-7fde-4286-870b-966e5765e098',
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'delete',
    status: true,
    data: 'r1sd6990-34ef-43f7-b485-e719d389060d',
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: 'remove',
    status: true,
    data: {
      incidentId: 1,
      customerID: 'Customer_1',
      token: 'r1sd6990-34ef-43f7-b485-e719d389060d',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'evidence',
    operation: '',
    status: false,
    data: [{
      incidentId: 1,
      customerID: 'Customer_1',
    }],
  }),
}];

describe('Socket Operations', () => {
  let wrapper;
  let mockSubscribe;
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');

    mockSubscribe = {
      unsubscribe: jest.fn(),
    };
    stompClient.connected = true;
    stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

    setPermissions(handlePermission('RW', 'incidents', 'evidence'));
    const initial = JSON.parse(JSON.stringify(initialData));
    setUp(actionProps, initial);
  });
  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
    localStorage.clear();
  });
  it('should subscribe to socket on mount and unsubscribe on unmount', () => {
    expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
  });
  it('should handle evidence socket operations correctly', async () => {
    const subscribeCallback = stompClient.subscribe.mock.calls[0][1];

    act(() => {
      socketData.forEach((element) => {
        subscribeCallback(element);
      });
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

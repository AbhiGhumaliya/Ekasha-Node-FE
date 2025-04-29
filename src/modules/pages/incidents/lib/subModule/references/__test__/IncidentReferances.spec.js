import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import ReferencesEkasha from '../../../../../../containers/incidents/subModule/filesEkasha';
import {
  getFilesData, deleteFilesAction, filesUploadAction, getFilesizeAction, fakeFilesAction,
} from '../../../../../../../apis/incidents/subModule/Files/Files.action';
import {
  MarkAsEvidenceAction, fakeEvidenceAction, filePreview,
} from '../../../../../../../apis/incidents/subModule/Evidence/Evidence.action';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { createScrollTests } from '../../../../../../../helpers/lib/scrollTest';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const ReferencesData = [
  {
    token: 'xdceb8301-1c10-49f7-b8ef-41b7f8239f20',
    name: 'image (1).pdf',
    fileName: 'image (1).pdf',
    path: '/opt/Ekasha/resources//incidentdocs/incident/8/',
    fileType: 'pdf',
    incidentId: 1,
    evidence: false,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    ownerName: 'Ekasha Admin',
    updateTime: null,
    createdDate: '2025-02-05T09:53:24Z',
    customerID: 'Customer_1',
  },
  {
    token: 'if8de8365-df48-4cb1-993f-6c5994cab9f6',
    name: 'image (1).png',
    fileName: 'image (1).png',
    path: '/opt/Ekasha/resources//incidentdocs/evidence/8/',
    fileType: 'png',
    incidentId: 1,
    evidence: true,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    ownerName: 'Ekasha Admin',
    updateTime: null,
    createdDate: '2025-02-03T06:52:03Z',
    customerID: 'Customer_1',
  },
  {
    token: 'lf9e8931f-3dd0-4bd4-b64d-5b21fed45083',
    name: 'image.pdf',
    fileName: 'image.pdf',
    path: '/opt/Ekasha/resources//incidentdocs/evidence/8/',
    fileType: 'pdf',
    incidentId: 1,
    evidence: true,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    ownerName: 'Ekasha Admin',
    updateTime: null,
    createdDate: '2025-02-03T06:52:03Z',
    customerID: 'Customer_1',
  },
  {
    token: 'nb5c15f21-27e8-4367-8137-a1b6054d22e1',
    name: '162524_Ransomware.pdf',
    fileName: '162524_Ransomware.pdf',
    path: '/opt/Ekasha/resources//incidentdocs/evidence/8/',
    fileType: 'pdf',
    incidentId: 1,
    evidence: true,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    ownerName: 'Ekasha Admin',
    updateTime: null,
    createdDate: '2025-01-30T04:50:00Z',
    customerID: 'Customer_1',
  },
  {
    token: 'nb5c15f21-27e8-4367-8137-a1b6054d22e1',
    name: '162524_Ransomware.pdf',
    fileName: '',
    path: '/opt/Ekasha/resources//incidentdocs/evidence/8/',
    fileType: 'pdf',
    type: 'file',
    fileSize: 12280,
    incidentId: 1,
    evidence: true,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    ownerName: '',
    updateTime: null,
    // createdDate: '',
    customerID: 'Customer_1',
  },
];

const AddFileResponseTrue = {
  code: 200,
  message: 'File uploaded.',
  status: true,
  data: [
    {
      token: 'xdceb8301-1c10-49f7-b8ef-41b7f8239f20',
      name: 'image (1).pdf',
      fileName: 'image (1).pdf',
      path: '/opt/Ekasha/resources//incidentdocs/incident/8/',
      fileType: 'pdf',
      incidentId: 1,
      evidence: false,
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      ownerName: 'Ekasha Admin',
      updateTime: null,
      createdDate: '2025-02-05T15:23:24Z',
      customerID: 'Customer_1',
    },
  ],
  module: 'file',
  operation: 'upload',
  userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
};
const AddFileResponseFalse = {
  code: 400,
  message: 'File not uploaded.',
  status: false,
};

const MarkAsEvidenceAddResponseTrue = {
  code: 200,
  message: 'Evidence added.',
  status: true,
  data: {
    token: 'r4c454efc-f0be-414e-bf78-b587c52377f7',
    name: 'image.pdf',
    fileName: 'image.pdf',
    path: '/opt/Ekasha/resources//incidentdocs/evidence/8/',
    fileType: 'pdf',
    incidentId: 1,
    evidence: true,
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    ownerName: 'Ekasha Admin',
    updateTime: null,
    createdDate: '2025-02-05T15:14:05.176828513+05:30',
    customerID: 'Customer_1',
    cyberMri: false,
    cyberMriTaskId: null,
    type: 'file',
    eDataToken: 'lf9e8931f-3dd0-4bd4-b64d-5b21fed45083',
    discription: '',
    fileSize: 12280,
    cyberMriReportStatus: false,
  },
  module: 'evidence',
  operation: 'add',
};
const MarkAsEvidenceAddResponseFalse = {
  code: 500,
  message: 'Evidence not added.',
  status: false,
};

const PreviewFileResponseTrue = {
  code: 200,
  message: 'File data fatch.',
  status: true,
  data: {
    fileName: 'image.pdf',
    fileSize: 12280,
    bytes: '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MCBvYmoKPDwKL1R5cGUgL1BhZ2UKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovWE9iamVjdCA8PAovWDAgNCAwIFIKPj4KPj4KL0NvbnRlbnRzIDUgMCBSCi9QYXJlbnQgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9kdWNlciAoaUxvdmVQREYpCi9Nb2REYXRlIChEOjIwMjUwMjAxMTAwNTI3WikKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1NpemUgOAovUm9vdCAxIDAgUgovSW5mbyA2IDAgUgovSUQgWzwyRkI3NUNGNjQ5Q0ZGOUM5RjQwRTg3MTIzMzI3NDBGMD4gPDY5RjQyNUEzRkM4RkJGMTIxMEZENEI3MTREREY5RDlCPl0KL1R5cGUgL1hSZWYKL1cgWzEgMiAyXQovRmlsdGVyIC9GbGF0ZURlY29kZQovSW5kZXggWzAgOF0KL0xlbmd0aCAzOQo+PgpzdHJlYW0KeJxjYGD4/59RL4eBgVHPGEjobgISDPwglgNIbC6IeMLAAACNIQY5CmVuZHN0cmVhbQplbmRvYmoKc3RhcnR4cmVmCjEyMDA0CiUlRU9GCg==',
    mimType: 'application/pdf',
    status: true,
  },
};

const DeleteFileResponseTrue = {
  code: 200,
  message: 'File deleted successfully.',
  status: true,
};
const DeleteFileResponseFalse = {
  httpStatus: 'NOT_FOUND',
  code: 404,
  message: 'File data not found for xdceb8301-1c10-49f7-b8ef-41b7f8239f20',
  status: false,
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
    {
      fileName: 'Ransomware.pdf',
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
  getFilesData,
  deleteFilesAction,
  filesUploadAction,
  getFilesizeAction,
  fakeFilesAction,
  MarkAsEvidenceAction,
  fakeEvidenceAction,
  filePreview,
};
const initialData = {
  References: {
    GetAllFilesResponse: {
      code: 200,
      message: 'Files data get.',
      status: true,
      data: {
        content: ReferencesData,
        pageable: {
          pageNumber: 0,
          pageSize: 30,
          sort: {
            sorted: true,
            empty: false,
            unsorted: false,
          },
          offset: 0,
          unpaged: false,
          paged: true,
        },
        totalElements: 60,
        totalPages: 2,
        last: true,
        size: 30,
        number: 1,
        sort: {
          sorted: true,
          empty: false,
          unsorted: false,
        },
        numberOfElements: 60,
        first: true,
        empty: false,
      },
    },
  },
  Evidence: {},
};
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  ReferencesEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Render component without permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('NA', 'incidents', 'references'));
    setUp(actionProps, initial);
  });
  it('should not render component', () => {
    expect(getById('PermissionRO_Incident_Files')).toBeInTheDocument();
  });
});

describe('Permission Read Only', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'incidents', 'references'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Should show no permission message', () => {
    fireEvent.click(getById('file_add_modal_button'));
    fireEvent.click(getById('MarkAsEvidence_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
    fireEvent.click(getById('Download_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
    fireEvent.click(getById('Delete_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
    fireEvent.click(getById('Preview_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
    fireEvent.click(getById('Download_File'));
  });
});

describe('Response Handle', () => {
  describe('True Response', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.References.GetAllFilesResponse = {
        code: 200,
        message: 'Files data get.',
        status: true,
        data: {
          content: ReferencesData,
        },
      };
      initial.References.DeleteFileResponse = DeleteFileResponseTrue;
      initial.References.AddFileResponse = AddFileResponseTrue;
      initial.References.SizeFileResponse = FileSizeResponse;
      initial.Evidence.MarkAsEvidenceResponse = MarkAsEvidenceAddResponseTrue;
      initial.Evidence.PreviewFileResponse = PreviewFileResponseTrue;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'references'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('References_Wrapper')).toBeInTheDocument();
    });
  });
  describe('Page Response Error', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.References.GetAllFilesResponse = {
        code: 200,
        message: 'Files data get.',
        status: true,
        data: {
          // content: [],
        },
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'evidence'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('References_Wrapper')).not.toBeInTheDocument();
    });
  });
  describe('False Response', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.References.GetAllFilesResponse = {
        code: 400,
        message: 'Files data get Error',
        status: false,
      };
      initial.References.AddFileResponse = AddFileResponseFalse;
      initial.References.SizeFileResponse = {
        code: 400,
        message: 'File size get Error',
        status: false,
      };
      initial.References.DeleteFileResponse = DeleteFileResponseFalse;
      initial.Evidence.MarkAsEvidenceResponse = MarkAsEvidenceAddResponseFalse;
      initial.Evidence.PreviewFileResponse = {
        code: 400,
        message: 'File data get Error',
        status: false,
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'references'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Render component', () => {
      expect(getById('References_Wrapper')).toBeInTheDocument();
      fireEvent.click(getById('file_add_modal_button'));
    });
  });
});

describe('Search Functionality', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'references'));
    setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
  });
  it('Search Functionality', () => {
    fireEvent.change(getById('Incident_Reference_searchBox'), { target: { value: '16' } });
    jest.runAllTimers();
    jest.advanceTimersByTime(300);
    expect(getById('Incident_Reference_searchBox')).toHaveValue('16');
    fireEvent.click(getById('ekasha_searchInput_clearSearch_Incident_Reference_searchBox'));
    expect(getById('Incident_Reference_searchBox')).toHaveValue('');
  });
});

describe('File Upload', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'references'));
  });
  describe('File Upload with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.References.SizeFileResponse = FileSizeResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Should handle license file upload', async () => {
      fireEvent.click(getById('file_add_modal_button'));
    });
  });
  describe('File Upload success', () => {
    const initial = JSON.parse(JSON.stringify(initialData));
    beforeEach(() => {
      initial.References.SizeFileResponse = FileSizeResponse;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should handle license file upload', async () => {
      fireEvent.click(getById('file_add_modal_button'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
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
        jest.runAllTimers();
        jest.advanceTimersByTime(1000);
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
        jest.advanceTimersByTime(1000);
      });

      const submitButton = getById('incident_files_Add');
      await act(async () => {
        fireEvent.click(submitButton);
      });
    });
  });
  describe('File Upload failed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.References.SizeFileResponse = FileSizeResponseFalseFile;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should handle license file upload failed', async () => {
      fireEvent.click(getById('file_add_modal_button'));
      fireEvent.click(getById('ekasha_model_close_file_add_modal'));
      fireEvent.click(getById('file_add_modal_button'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
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
        jest.advanceTimersByTime(1000);
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

      const submitButton = getById('file_add_modal_button');
      await act(async () => {
        fireEvent.click(submitButton);
      });
    });
  });
});

describe('Preview Functionality', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'references'));
  });
  describe('Preview with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.PreviewFileResponse = {
        code: 200,
        message: 'File data fatch.',
        status: true,
        data: {
          fileName: 'image.pdf',
          fileSize: 12280,
          bytes: '',
          mimType: 'application/pdf',
          status: true,
        },
      };
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    beforeAll(() => {
      global.URL.createObjectURL = jest.fn(() => 'mocked-url');
      document.execCommand = jest.fn();
    });
    it('Preview Clicked', async () => {
      fireEvent.click(getById('Preview_xdceb8301-1c10-49f7-b8ef-41b7f8239f20'));
      expect(getById('previewICon_close')).toBeInTheDocument();
      fireEvent.click(getById('previewICon_close'));
    });
  });
  describe('Preview with PreviewFileResponse and cover onLoad event', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Evidence.PreviewFileResponse = PreviewFileResponseTrue;
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Preview with File', async () => {
      fireEvent.click(getById('Preview_xdceb8301-1c10-49f7-b8ef-41b7f8239f20'));
      const iframe = await waitFor(() => document.querySelector('iframe.previewFrame'));
      fireEvent.load(iframe);
      expect(iframe).toBeInTheDocument();
      fireEvent.click(getById('Download_File'));
      fireEvent.click(getById('previewICon_close'));
    });
  });
});

describe('Mark as Evidence Functionality', () => {
  beforeEach(() => {
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'references'));
  });
  describe('Mark as Evidence with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Preview Clicked', async () => {
      fireEvent.click(getById('MarkAsEvidence_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
    });
  });
  describe('Mark as Evidence with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Preview with File', async () => {
      fireEvent.click(getById('MarkAsEvidence_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
    });
  });
});

describe('Delete Functionality', () => {
  describe('Delete with selectIncidentNotClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'references'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Delete Open', () => {
      fireEvent.click(getById('Delete_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('Delete_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Delete with selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'references'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Delete Open', () => {
      fireEvent.click(getById('Delete_if8de8365-df48-4cb1-993f-6c5994cab9f6'));
    });
  });
});

createScrollTests({
  setUp,
  actionProps,
  initialData,
  scrollContainerId: 'fileListTableTbody',
  mockActionName: 'getAllFilesAction',
  mockResulteData: ReferencesData,
  responseKey: 'References.GetAllFilesResponse',
  dataFormat: 'content',
});

const socketData = [{
  body: JSON.stringify({
    module: 'file',
    operation: 'upload',
    status: true,
    data: [
      {
        token: 'd5f5t8yu-d396-4f76-aa73-8fb0096cf67a',
        name: 'image (1).pdf',
        fileName: 'image (1) (2).pdf',
        path: '/opt/Ekasha/resources//incidentdocs/incident/8/',
        fileType: 'pdf',
        incidentId: 1,
        evidence: false,
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        ownerName: 'Ekasha Admin',
        updateTime: null,
        createdDate: '2025-02-05T16:30:45Z',
        customerID: 'Customer_1',
      },
    ],
  }),
},
{
  body: JSON.stringify({
    module: 'file',
    operation: 'upload',
    status: true,
    data: [
      {
        token: 'sdfght-d396-4f76-aa73-8fb0096cf67a',
        name: 'image (1).pdf',
        fileName: 'image (1) (2).pdf',
        path: '/opt/Ekasha/resources//incidentdocs/incident/8/',
        fileType: 'pdf',
        incidentId: 1,
        evidence: false,
        ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        ownerName: 'Ekasha Admin',
        updateTime: null,
        createdDate: '2025-02-05T16:30:45Z',
        customerID: 'Customer_1',
      },
    ],
  }),
},
{
  body: JSON.stringify({
    module: 'file',
    operation: 'updateFileStatus',
    status: true,
    data: {
      token: 'sdfgsdfgsfd-1c10-49f7-b8ef-41b7f8239f20',
      name: 'image (1).pdf',
      fileName: 'image (1).pdf',
      path: '/opt/Ekasha/resources//incidentdocs/incident/8/',
      fileType: 'pdf',
      incidentId: 1,
      evidence: false,
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      ownerName: 'Ekasha Admin',
      updateTime: null,
      createdDate: '2025-02-05T09:53:24Z',
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'file',
    operation: 'updateFileStatus',
    status: true,
    data: {
      token: 'xdceb8301-1c10-49f7-b8ef-41b7f8239f20',
      name: 'image (1).pdf',
      fileName: 'image (1).pdf',
      path: '/opt/Ekasha/resources//incidentdocs/incident/8/',
      fileType: 'pdf',
      incidentId: 1,
      evidence: true,
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      ownerName: 'Ekasha Admin',
      updateTime: null,
      createdDate: '2025-02-05T09:53:24Z',
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'file',
    operation: 'deleteFile',
    status: true,
    data: {
      token: 'xdceb8301-1c10-49f7-b8ef-41b7f8239f20',
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'file',
    operation: 'deleteFile',
    status: true,
    data: {
      token: 'r1sd6990-34ef-43f7-b485-e719d389060d',
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'file',
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

    setPermissions(handlePermission('RW', 'incidents', 'references'));
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

import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../../../../helpers/lib/RTL';
import NoteEkasha from '../../../../../../containers/incidents/subModule/notesEkasha';
import {
  getAllNotesAction, fakeNoteAction, addNoteAction, updateNoteAction, deleteNoteAction,
} from '../../../../../../../apis/incidents/subModule/notes/note.actions';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { fakeEvidenceAction, MarkAsEvidenceAction } from '../../../../../../../apis/incidents/subModule/Evidence/Evidence.action';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const AddNoteResponse = {
  code: 200,
  message: 'Note added.',
  status: true,
  data: {
    token: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
    incidentId: '6',
    name: 'dfgh',
    ownerName: 'Ekasha Admin',
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    type: 'note',
    evidence: false,
    createdDate: '2025-01-24T09:54:08Z',
    description: 'dfgbnhdxfghdfj',
    customerID: 'a',
  },
  module: 'note',
  operation: 'add',
};
const AddNoteResponseFalse = {
  code: 400,
  message: 'Note not added.',
  status: false,
};
const UpdateNoteResponse = {
  code: 200,
  message: 'Note updated.',
  status: true,
  data: {
    token: 'g560350be-3a8a-4097-ba89-8de0cc6681ea',
    incidentId: '6',
    name: 'dfss',
    ownerName: 'Ekasha Admin',
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    type: 'note',
    evidence: false,
    createdDate: '2025-01-24T05:58:20Z',
    description: 'sdf',
    customerID: 'a',
  },
  module: 'note',
  operation: 'update',
};
const UpdateNoteResponseFalse = {
  code: 400,
  message: 'Note not updated.',
  status: false,
};
const DeleteNoteResponse = {
  code: 200,
  message: 'Note deleted.',
  status: true,
  data: 'g560350be-3a8a-4097-ba89-8de0cc6681ea',
  module: 'note',
  operation: 'delete',
};
const DeleteNoteResponseFalse = {
  code: 400,
  message: 'Note not deleted.',
  status: false,
  data: 'g560350be-3a8a-4097-ba89-8de0cc6681ea',
  module: 'note',
  operation: 'delete',
};
const MarkAsEvidenceAddResponse = {
  code: 200,
  message: 'Evidence added.',
  status: true,
  data: {
    token: 'r918c659f-4fa8-4790-8ace-51004ff353d9',
    dupCount: 1,
    type: 'note',
    incidentId: '6',
    eDataToken: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
    ownerName: 'Ekasha Admin',
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    name: 'dfgh',
    cyberMriTaskId: null,
    cyberMri: false,
    cyberMriReportStatus: false,
    jobId: null,
    typeViseData: {
      createdDate: '2025-01-24T04:24:08Z',
      ownerName: 'Ekasha Admin',
      evidence: false,
      name: 'dfgh',
      customerID: 'a',
      description: 'dfgbnhdxfghdfj',
      incidentId: '6',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      type: 'note',
      token: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
    },
    createdDate: '2025-01-24T09:57:25Z',
    customerID: 'a',
  },
  module: 'evidence',
  operation: 'add',
};
const MarkAsEvidenceAddResponseFalse = {
  code: 400,
  message: 'Evidence not added.',
  status: false,
  data: {
    token: 'r918c659f-4fa8-4790-8ace-51004ff353d9',
    dupCount: 1,
    type: 'note',
    incidentId: '6',
    eDataToken: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
    ownerName: 'Ekasha Admin',
    ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    name: 'dfgh',
    cyberMriTaskId: null,
    cyberMri: false,
    cyberMriReportStatus: false,
    jobId: null,
    typeViseData: {
      createdDate: '2025-01-24T04:24:08Z',
      ownerName: 'Ekasha Admin',
      evidence: false,
      name: 'dfgh',
      customerID: 'a',
      description: 'dfgbnhdxfghdfj',
      incidentId: '6',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      type: 'note',
      token: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
    },
    createdDate: '2025-01-24T09:57:25Z',
    customerID: 'a',
  },
  module: 'evidence',
  operation: 'add',
};
const MarkAsEvidenceRemoveResponse = {
  code: 200,
  message: 'Evidence removed.',
  status: true,
  data: {
    customerID: 'a',
    token: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
  },
  module: 'evidence',
  operation: 'remove',
};
const MarkAsEvidenceRemoveResponseFalse = {
  code: 400,
  message: 'Evidence not removed.',
  status: false,
  data: {
    customerID: 'a',
    token: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
  },
  module: 'evidence',
  operation: 'remove',
};
const selectIncidentNotClosed = {
  closedBy: null,
  mitreTacticId: null,
  assignedToName: 'Ekasha Admin (Administrator)',
  mitreTechniqueId: null,
  incidentType: 'Undefined',
  SLA: '2025-01-11T06:15:43.272Z',
  mitreSubTechnique: null,
  source: 'Ekasha',
  escalateHistory: [],
  createdOn: '2025-01-11T11:30:43.1948116+05:30',
  mitreTechnique: null,
  closedTime: null,
  escalate: '',
  slaStatus: 'Overdue',
  tenantName: null,
  ownerName: 'Ekasha Admin (Administrator)',
  dataClassification: null,
  typeDetails: {
    destinationAddress: '10.1.1.97',
  },
  lastOccuredTime: '2025-01-11T05:59:34.050Z',
  mitreTactic: null,
  details: null,
  lastUpdatedTime: '2025-01-23T04:10:29.730Z',
  alertTime: null,
  incidentName: 'INC',
  ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  tenant: null,
  assignedToToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  severity: 'Critical',
  slatimemin: null,
  riskWeightage: 0,
  impact: null,
  dataType: null,
  threatInformation: {},
  cIATriadImpact: null,
  incidentCloseData: null,
  alertCount: 1,
  mitreSubTechniqueId: null,
  cyberKillChainStage: 'Delivery',
  incidentId: '6',
  status: 'Queue',
};
const selectIncidentClosed = {
  closedBy: null,
  mitreTacticId: null,
  assignedToName: 'Ekasha Admin (Administrator)',
  mitreTechniqueId: null,
  incidentType: 'Undefined',
  SLA: '2025-01-11T06:15:43.272Z',
  mitreSubTechnique: null,
  source: 'Ekasha',
  escalateHistory: [],
  createdOn: '2025-01-11T11:30:43.1948116+05:30',
  mitreTechnique: null,
  closedTime: null,
  escalate: '',
  slaStatus: 'Overdue',
  tenantName: null,
  ownerName: 'Ekasha Admin (Administrator)',
  dataClassification: null,
  typeDetails: {
    destinationAddress: '10.1.1.97',
  },
  lastOccuredTime: '2025-01-11T05:59:34.050Z',
  mitreTactic: null,
  details: null,
  lastUpdatedTime: '2025-01-23T04:10:29.730Z',
  alertTime: null,
  incidentName: 'INC',
  ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  tenant: null,
  assignedToToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  severity: 'Critical',
  slatimemin: null,
  riskWeightage: 0,
  impact: null,
  dataType: null,
  threatInformation: {},
  cIATriadImpact: null,
  incidentCloseData: null,
  alertCount: 1,
  mitreSubTechniqueId: null,
  cyberKillChainStage: 'Delivery',
  incidentId: '6',
  status: 'Closed',
};

const actionProps = {
  incidentId: 1,
  getAllNotesAction,
  fakeNoteAction,
  addNoteAction,
  updateNoteAction,
  deleteNoteAction,
  MarkAsEvidenceAction,
  fakeEvidenceAction,
};

const socketData = [{
  body: JSON.stringify({
    module: 'note',
    operation: 'add',
    status: true,
    data: {
      incidentId: '1',
      customerID: 'Customer_1',
      name: 'New Note',
      description: 'This is a new note',
      token: 'note_11',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      type: 'note',
      evidence: false,
      createdDate: '2025-01-24T04:24:08Z',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: 'update',
    status: true,
    data: {
      token: 'wb776ca6b-2a68-4c40-ade4-cb9c3b3bc1a7',
      name: 'Updated Note',
      description: 'This is an updated note',
      incidentId: '1',
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: 'update',
    status: true,
    data: {
      token: 'note_10',
      name: 'Updated Note',
      description: 'This is an updated note',
      incidentId: '1',
      customerID: 'Customer_1',
      ownerName: 'Ekasha Admin',
      ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
      type: 'note',
      evidence: false,
      createdDate: '2025-01-24T04:24:08Z',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: 'update',
    status: false,
    data: {
      token: 'note_10',
      name: 'Updated Note',
      description: 'This is an updated note',
      incidentId: '1',
      customerID: 'Customer_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: 'delete',
    status: true,
    data: 'wb776ca6b-2a68-4c40-ade4-cb9c3b3bc1a7',
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: 'delete',
    status: true,
    data: {
      token: 'note_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: 'updateStatus',
    status: true,
    data: {
      token: 'note_1',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: 'updateStatus',
    status: true,
    data: {
      token: 'note_120',
    },
  }),
},
{
  body: JSON.stringify({
    module: 'note',
    operation: '',
    status: true,
    data: {
      token: 'note_1',
    },
  }),
}];

const initialData = {
  Note: {
    GetallNotesResponse: {
      status: true,
      data: [
        {
          token: 'wb776ca6b-2a68-4c40-ade4-cb9c3b3bc1a7',
          incidentId: '6',
          name: 'asfasdf',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          type: 'note',
          evidence: false,
          createdDate: '2025-01-24T08:53:24Z',
          description: 'wretasdf',
          customerID: 'a',
        },
        {
          token: 'wf42809db-8ba0-4e32-882d-f845557b7c80',
          incidentId: '6',
          name: 'dfgh',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          type: 'note',
          evidence: false,
          createdDate: '2025-01-24T04:24:08Z',
          description: 'dfgbnhdxfghdfj',
          customerID: 'a',
        },
        {
          name: 'Existing Note',
          description: 'This is an existing note',
          token: 'note_0',
          incidentId: '1',
          customerID: 'Customer_1',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          type: 'note',
          evidence: false,
          createdDate: '2025-01-24T04:24:08Z',
        },
        {
          name: 'Existing sdf',
          description: 'This is an existing note',
          token: 'note_1',
          incidentId: '2',
          customerID: 'Customer_2',
          ownerName: 'Ekasha Admin',
          ownerToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
          type: 'note',
          evidence: false,
          createdDate: '2025-01-24T04:24:08Z',
        },
      ],
    },
  },
  Evidence: {
    MarkAsEvidenceResponse: {
      status: true,
      data: [],
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  NoteEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('NoteEkasha Container - No Permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    setPermissions(handlePermission('NA', 'incidents', 'notes'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });
  it('Should show no permission message', () => {
    expect(getById('dont_have_pr_notes')).not.toBeInTheDocument();
  });
});

describe('NoteEkasha Container - Permission Read Only', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'incidents', 'notes'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });
  it('Should show no permission message', () => {
    const addNoteButton = getById('notes_addBtn');
    fireEvent.click(addNoteButton);
  });
  it('Should show no permission message On Evidence', () => {
    const Evidence = getById('notes_evidence_0');
    fireEvent.click(Evidence);
  });
  it('Should show no permission message On Edit', () => {
    const EditBtn = getById('notes_editIcn');
    fireEvent.click(EditBtn);
  });
  it('Should show no permission message On Delete', () => {
    const deleteNoteButton = getById('notes_deleteIcn');
    fireEvent.click(deleteNoteButton);
  });
});

describe('Component Render without Data and click on Add Note Button', () => {
  describe('status === closed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.GetallNotesResponse.data = [];
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Click on Add Note Button', () => {
      const addNoteButton = getById('new_note_create_when_right_part_empty');
      fireEvent.click(addNoteButton);
    });
  });
  describe('status !== closed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.GetallNotesResponse.data = [];
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Should show no data message', () => {
      expect(screen.getByText('You have not added a note yet')).toBeInTheDocument();
    });
    it('Click on Add Note Button', () => {
      const addNoteButton = getById('new_note_create_when_right_part_empty');
      fireEvent.click(addNoteButton);
    });
  });
});

describe('Add Functionality', () => {
  describe('Add Functionality status true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.AddNotesResponse = AddNoteResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    beforeAll(() => {
      document.execCommand = jest.fn();
    });
    it('Click on Add Note Button click', async () => {
      const addNoteButton = getById('notes_addBtn');
      fireEvent.click(addNoteButton);
      jest.runAllTimers();

      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });

      fireEvent.click(getById('notes_saveIcn'));
    });
    it('Click on Add Note Button', async () => {
      const addNoteButton = getById('notes_addBtn');
      fireEvent.click(addNoteButton);
      jest.runAllTimers();

      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });
      fireEvent.click(getById('notes_saveIcn'));
      fireEvent.change(getById('notes_newName'), { target: { value: '' } });
      fireEvent.click(getById('notes_saveIcn'));
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
      fireEvent.paste(getById('noteDesc'), { clipboardData: { getData: () => 'test' } });
      fireEvent.drop(getById('noteDesc'), { keyCode: 65, clipboardData: { getData: () => 'test' } });

      fireEvent.click(getById('notes_saveIcn'));
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      fireEvent.click(getById('updateBtn'));
    });
  });
  describe('Add Functionality Close', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.AddNotesResponse = AddNoteResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    beforeAll(() => {
      document.execCommand = jest.fn();
    });
    it('Click on Add Note Button', async () => {
      fireEvent.click(getById('notes_addBtn'));
      jest.runAllTimers();
      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });
      fireEvent.input(getById('noteDesc'), { target: { innerText: 'test' } });

      fireEvent.click(getById('notes_pluseIcn'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('notes_pluseIcn'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Add Functionality status false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.AddNotesResponse = AddNoteResponseFalse;
      initial.Note.GetallNotesResponse.data = [];
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    beforeAll(() => {
      document.execCommand = jest.fn();
    });
    it('Click on Add Note Button', () => {
      fireEvent.click(getById('notes_addBtn'));
      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });
      const pasteEventNew = {
        preventDefault: jest.fn(),
        clipboardData: {
          getData: jest.fn().mockReturnValue(() => ['&nbsp;'].concat('test')),
          // getData: jest.fn().mockReturnValue('&nbsp;'),
          // getData: jest.fn().mockReturnValue('&nbsp; Test content'),
          // getData: jest.fn().mockReturnValue(' Test content'),
        },
      };
      fireEvent.paste(getById('noteDesc'), pasteEventNew);
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
      fireEvent.click(getById('notes_pluseIcn'));
    });
  });
});

describe('Edit Functionality', () => {
  describe('Edit Functionality status true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.UpdateNotesResponse = UpdateNoteResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Click on Edit Note Button', () => {
      const EditBtn = getById('notes_editIcn');
      fireEvent.click(EditBtn);
      fireEvent.change(getById('notes_newName'), { target: { value: 'test' } });
      fireEvent.input(getById('noteDesc'), { target: { innerText: 'test' } });
      fireEvent.click(getById('notes_saveIcn'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('notes_saveIcn'));
      fireEvent.click(getById('updateBtn'));
      fireEvent.click(getById('ConfirmModal_close_save_note_incident'));
    });
  });
  describe('Edit Functionality status false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.UpdateNotesResponse = UpdateNoteResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Click on Edit Note Button', () => {
      const editNoteButton = getById('notes_editIcn');
      fireEvent.click(editNoteButton);
      fireEvent.input(getById('noteDesc'), { target: { innerText: 'test' } });
      fireEvent.click(getById('notes_saveIcn'));
      fireEvent.click(getById('updateBtn'));
      fireEvent.click(getById('ConfirmModal_close_save_note_incident'));
    });
  });
  describe('Edit Functionality closeNewNote', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.UpdateNotesResponse = UpdateNoteResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Click on Edit Note Button', () => {
      fireEvent.click(getById('note_card_1'));
      fireEvent.click(getById('note_card_0'));
      fireEvent.click(getById('notes_editIcn'));
      fireEvent.click(getById('notes_pluseIcn'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Edit Functionality selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.UpdateNotesResponse = UpdateNoteResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Click on Edit Note Button', () => {
      const editNoteButton = getById('notes_editIcn');
      fireEvent.click(editNoteButton);
    });
  });
});

describe('Delete Functionality', () => {
  describe('Delete Functionality status false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.DeleteNotesResponse = DeleteNoteResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Click on Delete Note Button', () => {
      const deleteNoteButton = getById('notes_deleteIcn');
      fireEvent.click(deleteNoteButton);
    });
  });
  describe('Delete Functionality status true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.DeleteNotesResponse = DeleteNoteResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentNotClosed }, initial);
    });
    it('Click on Delete Note Button', () => {
      fireEvent.click(getById('notes_deleteIcn'));
      fireEvent.click(getById('closeBtn'));
      fireEvent.click(getById('notes_deleteIcn'));
      const confirmButton = getById('deleteBtn');
      fireEvent.click(confirmButton);
    });
    it('Click on Delete Note Button', () => {
      fireEvent.click(getById('note_card_1'));
      fireEvent.click(getById('note_card_2'));
      fireEvent.click(getById('notes_deleteIcn'));
      const confirmButton = getById('deleteBtn');
      fireEvent.click(confirmButton);
    });
  });
});

describe('Single Note Functionality', () => {
  describe('Single Note Functionality status true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp(actionProps, initial);
    });
    it('Click on Single Note', () => {
      fireEvent.click(getById('note_card_0'));
    });
    it('Click on Add and Delete Note', () => {
      fireEvent.click(getById('notes_addBtn'));
      fireEvent.click(getById('note_card_1'));
      fireEvent.click(getById('note_card_0'));
      fireEvent.click(getById('notes_pluseIcn'));
      fireEvent.click(getById('deleteBtn'));
    });
  });
  describe('Evidence Functionality selectIncidentClosed', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.MarkAsEvidenceResponse = MarkAsEvidenceAddResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp({ ...actionProps, selectIncident: selectIncidentClosed }, initial);
    });
    it('Click on Evidence Note', () => {
      const Evidence = getById('notes_evidence_0');
      fireEvent.click(Evidence);
    });
  });
  describe('Evidence Functionality Add status true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.MarkAsEvidenceResponse = MarkAsEvidenceAddResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp(actionProps, initial);
    });
    it('Click on Evidence Note', () => {
      const Evidence = getById('notes_evidence_0');
      fireEvent.click(Evidence);
    });
  });
  describe('Evidence Functionality Add status false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.MarkAsEvidenceResponse = MarkAsEvidenceAddResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp(actionProps, initial);
    });
    it('Click on Evidence Note', () => {
      const Evidence = getById('notes_evidence_0');
      fireEvent.click(Evidence);
    });
  });
  describe('Evidence Functionality Remove status false', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.MarkAsEvidenceResponse = MarkAsEvidenceRemoveResponseFalse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp(actionProps, initial);
    });
    it('Click on Evidence Note', () => {
      const Evidence = getById('notes_evidence_0');
      fireEvent.click(Evidence);
    });
  });
  describe('Evidence Functionality Remove status true', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.Note.MarkAsEvidenceResponse = MarkAsEvidenceRemoveResponse;
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'incidents', 'notes'));
      setUp(actionProps, initial);
    });
    it('Click on Evidence Note', () => {
      const Evidence = getById('notes_evidence_0');
      fireEvent.click(Evidence);
    });
  });
});

describe('Search Functionality', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RW', 'incidents', 'notes'));
    setUp(actionProps, initial);
  });
  it('Search Input', async () => {
    fireEvent.change(getById('notes_searchText'), { target: { value: 'test' } });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.click(getById('ekasha_searchInput_clearSearch_notes_searchText'));
  });
});

describe('NoteEkasha Container - Permission Changes', () => {
  beforeEach(() => {
    localStorage.setItem('U_TOKENS', JSON.stringify({
      userToken: 'm33b2e747',
    }));
    localStorage.setItem('customerID', 'Customer_1');
    const initial = JSON.parse(JSON.stringify(initialData));
    initial.Note.GetallNotesResponse.status = false;
    setPermissions(handlePermission('RW', 'incidents', 'notes'));
    setUp(actionProps, initial, { customerID: 'Customer_1' });
  });
  it('Should handle permission changes', async () => {
    await act(async () => {
      window.dispatchEvent(new Event('ekashaPermissionChanged'));
      jest.advanceTimersByTime(1000);
    });
  });
});

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

    setPermissions(handlePermission('RW', 'incidents', 'notes'));
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
  it('should handle note socket operations correctly', async () => {
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

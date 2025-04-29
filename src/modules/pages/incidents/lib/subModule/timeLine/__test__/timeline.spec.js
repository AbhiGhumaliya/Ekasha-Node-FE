import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent } from '../../../../../../../helpers/lib/RTL';
import TimelineEkasha from '../../../../../../containers/incidents/subModule/timeLineEkasha';
import { stompClient } from '../../../../../../../helpers/lib/SocketHandlers';
import { getTimeLineAction, fakeIncidentAction } from '../../../../../../../apis/incidents/actions';

jest.useFakeTimers();

const timelineProps = {
  IncidentId: 1,
  getTimeLineAction,
  fakeIncidentAction,
};

const mockTimelineData = [
  {
    owner: 'Ekasha Admin',
    msg: 'Alert added in incident by Ekasha Admin',
    incidentMethod: 'addRawLog',
    fieldName: '',
    content: 'Alert added in incident by Ekasha Admin',
    start: '2024-10-18T06:48:49.226Z',
    id: 'v835b3edb-c649-40e8-b2e2-f94804da1c65',
    incidentId: '8',
    activityType: 'incident',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'playbook added by admin',
    incidentMethod: 'addRawLog',
    fieldName: '',
    start: '2024-10-18T06:48:49.226Z',
    id: 'v835b3edb-c889-40e8-b2e2-f94804da1c65',
    incidentId: '8',
    activityType: 'playbook',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Incident created by Ekasha Admin',
    incidentMethod: 'create',
    fieldName: '',
    start: '2024-10-18T06:48:49.356Z',
    id: 'p10b950f7-47d3-461c-af27-430a5c064872',
    incidentId: '8',
    content: 'Incident created by Ekasha Admin',
    activityType: 'incident',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Alert added in incident by Ekasha Admin',
    incidentMethod: 'addRawLog',
    fieldName: '',
    start: '2024-10-18T06:49:22.112Z',
    id: 'f88797a40-633f-46fa-a455-c7444e556279',
    incidentId: '8',
    activityType: 'incident',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Asset assigned by Ekasha Admin',
    incidentMethod: 'assignToIncident',
    fieldName: '',
    start: '2024-10-18T06:52:56.826Z',
    id: 'raba379cc-5ee0-4e64-b233-633c28a3be32',
    incidentId: '8',
    activityType: 'incident',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Alert added in incident by Umesh Karkar',
    incidentMethod: 'addRawLog',
    fieldName: '',
    start: '2024-11-06T10:03:27.511Z',
    id: 'p3979f8f0-8e56-4954-82b5-dc32c1560195',
    incidentId: '8',
    activityType: 'incident',
    userId: 'e13a06d0a-b714-4968-a0b2-8904b659b36b',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident created by Umesh Karkar',
    incidentMethod: 'create',
    fieldName: '',
    start: '2024-11-06T10:03:27.622Z',
    id: 'ped925457-a8b9-4eec-abd3-3ea5633f2fed',
    incidentId: '8',
    activityType: 'incident',
    userId: 'e13a06d0a-b714-4968-a0b2-8904b659b36b',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Incident Type updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'incidentType',
    start: '2024-11-06T10:03:46.146Z',
    id: 'd903ffc17-b54a-4149-8c08-13c18c3c9bab',
    incidentId: '8',
    activityType: 'incident',
    userId: 'e13a06d0a-b714-4968-a0b2-8904b659b36b',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Cyber Kill Chain Stage updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'cyberKillChainStage',
    start: '2024-11-06T10:03:46.281Z',
    id: 'e0524dac3-210c-4ebc-b69d-c5f821fca9dd',
    incidentId: '8',
    activityType: 'incident',
    userId: 'e13a06d0a-b714-4968-a0b2-8904b659b36b',
    status: true,
  },
  {
    owner: 'Yogita Sadaniya',
    msg: 'Incident Source Address added by Yogita Sadaniya',
    incidentMethod: 'updateDetails',
    fieldName: 'sourceAddress',
    start: '2024-11-06T10:36:04.005Z',
    id: 'z72f95bbc-d03f-4ec0-8c9f-1a7010245b08',
    incidentId: '8',
    activityType: 'incident',
    userId: 'f1fa06f14-540b-4ba2-aee0-b1b1e7095c69',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Workbook assigned by Umesh Karkar',
    incidentMethod: 'assignIncident',
    fieldName: '',
    start: '2025-01-02T10:57:05.915Z',
    id: 'd40573952-6997-4457-a573-b251d03d435b',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Asset assigned by Umesh Karkar',
    incidentMethod: 'assignToIncident',
    fieldName: '',
    start: '2025-01-02T10:57:18.181Z',
    id: 'h2c72410b-2e1b-4ace-aa2a-9d613cbe1541',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Report generated by Umesh Karkar',
    incidentMethod: 'Report generation',
    fieldName: '',
    start: '2025-01-02T10:57:29.017Z',
    id: 'e5309b257-f105-424c-b3b6-4740d367c056',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Action executed by Umesh Karkar',
    incidentMethod: 'URL Reputation',
    start: '2025-01-07T09:33:24.253Z',
    id: 'df31191aa-5ac3-4484-ae51-782f2d44ec7d',
    incidentId: '8',
    activityType: 'action',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Action executed by Umesh Karkar',
    incidentMethod: 'URL Reputation',
    start: '2025-01-07T09:33:41.399Z',
    id: 'kdbc0d044-09ec-405d-8a28-e9a48b17e5fa',
    incidentId: '8',
    activityType: 'action',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Action Failed by Umesh Karkar',
    incidentMethod: 'IP Reputation',
    start: '2025-01-07T09:34:03.558Z',
    id: 'i8f9b9eb7-e06e-4f92-bcfb-c9cb61595c3d',
    incidentId: '8',
    activityType: 'action',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Action executed by Umesh Karkar',
    incidentMethod: 'URL Reputation',
    start: '2025-01-07T09:34:36.295Z',
    id: 'p5855f599-ab62-4274-8438-10e3c727c6a8',
    incidentId: '8',
    activityType: 'action',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Asset assigned by Umesh Karkar',
    incidentMethod: 'assignToIncident',
    fieldName: '',
    start: '2025-01-07T09:35:32.362Z',
    id: 'b4e887d56-7c27-49e9-aa0e-c2c1323e1516',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Alert added in incident by Umesh Karkar',
    incidentMethod: 'addRawLog',
    fieldName: '',
    start: '2025-02-06T10:26:04.939Z',
    id: 'j1088e13f-3a7f-4568-ad89-907f47618f02',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident created by Umesh Karkar',
    incidentMethod: 'create',
    fieldName: '',
    start: '2025-02-06T10:26:05.095Z',
    id: 'g05bc50bc-eb6a-43b7-bf09-ac7c197bbd6a',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident as a owner assigned to Ekasha Admin',
    incidentMethod: 'updateDetails',
    fieldName: 'ownerToken',
    start: '2025-02-06T10:27:20.426Z',
    id: 'zc4317925-f01a-4f1d-8cba-bd6e8eaf26d0',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Destination Address added by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'destinationAddress',
    start: '2025-02-08T07:00:59.871Z',
    id: 'j296146ba-e388-4814-86ba-da5e8e710608',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Incident Type updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'incidentType',
    start: '2025-02-08T07:01:52.882Z',
    id: 'yc0650064-5b98-4c32-90ee-681260feec22',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Cyber Kill Chain Stage updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'cyberKillChainStage',
    start: '2025-02-08T07:01:53.016Z',
    id: 'y3f33a26e-b4b9-4be0-94c3-a6456d6f1f9d',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Data Type updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'dataType',
    start: '2025-02-08T07:01:53.152Z',
    id: 'ydb07f9ef-e0bb-4c0f-ad70-14b4742ef5eb',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Impact updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'impact',
    start: '2025-02-08T07:01:53.286Z',
    id: 'w81ac0ba4-6eaf-465d-9bdd-7cfee8dcbbd2',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident Data Classification updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'dataClassification',
    start: '2025-02-08T07:01:53.428Z',
    id: 'ncaae4dec-9ba7-4bdf-a204-7a54f8b0d709',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident CIA Triad Impact updated by Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'cIATriadImpact',
    start: '2025-02-08T07:01:53.562Z',
    id: 'ie783c06d-f420-43d1-8d2b-0b0adff43c88',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Incident assigned to Ekasha Admin',
    incidentMethod: 'updateDetails',
    fieldName: 'assignedToToken',
    start: '2025-02-08T10:02:40.155Z',
    id: 'n3d341244-4742-49b4-b053-0cca22d17312',
    incidentId: '8',
    activityType: 'incident',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Action executed by Ekasha Admin',
    incidentMethod: 'URL Reputation',
    start: '2025-02-10T06:44:39.510Z',
    id: 'y877c467f-5768-4693-8bbb-dbea2b577722',
    incidentId: '8',
    activityType: 'action',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Umesh Karkar',
    msg: 'Incident as a owner assigned to Umesh Karkar',
    incidentMethod: 'updateDetails',
    fieldName: 'ownerToken',
    start: '2025-02-11T10:59:06.717Z',
    id: 'u9949b1d7-956e-4225-ad86-8398363cfc03',
    incidentId: '8',
    activityType: 'incident',
    userId: 'xcfbef63b-0fef-417e-b119-d4cd45dce440',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Action Failed by Ekasha Admin',
    incidentMethod: 'IP Reputation',
    start: '2025-02-14T06:30:35.627Z',
    id: 'x94b34c39-33be-4d83-a765-e151d9da9061',
    incidentId: '8',
    activityType: 'action',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Action requested by Ekasha Admin',
    incidentMethod: 'IP Reputation',
    start: '2025-02-14T06:30:36.259Z',
    id: 'y7a82ba56-e570-4ff5-a264-8eba46ed63a4',
    incidentId: '8',
    activityType: 'action',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
  {
    owner: 'Ekasha Admin',
    msg: 'Incident title changed by Ekasha Admin',
    incidentMethod: 'setIncidentTitle',
    fieldName: '',
    start: '2025-02-15T06:32:23.606Z',
    id: 'ye15fe93d-e6f4-4a80-9767-ed843e4da28d',
    incidentId: '8',
    activityType: 'incident',
    userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
    status: true,
  },
];

const initialData = {
  Incident: {
    GetTimeLineResponse: {
      status: true,
      data: mockTimelineData,
    },
  },
  Panel: {
    CloseDrawerPanel: null,
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  TimelineEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  {
    ...contextValue, tableView: false, setTableView: jest.fn(), setSelectStatus: jest.fn(),
  },
);

describe('Timeline Component', () => {
  // Part 1: Basic Rendering Tests
  describe('Timeline Component - Is cluster data randoring', () => {
    let mockRoot;
    let mockRoot1;
    let mockRoot2;
    beforeEach(() => {
      jest.clearAllMocks();
      mockRoot = document.createElement('div');
      mockRoot.className = 'itemDivAppend';
      mockRoot.appendChild(document.createTextNode('Activities (2)'));
      document.body.appendChild(mockRoot);
      mockRoot1 = document.createElement('div');
      mockRoot1.className = 'itemDivAppend2';
      mockRoot1.appendChild(document.createTextNode('Activities (2)'));
      document.body.appendChild(mockRoot1);
      mockRoot2 = document.createElement('div');
      mockRoot2.className = 'itemDivAppend3';
      mockRoot2.appendChild(document.createTextNode('Activities (2)'));
      document.body.appendChild(mockRoot2);
      setPermissions(handlePermission('RW', 'incidents', 'activity'));
      setUp(timelineProps, initialData);
    });
    afterEach(() => {
      // Cleanup after each test
      document.body.removeChild(mockRoot);
      document.body.removeChild(mockRoot1);
      document.body.removeChild(mockRoot2);
    });

    it('Should render data component when isCluster is true', () => {
      const stateWithisClustor = {
        ...initialData,
        Incident: {
          ...initialData.Incident,
          GetTimeLineResponse: {
            status: true,
            data: [{
              owner: 'Ekasha Admin',
              start: '2025-02-14T06:30:35.627Z',
              id: 'x94b34c39-33be-4d83-a765-e151d9da9061',
              incidentId: '8',
              activityType: 'action',
              userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
              content: '<div>Action Failed by Ekasha Admin</div>',
              type: 'box',
              items: [{
                owner: 'Ekasha Admin',
                start: '2025-02-14T06:30:35.627Z',
                id: 'x94b34c39-33be-4d83-a765-e151d9da9061',
                incidentId: '8',
                activityType: 'action',
                userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                status: true,
                content: '<div>Action Failed by Ekasha Admin</div>',
                type: 'box',
                className: 'action',
                group: 1,
                msg: 'Action Failed by Ekasha Admin',
                isCluster: true,
              }, {
                owner: 'Ekasha Admin',
                start: '2025-02-14T06:30:35.627Z',
                id: 'x94b34c39-33be-4d83-a765-e151d9da9061',
                incidentId: '8',
                activityType: 'action',
                userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                status: true,
                content: '<div>Action Failed by Ekasha Admin</div>',
                type: 'box',
                className: 'playbook',
                group: 1,
                msg: 'Action Failed by Ekasha Admin',
                isCluster: true,
              }, {
                owner: 'Ekasha Admin',
                start: '2025-02-14T06:30:35.627Z',
                id: 'x94b34c39-33be-4d83-a765-e151d9da9061',
                incidentId: '8',
                activityType: 'action',
                userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
                status: true,
                content: '<div>Action Failed by Ekasha Admin</div>',
                type: 'box',
                className: 'incident',
                group: 1,
                msg: 'Action Failed by Ekasha Admin',
                isCluster: true,
              }],
              className: 'action',
              group: 1,
              msg: 'Action Failed by Ekasha Admin',
              isCluster: true,
            }],
          },
        },
      };
      setUp(timelineProps, stateWithisClustor);
      jest.advanceTimersByTime(10);
    });
  });

  // Part 1: Basic Rendering Tests
  describe('Timeline Component - Basic Rendering', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RO', 'incidents', 'activity'));
      setUp(timelineProps, initialData);
    });

    it('Should render timeline wrapper', () => {
      const wrapper = getById('timeLine_wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('Should render NoData component when no permission', () => {
      setPermissions(handlePermission('NA', 'incidents', 'activity'));
      setUp(timelineProps, initialData);
      const noDataMessage = screen.getByText("You don't have permission to access this page");
      expect(noDataMessage).toBeInTheDocument();
    });

    it('Should render no data component when timeline data is empty', () => {
      const stateWithLoading = {
        ...initialData,
        Incident: {
          ...initialData.Incident,
          GetTimeLineResponse: {
            status: true,
            data: [],
          },
        },
      };
      setUp(timelineProps, stateWithLoading);
      const noDataComponent = getById('timeLine_noData');
      expect(noDataComponent).toBeInTheDocument();
    });
  });

  // Part 2: Timeline Controls Tests
  describe('Timeline Component - Controls', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'incidents', 'activity'));
      setUp(timelineProps, initialData);
    });

    it('Should handle search toggle', () => {
      const searchButton = getById('timeline_search');
      fireEvent.click(searchButton);
      jest.advanceTimersByTime(400);
    });

    it('Should handle filter toggle', () => {
      const filterButton = getById('timeline_filtersIcn');
      fireEvent.click(filterButton);
      const filterMenu = getById('filterTimelineId');
      expect(filterMenu).toBeInTheDocument();
      fireEvent.click(document.body);
    });

    it('Should handle zoom controls', () => {
      const zoomInButton = getById('timeline_zoomInIcn');
      const zoomOutButton = getById('timeline_zoomOutIcn');
      const resetZoomButton = getById('timeline_zoomResetIcn');

      fireEvent.click(zoomInButton);
      fireEvent.click(zoomOutButton);
      fireEvent.click(resetZoomButton);
    });

    it('Should handle search input changes', () => {
      // Open search first
      const searchButton = getById('timeline_search');
      fireEvent.click(searchButton);
      // Get search input and simulate typing
      const searchInput2 = getById('searchTimelineInp');
      fireEvent.change(searchInput2, { target: { value: 'inci' } });
      expect(searchInput2.value).toBe('inci');
      const searchInput1 = getById('searchTimelineInp');
      fireEvent.change(searchInput1, { target: { value: '' } });
      expect(searchInput1.value).toBe('');
      const searchInput3 = getById('searchTimelineInp');
      fireEvent.change(searchInput3, { target: { value: 'test search' } });
      expect(searchInput3.value).toBe('test search');

      fireEvent.click(document.body);
    });

    it('Should handle search close button and clear input', () => {
      // Open search first
      const searchButton = getById('timeline_search');
      fireEvent.click(searchButton);

      // Type something in search
      const searchInput = getById('searchTimelineInp');
      fireEvent.change(searchInput, { target: { value: 'tes' } });

      // Test search close
      const searchCloseButton = getById('timeline_search_close');
      fireEvent.click(searchCloseButton);

      jest.advanceTimersByTime(400);
    });

    it('Should handle tooltip interactions', () => {
      // Test tooltip close
      const tooltipCloseButton = getById('timeline_tooltip_closeIcn');
      fireEvent.click(tooltipCloseButton);
      // Add assertions for selection behavior
    });
  });

  // Part 3: Timeline Data Response Tests
  describe('Timeline Component - Response Handling', () => {
    it('Should handle failed timeline data response', () => {
      const failedState = {
        ...initialData,
        Incident: {
          GetTimeLineResponse: {
            status: false,
            error: 'Failed to fetch timeline data',
          },
        },
      };
      setUp(timelineProps, failedState);
      const noDataComponent = getById('timeLine_noData');
      expect(noDataComponent).toBeInTheDocument();
    });
    it('Should handle timeline data response with length = 1', () => {
      const failedState = {
        ...initialData,
        Incident: {
          GetTimeLineResponse: {
            status: true,
            data: [{
              owner: 'Ekasha Admin',
              msg: 'Alert added in incident by Ekasha Admin',
              incidentMethod: 'addRawLog',
              fieldName: '',
              content: 'Alert added in incident by Ekasha Admin',
              start: '2024-10-18T06:48:49.226Z',
              id: 'v835b3edb-c649-40e8-b2e2-f94804da1c65',
              incidentId: '8',
              activityType: 'incident',
              userId: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
              status: true,
            }],
          },
        },
        Panel: {
          CloseDrawerPanel: 'PANEL_DRAWER_CLOSE',
        },
      };
      setUp(timelineProps, failedState);
    });
  });
  // Part 5: Filter Tests
  describe('Timeline Component - Filtering', () => {
    beforeEach(() => {
      setPermissions(handlePermission('RW', 'incidents', 'activity'));
      setUp(timelineProps, initialData);
    });

    it('Should handle activity filter changes', () => {
      const filterButton = getById('timeline_filtersIcn');
      fireEvent.click(filterButton);

      const incidentCheckbox = getById('timeline_incident_checkbox');
      const playbookCheckbox = getById('timeline_playbook_checkbox');
      const actionCheckbox = getById('timeline_action_checkbox');

      fireEvent.click(incidentCheckbox);
      fireEvent.click(playbookCheckbox);
      fireEvent.click(actionCheckbox);

      const closeFilterButton = getById('timeline_contentCloseIcn');
      fireEvent.click(closeFilterButton);
    });
  });

  // Part 4: Socket Communication Tests
  describe('Socket Operations', () => {
    let wrapper;
    let mockSubscribe;

    beforeEach(() => {
      mockSubscribe = {
        unsubscribe: jest.fn(),
      };
      stompClient.connected = true;
      stompClient.subscribe = jest.fn().mockReturnValue(mockSubscribe);

      setPermissions(handlePermission('RO', 'incidents', 'activity'));
      wrapper = setUp(timelineProps, initialData);
    });

    it('Should subscribe to socket on mount', () => {
      expect(stompClient.subscribe).toHaveBeenCalledWith('/topic/broadcast', expect.any(Function));
    });

    it('Should handle timeline socket data', () => {
      const subscribeCallback = stompClient.subscribe.mock.calls[0][1];
      // Test first socket message
      act(async () => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'incident',
            operation: 'activity',
            data: {
              id: 4,
              msg: 'New Activity',
              content: 'Socket activity',
              start: '2024-03-19T12:00:00',
              activityType: 'incident',
              incidentId: '1',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });

      // Test second socket message
      act(async () => {
        subscribeCallback({
          body: JSON.stringify({
            module: 'incident',
            operation: 'activity',
            data: {
              id: 5,
              msg: 'New Activity',
              content: '',
              start: '2024-03-19T12:00:00',
              activityType: 'incident',
              incidentId: '1',
              customerID: localStorage.getItem('customerID'),
            },
          }),
        });
      });
    });

    it('Should unsubscribe from socket on unmount', () => {
      wrapper.unmount();
      expect(mockSubscribe.unsubscribe).toHaveBeenCalled();
    });
    afterAll(() => {
      if (wrapper && wrapper.unmount) {
        wrapper.unmount();
      }
      jest.clearAllMocks();
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});

/* eslint-disable max-len */
import '@testing-library/jest-dom';
import { act } from 'react';
import moment from 'moment';
import { fireEvent, screen } from '@testing-library/react';
import { handlePermission } from '../../../../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../../../../helpers/lib/StorageHandlers';
import { getById, renderComponent, selectOption } from '../../../../../../../helpers/lib/RTL';
import ActionEkasha from '../../../../../../containers/incidents/subModule/actionEkasha';

jest.useFakeTimers();

const rerunProps = {
  IncidentId: 1,
  selectIncident: { status: 'Open' },
  setTemplateToken: jest.fn(),
  setEmailToken: jest.fn(),
};

const mockActionData = [
  {
    id: 1,
    token: 'token1',
    incidentDataToken: 'token1',
    actionName: 'Test Running Action 1',
    status: 'Failed',
    executeTime: '2024-03-20T11:00:00Z',
    assetToken: 'asset1',
    deviceToken: 'device1',
    deviceName: 'Test Device 1',
    assetName: 'Test Asset 1',
    actionToken: 'Report Incident',
    createdTime: '2024-03-20T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc1',
    cancelStatus: false,
    result: 'Action completed successfully',
    isSchedule: false,
    now: true,
    requireParam: {
      group1: [
        {
          name: 'param1',
          value: 'value1',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
  {
    id: 2,
    token: 'token2',
    incidentDataToken: 'token2',
    actionName: 'Test Terminated Action 2',
    status: 'Terminated',
    executeTime: '2024-03-19T11:00:00Z',
    assetToken: 'asset2',
    deviceToken: 'device2',
    deviceName: 'Test Device 2',
    assetName: 'Test Asset 2',
    actionToken: 'action2',
    createdTime: '2024-03-19T10:00:00Z',
    customerID: 'Customer_1',
    docId: 'doc2',
    cancelStatus: true,
    result: 'Action failed due to connection timeout',
    isSchedule: false,
    now: true,
    requireParam: {
      group1: [
        {
          name: 'param2',
          value: 'value2',
          required: 'true',
          type: 'text',
        },
      ],
    },
  },
];

const initialData = {
  APPS: {
    GetListAssetResponse: {
      status: true,
      data: [
        {
          assetName: 'sasas',
          description: 'sasas',
          token: 'r6e6b7a73-675e-49b4-80d8-f55033d66b1d',
          deviceToken: 'AFEC97R0',
        },
      ],
    },
    GetDeviceActionResponse: {
      status: true,
      data: [
        {
          displayName: 'File Reputation',
          description: 'Queries VirusTotal for file reputation info',
          token: '1',
        },
        {
          displayName: 'Domain Reputation',
          description: 'Queries VirusTotal for domain info',
          token: '823',
        },
        {
          displayName: 'URL Reputation',
          description: 'Queries VirusTotal for url info',
          token: '5522',
        },
        {
          displayName: 'IP Reputation',
          description: 'Queries VirusTotal for IP info',
          token: '824',
        },
        {
          displayName: 'Test Connectivity',
          description: 'Test connectivity for VirusTotal',
          token: '2',
        },
      ],
    },
    GetAllConfiguresResponse: {
      status: true,
      data: [
        {
          actionCount: 5,
          updatedTime: '2025-02-10T05:17:11Z',
          byteArray: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNC4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA0MTEgODMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQxMSA4MzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzNGNzJGRjt9DQoJLnN0MXtmaWxsOiM5Mzk4QTA7fQ0KPC9zdHlsZT4NCjxnPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMC4xLDgyLjljMC0wLjIsMC4zLTAuNCwwLjQtMC41bDMwLjctMzAuOWMzLjItMy4yLDYuNC02LjQsOS41LTkuNmMwLjQtMC40LDAuMy0wLjUsMC0wLjkNCgkJCUMzMS44LDMyLjEsMjIuOSwyMy4yLDE0LDE0LjNMMC40LDAuNUwwLDAuMUMwLjIsMCwwLjUsMCwwLjcsMGg3MS4xYzYsMCwxMi4xLDAsMTguMSwwYzAuNiwwLDAuNywwLjIsMC43LDAuNw0KCQkJYzAsMjcuMiwwLDU0LjQsMCw4MS41YzAsMC41LTAuMSwwLjctMC43LDAuN2MtMjkuOCwwLTU5LjYsMC04OS40LDBDMC40LDgzLDAuMiw4MywwLjEsODIuOXogTTE5LjIsNzQuN2gwLjZjMjAuNiwwLDQxLjIsMCw2MS44LDANCgkJCWMwLjUsMCwwLjctMC4xLDAuNy0wLjdjMC0yMS43LDAtNDMuNCwwLTY1LjFjMC0wLjUtMC4xLTAuNi0wLjYtMC42SDIwLjZjLTAuMiwwLTAuNC0wLjEtMC41LDAuMmMwLjIsMC4yLDAuNCwwLjMsMC41LDAuNQ0KCQkJYzEwLjYsMTAuNiwyMS4yLDIxLjIsMzEuOSwzMS44YzAuNCwwLjQsMC41LDAuNiwwLDFjLTExLDEwLjgtMjEuOSwyMS42LTMyLjksMzIuNEMxOS41LDc0LjMsMTkuMyw3NC40LDE5LjIsNzQuN0wxOS4yLDc0Ljd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDExLDY0LjNjLTIuMywwLTQuNSwwLTYuOCwwYy0wLjQsMC0wLjUtMC4yLTAuNS0wLjVjMC0xLjcsMC0zLjQsMC01YzAtMTMuNSwwLTI2LjksMC00MC40DQoJCQljMC0wLjYsMC4yLTAuOCwwLjgtMC44YzIuMiwwLDQuMywwLDYuNSwwTDQxMSw2NC4zeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTEzLjUsMTcuNmgyLjljMS42LDAsMy4yLDAsNC44LDBjMC40LTAuMSwwLjcsMC4yLDAuOCwwLjVjMi4zLDYuNyw0LjYsMTMuNCw2LjksMjAuMg0KCQkJYzEuOCw1LjMsMy43LDEwLjcsNS42LDE2YzAsMC4xLDAuMSwwLjIsMC4yLDAuNGMwLjUtMS41LDAuOS0yLjgsMS40LTQuMmMzLjgtMTAuOCw3LjYtMjEuNiwxMS41LTMyLjRjMC4xLTAuMywwLjItMC41LDAuNi0wLjUNCgkJCWMyLjYsMCw1LjEsMCw3LjcsMGMwLjEsMCwwLjIsMCwwLjIsMGMtMC40LDEuMS0wLjksMi4zLTEuMiwzLjRjLTUuMiwxNC4yLTEwLjQsMjguMy0xNS41LDQyLjVjLTAuMSwwLjUtMC42LDAuOS0xLjEsMC44DQoJCQljLTIuNSwwLTUsMC03LjUsMGMtMC40LDAuMS0wLjctMC4yLTAuOC0wLjZjLTUuNC0xNS4yLTEwLjgtMzAuNC0xNi4yLTQ1LjZDMTEzLjYsMTgsMTEzLjUsMTcuOSwxMTMuNSwxNy42eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzAxLjgsNDcuNWMwLTMuMSwwLjUtNi4yLDEuNS05LjFjMi4xLTUuMiw2LTguMSwxMS40LTljMy4xLTAuNSw2LjQtMC41LDkuNSwwLjFjNS4yLDEsOC44LDQuMSwxMC4zLDkuMg0KCQkJYzEuNyw1LjUsMS41LDExLjMtMC40LDE2LjdjLTEuOCw1LjEtNS41LDguMS0xMC43LDkuMmMtMy4zLDAuOC02LjgsMC44LTEwLjEsMC4xYy02LTEuNS05LjUtNS4zLTEwLjktMTEuMw0KCQkJQzMwMiw1MS40LDMwMS44LDQ5LjUsMzAxLjgsNDcuNXogTTMyNy42LDQ3LjFjMC4yLTIuNC0wLjEtNC43LTAuNy03Yy0wLjYtMi42LTIuNy00LjUtNS4zLTQuOWMtMS43LTAuMy0zLjYtMC4zLTUuMywwLjENCgkJCWMtMi4yLDAuNS00LjEsMS45LTUuMSwzLjljLTEsMi0xLjUsNC4yLTEuNSw2LjRjLTAuMSwxLjcsMCwzLjMsMC4yLDVjMC4yLDEuNywwLjYsMy40LDEuNCw1YzAuOSwxLjgsMi41LDMuMSw0LjUsMy41DQoJCQljMS41LDAuMywzLDAuNCw0LjYsMC4yYzMuMi0wLjIsNS45LTIuNSw2LjctNS42QzMyNy41LDUxLjYsMzI3LjcsNDkuMywzMjcuNiw0Ny4xeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzg4LjIsNjAuMmMtMC42LDAuNi0xLjEsMS4yLTEuNiwxLjZjLTMuNSwzLjItOC40LDQuMy0xMi45LDIuOGMtNC0xLjItNi4xLTQuMy02LjgtOC4zDQoJCQljLTAuMi0xLjQtMC4yLTIuOSwwLjEtNC4zYzAuNy0zLjUsMy01LjQsNi4zLTYuMmMzLjUtMC45LDcuMi0xLjYsMTAuOC0yYzEuMi0wLjEsMi40LTAuMiwzLjctMC4zYzAuMiwwLDAuNCwwLjEsMC40LTAuMw0KCQkJYzAuMi0xLjgtMC4xLTMuNi0wLjktNS4yYy0wLjgtMS40LTIuMi0yLjMtMy44LTIuNGMtMi4yLTAuMi00LjQsMC02LjUsMC40Yy0yLjcsMC41LTUuNCwxLjItOCwyLjFjLTAuNCwwLjEtMC41LDAuMS0wLjUtMC40DQoJCQljMC0xLjcsMC0zLjUsMC01LjJjMC0wLjMsMC4xLTAuNiwwLjQtMC42YzMuOC0xLjQsNy44LTIuMywxMS44LTIuN2MyLjUtMC4zLDUuMS0wLjIsNy42LDAuMmMzLjcsMC42LDYuNSwzLjcsNi43LDcuNA0KCQkJYzAuMiwxLjgsMC4zLDMuNywwLjMsNS42YzAsNywwLjEsMTQuMSwwLjEsMjEuMWMwLDAuNi0wLjEsMC43LTAuNywwLjdjLTIsMC0zLjksMC01LjksMGMtMC42LDAtMC43LTAuMi0wLjctMC43DQoJCQlDMzg4LjMsNjIuNSwzODguMiw2MS40LDM4OC4yLDYwLjJ6IE0zODguMiw1Mi41YzAtMSwwLTIuMSwwLTMuMWMwLTAuNS0wLjEtMC42LTAuNi0wLjZjLTMuMiwwLTYuNCwwLjQtOS41LDENCgkJCWMtMi43LDAuNC00LjYsMi45LTQuMiw1LjZjMCwwLjEsMCwwLjIsMCwwLjJjMC4yLDEuNSwxLjIsMi44LDIuNywzLjRjMS41LDAuNiwzLjIsMC44LDQuOCwwLjVjMi41LTAuNCw0LjgtMS41LDYuNi0zLjINCgkJCWMwLjItMC4yLDAuMy0wLjQsMC4zLTAuN0MzODguMiw1NC42LDM4OC4yLDUzLjUsMzg4LjIsNTIuNXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyNi4zLDYxLjFjLTEuMSwwLjctMi4yLDEuMy0zLjMsMS45Yy0zLjgsMi4yLTguNCwyLjgtMTIuNiwxLjhjLTEuNy0wLjQtMy4zLTEuMi00LjYtMi40DQoJCQljLTEuMy0xLjItMi4xLTIuOC0yLTQuNmMwLTkuMSwwLTE4LjEsMC0yNy4yYzAtMC41LDAuMS0wLjYsMC42LTAuNmMyLDAsNC4xLDAsNi4xLDBjMC41LDAsMC42LDAuMiwwLjYsMC42YzAsOC4xLDAsMTYuMiwwLDI0LjMNCgkJCWMwLDIuMywwLjksMy40LDMuMiwzLjljMi42LDAuNSw1LjMsMC4xLDcuNy0xLjJjMS41LTAuNywzLTEuNiw0LjMtMi41YzAuNC0wLjIsMC4zLTAuNSwwLjMtMC45YzAtNy44LDAtMTUuNiwwLTIzLjUNCgkJCWMwLTEtMC4xLTAuOSwwLjgtMC45YzIsMCw0LDAsNiwwYzAuNCwwLDAuNSwwLjEsMC41LDAuNWMwLDExLDAsMjIuMSwwLDMzLjFjMCwwLjQtMC4xLDAuNi0wLjUsMC41Yy0yLjEsMC00LjMsMC02LjQsMA0KCQkJYy0wLjQsMC0wLjUtMC4xLTAuNS0wLjVDMjI2LjMsNjIuOSwyMjYuMyw2Mi4xLDIyNi4zLDYxLjF6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOTMuOSw0NC43YzAsNi4zLDAsMTIuNywwLDE5YzAsMC41LTAuMSwwLjctMC43LDAuN2MtMi4zLDAtNC43LDAtNywwYy0wLjUsMC0wLjYtMC4yLTAuNi0wLjYNCgkJCWMwLTEyLjcsMC0yNS4zLDAtMzhjMC0wLjgsMC0wLjgtMC44LTAuOGMtMy43LDAtNy4zLDAtMTEsMGMtMC42LDAtMC43LTAuMi0wLjctMC44YzAtMiwwLTQsMC02YzAtMC40LDAuMS0wLjUsMC41LTAuNQ0KCQkJYzEwLjcsMCwyMS40LDAsMzIuMSwwYzAuNSwwLDAuNSwwLjIsMC41LDAuNmMwLDIsMCw0LjEsMCw2LjFjMCwwLjUtMC4xLDAuNi0wLjYsMC42Yy0zLjcsMC03LjQsMC0xMS4xLDBjLTAuNSwwLTAuNywwLjEtMC43LDAuNw0KCQkJQzI5My45LDMyLDI5My45LDM4LjMsMjkzLjksNDQuN3oiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI0MSw1Ny4xYzEuMiwwLjUsMi41LDEsMy44LDEuNGMyLjgsMC44LDUuNywxLjIsOC42LDEuMmMxLjQsMCwyLjgtMC40LDMuOS0xLjJjMS4yLTAuOSwxLjktMi40LDEuNi00DQoJCQljLTAuMi0xLjEtMC45LTItMi0yLjVjLTEuNi0wLjctMy4zLTEuMy01LjEtMS44Yy0yLjEtMC42LTQuMi0xLjMtNi4yLTIuMmMtMy0xLjUtNC40LTQtNC42LTcuM2MtMC4zLTIuNywwLjYtNS40LDIuNC03LjUNCgkJCWMxLjktMS45LDQuMy0zLjIsNi45LTMuNmM0LjEtMC45LDguMS0wLjMsMTIuMSwwLjljMC42LDAuMiwxLjIsMC40LDEuOCwwLjVjMC4yLDAsMC40LDAuMiwwLjQsMC41YzAsMCwwLDAsMCwwYzAsMS44LDAsMy42LDAsNS40DQoJCQljMCwwLjQtMC4xLDAuNC0wLjUsMC4zYy0yLjEtMC44LTQuMy0xLjMtNi41LTEuOGMtMi4yLTAuNC00LjQtMC42LTYuNiwwLjJjLTIsMC42LTMuMiwyLjctMi42LDQuOGMwLjIsMC45LDAuOCwxLjYsMS43LDEuOQ0KCQkJYzEuNywwLjcsMy41LDEuMyw1LjMsMS44YzIsMC41LDMuOSwxLjEsNS44LDEuOWMzLjMsMS4zLDUuNSw0LjUsNS41LDhjMC4yLDUtMi45LDguNy03LjIsMTAuMWMtMi44LDAuOS01LjgsMS4yLTguOCwxDQoJCQljLTMuMS0wLjItNi4yLTAuNy05LjItMS42Yy0wLjQtMC4xLTAuNS0wLjMtMC41LTAuN0MyNDEsNjAuOSwyNDEsNTksMjQxLDU3LjF6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNDQuNyw0Ni4zYzAtMy4xLDAtNi4yLDAtOS40YzAtMC41LTAuMS0wLjYtMC42LTAuNmMtMS43LDAtMy40LDAtNSwwYy0wLjQsMC0wLjYtMC4xLTAuNi0wLjYNCgkJCWMwLTEuNywwLTMuNSwwLTUuMmMwLTAuNCwwLjEtMC41LDAuNS0wLjVjMS43LDAsMy41LDAsNS4yLDBjMC40LDAsMC41LTAuMSwwLjUtMC41YzAtMi40LDAtNC44LDAtNy4yYzAtMC41LDAuMS0wLjYsMC42LTAuNg0KCQkJYzIsMCw0LjEsMCw2LjEsMGMwLjUsMCwwLjYsMC4xLDAuNiwwLjZjMCwyLjQsMCw0LjcsMCw3LjFjMCwwLjUsMC4xLDAuNiwwLjYsMC42YzMsMCw2LjEsMCw5LjEsMGMwLjUsMCwwLjYsMC4xLDAuNiwwLjYNCgkJCWMwLDEuNywwLDMuNCwwLDVjMCwwLjUtMC4yLDAuNi0wLjcsMC42Yy0zLDAtNi4xLDAtOS4xLDBjLTAuNCwwLTAuNiwwLTAuNiwwLjVjMCw2LDAsMTIsMC4xLDE4YzAsMC42LDAuMSwxLjEsMC4yLDEuNg0KCQkJYzAuMiwxLjQsMS4zLDIuNCwyLjcsMi41YzEuNSwwLjMsMy4xLDAuMiw0LjYtMC4yYzAuNy0wLjMsMS41LTAuNCwyLjMtMC42YzAuMy0wLjEsMC41LTAuMSwwLjUsMC40YzAsMS44LDAsMy41LDAsNS4zDQoJCQljMCwwLjIsMC4xLDAuNC0wLjMsMC41Yy0zLDAuNS02LjEsMS05LjIsMC43Yy00LjQtMC40LTcuMS0zLjEtNy44LTcuNGMtMC4zLTIuMS0wLjQtNC4xLTAuMy02LjJDMzQ0LjcsNDkuNywzNDQuNyw0OCwzNDQuNyw0Ni4zeg0KCQkJIi8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xODUuMiwzNC4yYzAuNi0wLjcsMS4zLTEuNCwyLTIuMWMyLjItMS45LDQuOS0zLDcuOC0zYzEsMCwyLDAsMywwYzAuMywwLDAuNSwwLjEsMC41LDAuNGMwLDIuMSwwLDQuMywwLDYuNA0KCQkJYzAsMC40LTAuMiwwLjQtMC41LDAuNGMtMi43LTAuMy01LjUtMC4xLTguMSwwLjZjLTEuNywwLjUtMy4yLDEuMy00LjYsMi40Yy0wLjMsMC4yLTAuMywwLjUtMC4zLDAuOGMwLDUuMSwwLDEwLjMsMCwxNS40DQoJCQljMCwyLjgsMCw1LjYsMCw4LjNjMCwwLjQtMC4xLDAuNi0wLjYsMC42Yy0yLjEsMC00LjEsMC02LjIsMGMtMC40LDAtMC41LTAuMS0wLjUtMC41YzAtMTEuMSwwLTIyLjEsMC0zMy4yYzAtMC40LDAuMS0wLjUsMC41LTAuNQ0KCQkJYzIuMSwwLDQuMiwwLDYuMiwwYzAuNCwwLDAuNSwwLjEsMC41LDAuNWMwLDEuMiwwLDIuMywwLDMuNEwxODUuMiwzNC4yeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYxLjEsNDcuMmMwLTUuNSwwLTExLDAtMTYuNWMwLTAuNSwwLjEtMC42LDAuNi0wLjZjMiwwLDQuMSwwLDYuMSwwYzAuNCwwLDAuNSwwLjEsMC41LDAuNQ0KCQkJYzAsMTEsMCwyMi4xLDAsMzMuMWMwLDAuNC0wLjEsMC42LTAuNSwwLjZjLTIsMC00LjEsMC02LjEsMGMtMC41LDAtMC42LTAuMS0wLjYtMC42QzE2MS4xLDU4LjIsMTYxLjEsNTIuNywxNjEuMSw0Ny4yeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTY0LjgsMjQuN2MtMS4xLDAtMi4xLDAtMy4yLDBjLTAuMywwLTAuNS0wLjEtMC41LTAuNWMwLTIuMSwwLTQuMSwwLTYuMmMwLTAuNCwwLjEtMC41LDAuNS0wLjUNCgkJCWMyLjEsMCw0LjIsMCw2LjMsMGMwLjQsMCwwLjUsMC4xLDAuNSwwLjVjMCwyLjEsMCw0LjIsMCw2LjNjMCwwLjQtMC4xLDAuNS0wLjUsMC41Yy0xLDAtMi4xLDAtMy4xLDBMMTY0LjgsMjQuN3oiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==',
          deviceData: {
            configuration: '[\n  {\n    "description": "apikey",\n    "field": "apiKey",\n    "required": "true",\n    "type": "text",\n   "validationKey": "API Key"\n  }\n]',
            vendor: 'VirusTotal',
            displayName: 'VirusTotal',
            description: 'This app integrates with the VirusTotal cloud to implement investigative and reputation actions',
            version: '3.0',
            deviceToken: 'AFEC97R0',
          },
          createdTime: '2025-02-10T05:17:11Z',
          assetCount: 1,
        },
      ],
    },
  },
  IncdentAction: {
    GetActionListResponse: {
      code: 200,
      message: 'Get action data.',
      status: true,
      data: [
        'URL Reputation',
        'Email Reputation',
        'File Reputation',
        'Domain Reputation',
        'IP Reputation',
        'Test Connectivity',
        'Terminate Process',
        'Terminate Process using Process Name',
        'Hunt File',
        'Hunt file on multiple systems ',
        'Hunt Process',
        'Get Process ID',
        'Hunt User',
        'List User',
        'Delete File',
        'Copy File',
        'Reboot System',
        'Get File',
        'Remove User From Local Group',
        'Add User To Local Group',
        'Block Port',
        'Start Service',
        'Stop Service',
        'Restart Service',
        'Change File Permission',
        'Logoff User',
        'User Disable',
        'Multiple User Disable',
        'Add User Account in Group',
        'Add Multiple User Account in Group',
        'Remove User Account From Group',
        'Create User Account',
        'Delete User Account From AD Server',
        'Enable User Account',
        'List Groups',
        'List User Attributes',
        'List All Users',
        'List Users of Group',
        "Get User's Group",
        'Reset User Password',
        'Get IP Configuration',
        'Get User Active Sessions',
        'Logout User',
        'Create User',
        'Delete User',
        'Block IP',
        'Change File Owner',
        'Move File',
        'List Running Process by User',
        'List Open Ports',
        'List Listen Ports',
        'List Installed Application',
        'List Autoruns',
        'List Scheduled Tasks',
        'List Rules',
        'Search Rule By ID',
        'Delete Rule By ID',
        'List Interfaces',
        'List Network Object',
        'Create Network Object',
        'Backup Firewall Configuration',
        'Create Access Rule',
        'Run Command',
        'Redeploy VM',
        'Get IP Availability',
        'List Virtual Networks',
        'List Snapshots',
        'Create Tag',
        'List Tags',
        'Deallocate VM',
        'Delete VM',
        'Stop VM',
        'Start VM',
        'List VM',
        'Get System Info',
        'Create or Updaten Network Security Rule',
        'Delete Network Security Rule',
        'List Resource Groups',
        'Add Network Security Group',
        'List Newtork Security Groups',
        'Create Network Security Group',
        'Create Group',
        'Delete User From Group',
        'Add User To Group',
        'List Directory Role',
        'Disable User',
        'Enable User',
        'List Group Members',
        'Get Group Info',
        'List Group',
        'Set User Attribute',
        'Get User Attributes',
        'Revoke User Token',
        'Reset Password',
        'List Users',
        'Delete Group',
        'Create or Update Azure Key Vault',
        'Delete Azure Key Vault',
        'Get Azure Key Vault',
        'List Azure Key Vault',
        'AccessPolicy Update For Azure Key Vault',
        'Get Azure Key Vault Key',
        'List Azure Key Vault Key',
        'Delete Azure Key Vault Key',
        'Get Azure Key Vault Secret',
        'List Azure Key Vault Secret',
        'Delete Azure Key Vault Secret',
        'Get Azure Key Vault Certificate',
        'List Azure Key Vault Certificate',
        'Get Azure Key Vault Certificate Policy',
        'Azure Data Explorer Search Query Execute',
        'Azure Data Explorer Search Query List',
        'Azure Data Explorer Running Search Query List',
        'Azure Data Explorer Running Search Query Cancel',
        'Get Feeds',
        'Delete Feeds',
        'Azure Firewall List',
        'Azure Firewall Get',
        'Azure Firewall Rule Collection List',
        'Azure Firewall Rule List',
        'Azure Firewall Rule Get',
        'Azure Firewall Policy Create',
        'Azure Firewall Policy Update',
        'Azure Firewall Policy Get',
        'Azure Firewall Policy Delete',
        'Azure Firewall Policy Attach',
        'Azure Firewall Policy Detach',
        'Azure Firewall Network Rule Collection Create',
        'Azure Firewall Network Rule Collection Delete',
        'Azure Firewall Network Rule Create',
        'Azure Firewall Network Rule Update',
        'Azure Firewall Network Rule Delete',
        'Azure Firewall Network Rule Collection Update',
        'Azure Firewall Service Tag List',
        'Azure Firewall Ip Group Create',
        'Azure Firewall Ip Group Update',
        'Azure Firewall Ip Group List',
        'Azure Firewall Ip Group Get',
        'Azure Firewall Ip Group Delete',
        'Azure Ks Clusters List',
        'Azure Ks Cluster Addon Update',
        'Azure Ks Resource Group List',
        'List Agent Pools ',
        'Get Agent Pools',
        'Delete Agent Pools',
        'Delete Managed Cluster',
        'Get Managed Cluster',
        'Run Command On Cluster',
        'Cluster Start',
        'Cluster Stop',
        'Azure Sql Servers List',
        'Azure Sql Db List',
        'Azure Sql Db Audit Policy List',
        'Azure Sql Db Threat Policy Get',
        'Azure Sql Db Audit Policy Create Update',
        'Azure Sql Db Threat Policy Create Update',
        'Azure Storage Container List',
        'Azure Storage Container Create',
        'Azure Storage Container Property Get',
        'Azure Storage Container Delete',
        'Azure Storage Container Blob List',
        'Azure Storage Container Blob Create',
        'Azure Storage Container Blob Update',
        'Azure Storage Container Blob Get',
        'Azure Storage Container Blob Tag Get',
        'Azure Storage Container Blob Tag Set',
        'Azure Storage Container Blob Delete',
        'Azure Storage Container Blob Property Get',
        'Azure Storage Container Blob Property Set',
        'Azure Storage File Share Create',
        'Azure Storage File Share Delete',
        'Azure Storage File Share List',
        'Azure Storage File Share Content List',
        'Azure Storage File Share Directory Create',
        'Azure Storage File Share Directory Delete',
        'Azure Storage File Share File Create',
        'Azure Storage File Share File Get',
        'Azure Storage File Share File Delete',
        'Azure Storage Account List',
        'Azure Storage Account Create Update',
        'Azure Storage Blob Service Properties Get',
        'Azure Storage Blob Service Properties Set',
        'Azure Storage Blob Containers Create',
        'Azure Storage Blob Containers Update',
        'Azure Storage Blob Containers List',
        'Azure Storage Blob Container Delete',
        'Azure Storage Queue List',
        'Azure Storage Queue Create',
        'Azure Storage Queue Delete',
        'Azure Storage Queue Message Create',
        'Azure Storage Queue Message Get',
        'Azure Storage Queue Message Peek',
        'Azure Storage Queue Message Dequeue',
        'Azure Storage Queue Message Update',
        'Azure Storage Queue Message Delete',
        'Azure Storage Queue Message Clear',
        'Azure Storage Table Create',
        'Azure Storage Table Delete',
        'Azure Storage Table Query',
        'Azure Storage Table Entity Insert',
        'Azure Storage Table Entity Update',
        'Azure Storage Table Entity Replace',
        'Azure Storage Table Entity Query',
        'Azure Storage Table Entity Delete',
        'Azure Waf Policies Get',
        'Azure Waf Policies List All In Subscription',
        'Azure Waf Policy Update Or Create',
        'Azure Waf Policy Delete',
        'Azure Devops Pipeline Run',
        'Azure Devops User Add',
        'Azure Devops User Remove',
        'Azure Devops Pull Request Create',
        'Azure Devops Pull Request Update',
        'Azure Devops Pull Request List',
        'Azure Devops Project List',
        'Azure Devops Repository List',
        'Azure Devops User List',
        'Azure Devops Pull Request Get',
        'Azure Devops Pipeline Run Get',
        'Azure Devops Pipeline Run List',
        'Azure Devops Pipeline List',
        'Azure Devops Branch List',
        'Sophos Firewall Rule Get',
        'Sophos Firewall Rule Add',
        'Sophos Firewall Ip Host Delete',
        'Sophos Firewall Ip Host Get',
        'Sophos Firewall Ip Host Group Add',
        'Sophos Firewall Ip Host Group Get',
        'Sophos Firewall Zone Get',
        'Sophos Firewall Service Get',
        'Sophos Firewall Ip Range Host Create',
        'Sonicwall Firewall Check Connectivity',
        'Sonicwall Firewall Zone Get',
        'Sonicwall Firewall Interface Get',
        'Sonicwall Firewall Object Create',
        'Sonicwall Firewall Object Get',
        'Sonicwall Firewall Object Delete',
        'Sonicwall Firewall Object Group Create',
        'Sonicwall Firewall Object Group Get',
        'Sonicwall Firewall Object Group Delete',
        'Sonicwall Firewall Security Policy Get',
        'Sonicwall Firewall Security Policy Delete',
        'Sonicwall Firewall Security Policy Create',
        'Add Network Security Group ',
        'Sophos Firewall Rule List',
        'Sophos Firewall Zone List ',
        'Sophos Firewall Service List',
        'Sophos Firewall Ip Host List',
        'Sophos Firewall Ip Host Group List',
        'Sonicwall Firewall Zone List',
        'Sonicwall Firewall Interface List',
        'Sonicwall Firewall Object List',
        'Sonicwall Firewall Object Group List',
        'Sonicwall Firewall Security Policy List',
      ],
    },
    GetActionDeviceListResponse: {
      status: true,
      data: [
        {
          isConfigured: false,
          appLogo: 'PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMTUgNTUiPjx0aXRsZT5JUFF1YWxpdHlTY29yZSBsb2dvPC90aXRsZT48cGF0aCBkPSJNNywyNC40MWE5LjUsOS41LDAsMCwwLC44OS02LjYzLDguMTEsOC4xMSwwLDAsMSwxLjMzLDIuODhjLjIxLjYzLjMzLDEuMjkuNTIsMS45NCwwLC4xOSwwLC41Mi4yNy41M3MuMTgtLjMuMjUtLjQ3Yy4yNS0uNTQuNDktMS4wOS43NS0xLjYyLjA3LS4xNS4xNi0uMzUuMzgtLjI2cy4xMi4yNS4xMi4zOWMwLC44OSwwLDEuNzktLjEsMi42OGE0LjQzLDQuNDMsMCwwLDAsLjE2LDEuNDFjLjE5LjcxLjc2LDEuMDksMS4zMy44N2ExLjA2LDEuMDYsMCwwLDAsLjU4LTEuMzdjLS4zMS0xLjMxLS42Ny0yLjYtMS0zLjg5LS4xLS40LS4zNi0xLDAtMS4xNnMuNjkuNDEuOS43M2EyOC40LDI4LjQsMCwwLDEsNC4zNCw5LjMzLDcuMTYsNy4xNiwwLDAsMS0zLjUyLDcuMzNjLTEsLjU2LTEsLjU2LTEtLjZWMzQuNTZjMC0uODEtLjI1LTEuMS0xLjA4LTFzLTEtLjE2LS45LS44OWEyNC4xNCwyNC4xNCwwLDAsMCwwLTIuNjksMS44NywxLjg3LDAsMCwwLTEuNzYtMiwxLjg4LDEuODgsMCwwLDAtMi4xNywxLjY3LDE3LjIzLDE3LjIzLDAsMCwwLDAsMy4xM2MwLC41NC0uMTMuNzQtLjcxLjcyLTEuMDcsMC0xLjI4LjIzLTEuMjksMS4zMywwLC43MiwwLDEuNDQsMCwyLjE2LDAsLjUtLjExLjY2LS41OS4zOC0zLjExLTEuODEtNC44My01LTMuNjctOC43YTI4LjUzLDI4LjUzLDAsMCwxLDQuODQtOC43NWMuMTQtLjE4LjI4LS41MS41NS0uMzlzLjEyLjQ0LjExLjY3QTExLjI0LDExLjI0LDAsMCwwLDcsMjQuNDFaIiBmaWxsPSIjZWYzZTM5Ii8+PHBhdGggZD0iTTM2LjcyLDI5LjQyYy0uNC0uMTktLjQ4LS4zMS0uMzEtLjdhMy42LDMuNiwwLDAsMCwuMjEtMS40NlYyMC42MmEzLDMsMCwxLDAtNi0uMDljMCwyLjM0LDAsNC42OCwwLDdhMi44MiwyLjgyLDAsMCwwLDMuNTMsMi45MSwxLjI1LDEuMjUsMCwwLDEsMS4zOC4zNSwxLDEsMCwwLDAsLjgyLjI5Yy4yNCwwLC42Ny4xOS42NC0uMjRTMzcuMzUsMjkuNzEsMzYuNzIsMjkuNDJabS0yLjA3LTJjMCwuODUtLjM0LDEuMjgtMSwxLjI5cy0xLjA3LS40Mi0xLjA4LTEuM3EwLTMuMzYsMC02LjczYzAtLjg5LjM4LTEuMzEsMS4wOS0xLjI5czEsLjQ0LDEsMS4zMWMwLDEuMTIsMCwyLjI0LDAsMy4zNlMzNC42NiwyNi4yOSwzNC42NSwyNy40MVoiIGZpbGw9IiM1MDZlYjUiLz48cGF0aCBkPSJNMTAyLjQzLDMwYTE3LjcxLDE3LjcxLDAsMCwxLS4xMS0yLjkxLDUuNjIsNS42MiwwLDAsMC0uMjItMS43N2MtLjE5LS40OS0uNzktLjc3LS44NC0xLjE0cy42Ni0uNjUuODItMS4xNWEzLjc1LDMuNzUsMCwwLDAsLjItMS4xYzAtLjU1LDAtMS4wOSwwLTEuNjRhMi4zOCwyLjM4LDAsMCwwLTIuNTctMi41N2MtLjkyLDAtMS44NCwwLTIuNzYsMC0uNDgsMC0uNTguMTUtLjU4LjYsMCwxLjg5LDAsMy43OCwwLDUuNjd2NC45NGMwLDEuNDcsMCwxLjQ1LDEuNDUsMS40My40MywwLC41NC0uMTQuNTMtLjU1LDAtMS4yMiwwLTIuNDQsMC0zLjY2LDAtLjMxLS4yNS0uOC4yMy0uODlhMS4zLDEuMywwLDAsMSwxLjUzLjQ4LDEuOCwxLjgsMCwwLDEsLjIuOTRjMCwuODcsMCwxLjc0LDAsMi42MSwwLC4zNS0uMS45LjMsMWE2LjUxLDYuNTEsMCwwLDAsMS43MSwwQzEwMi41MiwzMC4zMSwxMDIuNDYsMzAuMTMsMTAyLjQzLDMwWm0tMi4xMi03LjczYTEuMjcsMS4yNywwLDAsMS0xLjcyLDEuMTNjLS4yNy0uMDgtLjIzLS4yOC0uMjQtLjQ3VjIxLjQ2YTYuNCw2LjQsMCwwLDEsMC0xYy4wNy0uMzUtLjM0LS45NS41LTEsMSwwLDEuMzkuMiwxLjQ0LDFBMTUuMjYsMTUuMjYsMCwwLDEsMTAwLjMxLDIyLjI5WiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik05NS4wNywyMC40NmEzLDMsMCwwLDAtNi0uMDhxLS4wNiwzLjY0LDAsNy4zMWEyLjYzLDIuNjMsMCwwLDAsMS4yNywyLjM5LDMsMywwLDAsMCw0LjczLTIuNmMwLTEuMTcsMC0yLjM0LDAtMy41MVM5NS4xLDIxLjYzLDk1LjA3LDIwLjQ2Wm0tMiw3LjFjMCwuNzYtLjQyLDEuMTctMS4wOCwxLjE1YTEsMSwwLDAsMS0xLTEuMDljMC0yLjM5LDAtNC43OCwwLTcuMTdhMSwxLDAsMCwxLDEuMDctMS4wN2MuNjMsMCwxLC40LDEsMS4xNSwwLDEuMTcsMCwyLjM0LDAsMy41MVM5My4xMywyNi4zOCw5My4xMSwyNy41NloiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNNDEuODYsMjIuOTRjMC0xLjUyLDAtMywwLTQuNTYsMC0uNTEuMTItLjY4LjY1LS42NywxLjI3LDAsMS4yNywwLDEuMjcsMS4yNCwwLDIuODEsMCw1LjYzLDAsOC40NCwwLDIuMzktMS43MiwzLjY0LTQsM2EyLjU2LDIuNTYsMCwwLDEtMS45LTIuNjVjLS4wNS0zLjE4LDAtNi4zNywwLTkuNTYsMC0uMzIuMS0uNDcuNDItLjQ0YS4zOC4zOCwwLDAsMCwuMTUsMGMxLjQyLDAsMS40MiwwLDEuNDIsMS4zOHEwLDQuMTQsMCw4LjI5YzAsLjY0LjExLDEuMjIuOSwxLjMxczEuMTMtLjMyLDEuMTQtMS4xM0M0MS44NywyNiw0MS44NiwyNC40OSw0MS44NiwyMi45NFoiIGZpbGw9IiM1MDZlYjUiLz48cGF0aCBkPSJNNDkuODYsMjBjLS4xMi0uNzQuMDctMS43Ny0uNTItMi4xNHMtMS41LS4wNy0yLjI3LS4xYy0uMzksMC0uNS4xNi0uNTUuNS0uNTcsMy42NC0xLjE2LDcuMjctMS43MiwxMC45MS0uMiwxLjI1LS4xOCwxLjIzLDEuMDcsMS4yMy40NywwLC42LS4xOC42My0uNnMuMTQtLjc5LjE3LTEuMTguMTktLjUzLjYtLjU0YzEuODgsMCwxLjg4LDAsMi4xOSwxLjgyLDAsLjI2LjA2LjQ5LjQxLjQ5LjU1LDAsMS4wOSwwLDEuNjYsMEM1MSwyNi44Myw1MC40MywyMy4zOSw0OS44NiwyMFptLTIuNDUsNi4zOWMtLjIzLDAtLjM5LS4wNi0uMzUtLjM0LjI3LTEuNzkuNTMtMy41OS44LTUuMzhoLjE5bC42Myw0LjA2YzAsLjEyLDAsLjI0LDAsLjM3QzQ4LjkzLDI2LjQ0LDQ4LjgyLDI2LjU0LDQ3LjQxLDI2LjM1WiIgZmlsbD0iIzUwNmViNSIvPjxwYXRoIGQ9Ik04Mi4wOCwyNGMwLTEuMTIsMC0yLjI0LDAtMy4zNmEzLDMsMCwwLDEsNC40NS0yLjc0LDIuNTksMi41OSwwLDAsMSwxLjM0LDEuNzksNiw2LDAsMCwxLC4xMywxQzg4LjA1LDIyLDg4LDIyLDg2Ljc4LDIyYy0uNTIsMC0uNzItLjEzLS42Ni0uNjZhNS4yNyw1LjI3LDAsMCwwLDAtMSwuOTEuOTEsMCwwLDAtLjkzLS44OS45My45MywwLDAsMC0xLjA3LjgxLDMsMywwLDAsMCwwLC41MnY2LjY1YTEuMjUsMS4yNSwwLDAsMCwuNDksMS4xOCwxLDEsMCwwLDAsMS41Ny0uODUsMTMuNzEsMTMuNzEsMCwwLDAsMC0xLjU3YzAtLjM2LjEyLS40Ni40Ny0uNDdDODgsMjUuNTksODgsMjUuNTcsODgsMjdjMCwuMjUsMCwuNSwwLC43NWEyLjk0LDIuOTQsMCwwLDEtNC4zNCwyLjUsMi43NCwyLjc0LDAsMCwxLTEuNTUtMi42OEM4Mi4wNSwyNi4zNiw4Mi4wOCwyNS4xNyw4Mi4wOCwyNFoiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNODAsMjEuMTdjLS42MS4xNy0uODYtLjEyLS44My0uODVhLjg1Ljg1LDAsMCwwLS45NC0uOTMuOTMuOTMsMCwwLDAtMSwxLDIuNzQsMi43NCwwLDAsMCwuOTIsMi4yN2MuNTYuNTcsMS4xNiwxLjA5LDEuNywxLjY3YTQuMjUsNC4yNSwwLDAsMSwxLjA4LDQuMjcsMywzLDAsMCwxLTUuNjItLjEyYzAtLjE3LS4wNi0uMzQtLjA5LS41Mi0uMTktMS4zNC4yMi0xLjcsMS41NS0xLjM3LjI4LjA3LjI1LjI0LjI3LjQ0YTYuMTIsNi4xMiwwLDAsMCwuMDgsMSwuODguODgsMCwwLDAsMSwuNzMuODcuODcsMCwwLDAsMS0uNzUsMi40NSwyLjQ1LDAsMCwwLS43Mi0yLjMyYy0uNjUtLjY5LTEuMzUtMS4zMi0yLTJhNC4yNSw0LjI1LDAsMCwxLTEtMy44MkEyLjg5LDIuODksMCwwLDEsODEsMTkuNzFjMCwuMTUuMDYuMjkuMDguNDRDODEuMTYsMjEuMTcsODEuMTUsMjEuMTcsODAsMjEuMTdaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTEwMy42MiwyNGMwLTEuODcsMC0zLjc0LDAtNS42MSwwLS41OC4xOC0uNy43Mi0uNjksMS4zNywwLDIuNzQsMCw0LjExLDAsLjQ5LDAsLjcxLjEyLjYyLjYydi4wOGMwLDEuMjkuMiwxLjEtMS4wOSwxLjEyLS41OSwwLTEuMTksMC0xLjc5LDBzLS42LjE1LS41OS42YzAsLjgsMCwxLjU5LDAsMi4zOSwwLC40NC4xNi41Ni41Ny41NHMxLjEsMCwxLjY1LDAsLjU0LjE1LjU1LjU2YzAsMS4yNiwwLDEuMjYtMS4xOCwxLjI2LTEuNTgsMC0xLjYsMC0xLjU3LDEuNiwwLC42OS0uMzMsMS42LjE2LDJzMS4yOS4xLDIsLjEyaC4yMmMxLjA4LDAsMS40MS40NywxLjExLDEuNTQtLjA4LjMtLjI3LjI0LS40Ni4yNC0xLjQ5LDAtMywwLTQuNDgsMC0uNDksMC0uNS0uMjQtLjQ5LS42QzEwMy42MywyNy44NCwxMDMuNjIsMjUuOTIsMTAzLjYyLDI0WiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik0yOS40MiwyMGEyLjI5LDIuMjksMCwwLDAtMS44Mi0yLjEsMTcuOTIsMTcuOTIsMCwwLDAtMy4yNy0uMTVjLS40OSwwLS42NC4xMi0uNjMuNjIsMCwxLjg3LDAsMy43MywwLDUuNnY1LjA4YzAsMS4yOSwwLDEuMjYsMS4zMSwxLjI4LjUsMCwuNTYtLjE4LjU1LS42LDAtMS4xNSwwLTIuMjksMC0zLjQ0LDAtLjYuMTYtLjgxLjc2LS43NmEzLjY2LDMuNjYsMCwwLDAsMS0uMDYsMi4yOCwyLjI4LDAsMCwwLDIuMDctMi4xOEExOC4wOCwxOC4wOCwwLDAsMCwyOS40MiwyMFptLTEuODMsMi45M2ExLjMsMS4zLDAsMCwxLTEuODUuODhjLS4yMS0uMTEtLjE4LS4yOC0uMTgtLjQ1VjIxLjcyYTEwLjU4LDEwLjU4LDAsMCwxLDAtMS4yNmMuMDUtLjM3LS4zMi0xLC40OC0xLDEtLjA2LDEuNDcuMTUsMS41My45NUExNi40NCwxNi40NCwwLDAsMSwyNy41OSwyMi45M1oiIGZpbGw9IiNlZjNlMzgiLz48cGF0aCBkPSJNNzEuNDksMjMuMTVjLjQxLTEuNTMuODYtMy4wNiwxLjE5LTQuNjEuMTUtLjY4LjQzLS44NywxLjA5LS44MywxLC4wNiwxLDAsLjc1LDEtLjY5LDIuMzQtMS40LDQuNjctMi4wNyw3QTE0Ljg4LDE0Ljg4LDAsMCwwLDcyLjMyLDI5YzAsLjMsMCwuNiwwLC45cy0uMDcuNDctLjQ1LjQ5Yy0xLjUzLjA5LTEuNjQuMDktMS41LTEuNDEuMjUtMi44Mi0uODgtNS4zMS0xLjU4LTcuOTEtLjI2LTEtLjU1LTEuOTItLjg1LTIuODctLjEtLjMyLDAtLjQ3LjMxLS40NWEuMzguMzgsMCwwLDAsLjE1LDBjMS40OCwwLDEuNDcsMCwxLjg0LDEuMzlzLjcyLDIuNzEsMS4wNyw0LjA3WiIgZmlsbD0iIzUwNmViNSIvPjxwYXRoIGQ9Ik02My41MSwyNC44N2MwLTEuNTYsMC0zLjEzLDAtNC43LDAtLjUzLS4xNy0uNzMtLjY4LS42NGgtLjIzYy0xLjM1LDAtMS4xNC4yNy0xLjE4LTEuMjYsMC0uNDEuMS0uNTYuNTQtLjU1LDEuNjYsMCwzLjMzLDAsNSwwLC40NSwwLC42Ni4xMS41OC41OHYuMDdjMCwxLjM3LjE3LDEuMTQtMS4xMiwxLjE2LS45NCwwLS45NCwwLS45NCwxLDAsMywwLDYuMDcsMCw5LjExLDAsLjU1LS4xLjc4LS43Mi43NS0xLjI3LS4wNS0xLjI4LDAtMS4yOC0xLjNaIiBmaWxsPSIjNTA2ZWI1Ii8+PHBhdGggZD0iTTUyLjQ3LDI0YzAtMS44NiwwLTMuNzMsMC01LjYsMC0uNTIuMDgtLjc1LjY4LS43MywxLjMxLDAsMS4zMSwwLDEuMzEsMS4zNCwwLDIuOTMsMCw1Ljg3LDAsOC44MSwwLC41NC4xMi43Ni43LjcxczEuMywwLDEuOTQsMCwuNzIuMTcuNjUuNjhhMy43NSwzLjc1LDAsMCwwLDAsLjY3YzAsLjM4LS4xNC40Ni0uNDguNDUtMS40MiwwLTIuODMsMC00LjI1LDAtLjQ1LDAtLjU0LS4xNy0uNTMtLjU3QzUyLjQ3LDI3Ljg3LDUyLjQ3LDI2LDUyLjQ3LDI0WiIgZmlsbD0iIzUwNmViNSIvPjxwYXRoIGQ9Ik01OC41OCwyNC4wNmMwLTEuODksMC0zLjc4LDAtNS42NywwLS41MS4xLS42OS42NC0uNjgsMS4zNCwwLDEuMzQsMCwxLjM0LDEuMzEsMCwzLjUzLDAsNy4wNiwwLDEwLjU5LDAsLjU2LS4xLjc4LS43Mi43NS0xLjI2LS4wNS0xLjI2LDAtMS4yNi0xLjMxWiIgZmlsbD0iIzUwNmViNSIvPjxwYXRoIGQ9Ik0yMC4zLDI0YzAtMS44OSwwLTMuNzgsMC01LjY3LDAtLjQ5LjEzLS42Mi42Mi0uNjEsMS4yNiwwLDEuMjUsMCwxLjI1LDEuMjMsMCwzLjU1LDAsNy4xMSwwLDEwLjY2LDAsLjU1LS4xMy43Mi0uNy42OS0xLjE4LDAtMS4xOCwwLTEuMTgtMS4xNloiIGZpbGw9IiNlZjNmMzkiLz48cGF0aCBkPSJNOS44LDMxLjU1YzAsLjQyLDAsLjg1LDAsMS4yN3MtLjA3LjcxLS42My43LS41OS0uMjYtLjU4LS42OGMwLS45MiwwLTEuODQsMC0yLjc2LDAtLjQxLjA5LS43OS41OC0uNzlzLjYzLjM0LjYyLjc3WiIgZmlsbD0iI2VmNDIzYiIvPjxwYXRoIGQ9Ik0yMi4zNiwzNC4wOGEuNzUuNzUsMCwwLDEtLjI4LjYzLDEuMywxLjMsMCwwLDEtLjc5LjIySDIxdjFoLS4zNFYzMy4zaC43MUMyMiwzMy4zLDIyLjM2LDMzLjU2LDIyLjM2LDM0LjA4Wk0yMSwzNC42NGguMjdhMSwxLDAsMCwwLC41Ny0uMTNBLjQ3LjQ3LDAsMCwwLDIyLDM0LjFhLjQ0LjQ0LDAsMCwwLS4xNy0uMzkuODcuODcsMCwwLDAtLjUxLS4xM0gyMVoiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNMjQuNzQsMzQuODZWMzZoLS4zM1YzMy4zaC43M2ExLjE3LDEuMTcsMCwwLDEsLjc0LjE5LjY2LjY2LDAsMCwxLC4yNC41Ni43MS43MSwwLDAsMS0uNTQuNzJsLjczLDEuMmgtLjM5bC0uNjQtMS4xMVptMC0uMjhoLjRhLjcxLjcxLDAsMCwwLC40OC0uMTMuNDguNDgsMCwwLDAsLjE1LS4zOC40NC40NCwwLDAsMC0uMTUtLjM3Ljg5Ljg5LDAsMCwwLS40OS0uMTFoLS4zOVoiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNMzAuNTYsMzQuNjNhMS40NCwxLjQ0LDAsMCwxLS4zMywxLDEuMTEsMS4xMSwwLDAsMS0uOS4zNywxLjE0LDEuMTQsMCwwLDEtLjkxLS4zNiwxLjQ2LDEuNDYsMCwwLDEtLjMzLTEsMS40OSwxLjQ5LDAsMCwxLC4zMi0xLDEuMzMsMS4zMywwLDAsMSwxLjgzLDBBMS40OSwxLjQ5LDAsMCwxLDMwLjU2LDM0LjYzWm0tMi4xMSwwYTEuMjMsMS4yMywwLDAsMCwuMjIuOC43OS43OSwwLDAsMCwuNjYuMjguOC44LDAsMCwwLC42NS0uMjcsMS4yNiwxLjI2LDAsMCwwLC4yMi0uODEsMS4yNCwxLjI0LDAsMCwwLS4yMi0uODEuNzkuNzksMCwwLDAtLjY1LS4yNy44MS44MSwwLDAsMC0uNjYuMjdBMS4yOCwxLjI4LDAsMCwwLDI4LjQ1LDM0LjYzWiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik0zNC4yOCwzNiwzNCwzNS4xNEgzMi45bC0uMzIuODNoLS4zNGwxLTIuNjhoLjNsMSwyLjY4Wm0tLjQyLTEuMTMtLjMtLjgxLS4xMy0uNGEzLjI2LDMuMjYsMCwwLDEtLjExLjRsLS4zMS44MVoiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNMzcuNiwzMy41NWEuODYuODYsMCwwLDAtLjY4LjI5LDEuNDEsMS40MSwwLDAsMCwwLDEuNTkuODcuODcsMCwwLDAsLjY4LjI4LDIuMzksMi4zOSwwLDAsMCwuNjUtLjExdi4yOWExLjY1LDEuNjUsMCwwLDEtLjMzLjA5bC0uMzYsMGExLjE0LDEuMTQsMCwwLDEtLjkxLS4zNiwxLjQ3LDEuNDcsMCwwLDEtLjMyLTEsMS42NywxLjY3LDAsMCwxLC4xNS0uNzMsMS4wNywxLjA3LDAsMCwxLC40NS0uNDcsMS4yNSwxLjI1LDAsMCwxLC42OC0uMTcsMS41OCwxLjU4LDAsMCwxLC43NC4xNmwtLjE0LjI4QTEuNCwxLjQsMCwwLDAsMzcuNiwzMy41NVoiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNNDEuMTYsMzZoLS4zNFYzMy41OUg0MFYzMy4zaDJ2LjI5aC0uODNaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTQ0LjY0LDM2aC0xdi0uMkw0NCwzNS43VjMzLjU2bC0uMzItLjA3VjMzLjNoMXYuMTlsLS4zMi4wN1YzNS43bC4zMi4wN1oiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNNDYuMjksMzMuM2guMzVsLjYsMS43MWE1LDUsMCwwLDEsLjE3LjU4LDMuNzgsMy43OCwwLDAsMSwuMTctLjU5bC41OS0xLjdoLjM2bC0xLDIuNjdoLS4zNFoiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNNTEuODgsMzZINTAuMzlWMzMuM2gxLjQ5di4yOUg1MC43MnYuODNoMS4wOXYuM0g1MC43MnYxaDEuMTZaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTU0LDM2VjMzLjNoLjM0djIuMzdoMS4xN1YzNloiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNNTguMDYsMzQuNjFsLjY5LTEuMzFoLjM2bC0uODgsMS42M3YxaC0uMzR2LTFMNTcsMzMuM2guMzdaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTY1LjE1LDM0LjA4YS43NS43NSwwLDAsMS0uMjguNjMsMS4zLDEuMywwLDAsMS0uNzkuMjJoLS4zdjFoLS4zNFYzMy4zaC43MUM2NC44MSwzMy4zLDY1LjE1LDMzLjU2LDY1LjE1LDM0LjA4Wm0tMS4zNy41Nkg2NGExLDEsMCwwLDAsLjU4LS4xMy40Ny40NywwLDAsMCwuMTgtLjQxLjQ2LjQ2LDAsMCwwLS4xNy0uMzkuODcuODcsMCwwLDAtLjUxLS4xM2gtLjM0WiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik02Ny41MywzNC44NlYzNkg2Ny4yVjMzLjNoLjczYTEuMTcsMS4xNywwLDAsMSwuNzQuMTkuNjYuNjYsMCwwLDEsLjI0LjU2LjcxLjcxLDAsMCwxLS41NC43Mkw2OS4xLDM2aC0uMzlsLS42NS0xLjExWm0wLS4yOGguNGEuNzEuNzEsMCwwLDAsLjQ4LS4xMy40OC40OCwwLDAsMCwuMTUtLjM4LjQ0LjQ0LDAsMCwwLS4xNS0uMzcuOTMuOTMsMCwwLDAtLjUtLjExaC0uMzhaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTcyLjUxLDM2SDcxVjMzLjNoMS40OXYuMjlINzEuMzV2LjgzaDEuMDl2LjNINzEuMzV2MWgxLjE2WiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik03NC4yMywzMy4zaC4zNWwuNiwxLjcxYTMuNTgsMy41OCwwLDAsMSwuMTcuNTgsNS4zNiw1LjM2LDAsMCwxLC4xNy0uNTlsLjYtMS43aC4zNWwtMSwyLjY3aC0uMzRaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTc5LjgyLDM2SDc4LjMzVjMzLjNoMS40OXYuMjlINzguNjd2LjgzaDEuMDl2LjNINzguNjd2MWgxLjE1WiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik04NCwzNmgtLjM5TDgyLjIsMzMuNzVoMHYuMTVxMCwuMzMsMCwuNTdWMzZoLS4zMVYzMy4zaC4zOWwuMDguMTMuODcsMS4zNS40Ny43M2gwczAtLjE0LDAtLjMyLDAtLjMxLDAtLjM5VjMzLjNIODRaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTg3LjA5LDM2aC0uMzRWMzMuNTloLS44M1YzMy4zaDJ2LjI5aC0uODNaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTkyLjYyLDM2aC0uMzRWMzMuM2gxLjQ5di4yOUg5Mi42MnYuOTVIOTMuN3YuMjlIOTIuNjJaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTk2LjA2LDM0Ljg2VjM2aC0uMzRWMzMuM2guNzNhMS4xNSwxLjE1LDAsMCwxLC43NC4xOS42Ni42NiwwLDAsMSwuMjQuNTYuNzEuNzEsMCwwLDEtLjU0LjcybC43MywxLjJoLS4zOWwtLjY0LTEuMTFabTAtLjI4aC4zOWEuNzEuNzEsMCwwLDAsLjQ4LS4xMy40OC40OCwwLDAsMCwuMTUtLjM4LjQ0LjQ0LDAsMCwwLS4xNS0uMzcuODkuODksMCwwLDAtLjQ5LS4xMWgtLjM4WiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik0xMDEuMjEsMzZsLS4zMi0uODNIOTkuODNsLS4zMS44M2gtLjM0bDEtMi42OGguM2wxLDIuNjhabS0uNDItMS4xMy0uMy0uODEtLjEyLS40YzAsLjE1LS4wOC4yOC0uMTIuNGwtLjMuODFaIiBmaWxsPSIjOTM5OWExIi8+PHBhdGggZD0iTTEwNS40NiwzMy4zVjM1YTEsMSwwLDAsMS0uMjguNzIsMS4wOSwxLjA5LDAsMCwxLS43Ny4yNiwxLjA1LDEuMDUsMCwwLDEtLjc1LS4yNiwxLDEsMCwwLDEtLjI2LS43MlYzMy4zaC4zNFYzNWEuNjguNjgsMCwwLDAsLjE3LjUuNy43LDAsMCwwLC41Mi4xOC42OS42OSwwLDAsMCwuNTEtLjE4LjY2LjY2LDAsMCwwLC4xOC0uNTFWMzMuM1oiIGZpbGw9IiM5Mzk5YTEiLz48cGF0aCBkPSJNMTA5Ljc5LDM0LjYxYTEuMzYsMS4zNiwwLDAsMS0uMzYsMSwxLjQzLDEuNDMsMCwwLDEtMSwuMzVoLS43NVYzMy4zaC44MmExLjMsMS4zLDAsMCwxLDEsLjM0QTEuMjcsMS4yNywwLDAsMSwxMDkuNzksMzQuNjFabS0uMzUsMGExLjE0LDEuMTQsMCwwLDAtLjI1LS43OCwxLDEsMCwwLDAtLjc2LS4yNkgxMDh2Mi4xaC4zNkExLDEsMCwwLDAsMTA5LjQ0LDM0LjYyWiIgZmlsbD0iIzkzOTlhMSIvPjxwYXRoIGQ9Ik0xMTEuNDYsMzIuM2gtLjU5di0uMjFoMS40MnYuMjFoLS41OFYzNGgtLjI1WiIgZmlsbD0iIzUwNmViNSIvPjxwYXRoIGQ9Ik0xMTQuMTMsMzMuMTZjMC0uMjYsMC0uNTksMC0uODNoMGE2Ljg3LDYuODcsMCwwLDEtLjI0LjczbC0uMzQuOTRoLS4xOWwtLjMxLS45MmE3LjUsNy41LDAsMCwxLS4yMi0uNzVoMGMwLC4yNCwwLC41NiwwLC44NWwtLjA2LjgzaC0uMjNsLjEzLTEuOTJoLjMybC4zMy45M2MuMDguMjMuMTQuNDQuMTkuNjRoMGMwLS4xOS4xMi0uNC4yLS42NGwuMzUtLjkzaC4zMWwuMTIsMS45MmgtLjI0WiIgZmlsbD0iIzUwNmViNSIvPjwvc3ZnPg==',
          displayName: 'IPQualityScore',
          configuredDeviceCount: 0,
          description: 'This app integrates with ipqualityscore to perform investigative actions',
          actionsCount: 4,
          time: '2022-09-24T12:22:10Z',
          token: 'ABDGSBJ',
        },
        {
          isConfigured: true,
          appLogo: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNC4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA0MTEgODMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQxMSA4MzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzNGNzJGRjt9DQoJLnN0MXtmaWxsOiM5Mzk4QTA7fQ0KPC9zdHlsZT4NCjxnPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMC4xLDgyLjljMC0wLjIsMC4zLTAuNCwwLjQtMC41bDMwLjctMzAuOWMzLjItMy4yLDYuNC02LjQsOS41LTkuNmMwLjQtMC40LDAuMy0wLjUsMC0wLjkNCgkJCUMzMS44LDMyLjEsMjIuOSwyMy4yLDE0LDE0LjNMMC40LDAuNUwwLDAuMUMwLjIsMCwwLjUsMCwwLjcsMGg3MS4xYzYsMCwxMi4xLDAsMTguMSwwYzAuNiwwLDAuNywwLjIsMC43LDAuNw0KCQkJYzAsMjcuMiwwLDU0LjQsMCw4MS41YzAsMC41LTAuMSwwLjctMC43LDAuN2MtMjkuOCwwLTU5LjYsMC04OS40LDBDMC40LDgzLDAuMiw4MywwLjEsODIuOXogTTE5LjIsNzQuN2gwLjZjMjAuNiwwLDQxLjIsMCw2MS44LDANCgkJCWMwLjUsMCwwLjctMC4xLDAuNy0wLjdjMC0yMS43LDAtNDMuNCwwLTY1LjFjMC0wLjUtMC4xLTAuNi0wLjYtMC42SDIwLjZjLTAuMiwwLTAuNC0wLjEtMC41LDAuMmMwLjIsMC4yLDAuNCwwLjMsMC41LDAuNQ0KCQkJYzEwLjYsMTAuNiwyMS4yLDIxLjIsMzEuOSwzMS44YzAuNCwwLjQsMC41LDAuNiwwLDFjLTExLDEwLjgtMjEuOSwyMS42LTMyLjksMzIuNEMxOS41LDc0LjMsMTkuMyw3NC40LDE5LjIsNzQuN0wxOS4yLDc0Ljd6Ii8+DQoJPC9nPg0KCTxnPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDExLDY0LjNjLTIuMywwLTQuNSwwLTYuOCwwYy0wLjQsMC0wLjUtMC4yLTAuNS0wLjVjMC0xLjcsMC0zLjQsMC01YzAtMTMuNSwwLTI2LjksMC00MC40DQoJCQljMC0wLjYsMC4yLTAuOCwwLjgtMC44YzIuMiwwLDQuMywwLDYuNSwwTDQxMSw2NC4zeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTEzLjUsMTcuNmgyLjljMS42LDAsMy4yLDAsNC44LDBjMC40LTAuMSwwLjcsMC4yLDAuOCwwLjVjMi4zLDYuNyw0LjYsMTMuNCw2LjksMjAuMg0KCQkJYzEuOCw1LjMsMy43LDEwLjcsNS42LDE2YzAsMC4xLDAuMSwwLjIsMC4yLDAuNGMwLjUtMS41LDAuOS0yLjgsMS40LTQuMmMzLjgtMTAuOCw3LjYtMjEuNiwxMS41LTMyLjRjMC4xLTAuMywwLjItMC41LDAuNi0wLjUNCgkJCWMyLjYsMCw1LjEsMCw3LjcsMGMwLjEsMCwwLjIsMCwwLjIsMGMtMC40LDEuMS0wLjksMi4zLTEuMiwzLjRjLTUuMiwxNC4yLTEwLjQsMjguMy0xNS41LDQyLjVjLTAuMSwwLjUtMC42LDAuOS0xLjEsMC44DQoJCQljLTIuNSwwLTUsMC03LjUsMGMtMC40LDAuMS0wLjctMC4yLTAuOC0wLjZjLTUuNC0xNS4yLTEwLjgtMzAuNC0xNi4yLTQ1LjZDMTEzLjYsMTgsMTEzLjUsMTcuOSwxMTMuNSwxNy42eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzAxLjgsNDcuNWMwLTMuMSwwLjUtNi4yLDEuNS05LjFjMi4xLTUuMiw2LTguMSwxMS40LTljMy4xLTAuNSw2LjQtMC41LDkuNSwwLjFjNS4yLDEsOC44LDQuMSwxMC4zLDkuMg0KCQkJYzEuNyw1LjUsMS41LDExLjMtMC40LDE2LjdjLTEuOCw1LjEtNS41LDguMS0xMC43LDkuMmMtMy4zLDAuOC02LjgsMC44LTEwLjEsMC4xYy02LTEuNS05LjUtNS4zLTEwLjktMTEuMw0KCQkJQzMwMiw1MS40LDMwMS44LDQ5LjUsMzAxLjgsNDcuNXogTTMyNy42LDQ3LjFjMC4yLTIuNC0wLjEtNC43LTAuNy03Yy0wLjYtMi42LTIuNy00LjUtNS4zLTQuOWMtMS43LTAuMy0zLjYtMC4zLTUuMywwLjENCgkJCWMtMi4yLDAuNS00LjEsMS45LTUuMSwzLjljLTEsMi0xLjUsNC4yLTEuNSw2LjRjLTAuMSwxLjcsMCwzLjMsMC4yLDVjMC4yLDEuNywwLjYsMy40LDEuNCw1YzAuOSwxLjgsMi41LDMuMSw0LjUsMy41DQoJCQljMS41LDAuMywzLDAuNCw0LjYsMC4yYzMuMi0wLjIsNS45LTIuNSw2LjctNS42QzMyNy41LDUxLjYsMzI3LjcsNDkuMywzMjcuNiw0Ny4xeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzg4LjIsNjAuMmMtMC42LDAuNi0xLjEsMS4yLTEuNiwxLjZjLTMuNSwzLjItOC40LDQuMy0xMi45LDIuOGMtNC0xLjItNi4xLTQuMy02LjgtOC4zDQoJCQljLTAuMi0xLjQtMC4yLTIuOSwwLjEtNC4zYzAuNy0zLjUsMy01LjQsNi4zLTYuMmMzLjUtMC45LDcuMi0xLjYsMTAuOC0yYzEuMi0wLjEsMi40LTAuMiwzLjctMC4zYzAuMiwwLDAuNCwwLjEsMC40LTAuMw0KCQkJYzAuMi0xLjgtMC4xLTMuNi0wLjktNS4yYy0wLjgtMS40LTIuMi0yLjMtMy44LTIuNGMtMi4yLTAuMi00LjQsMC02LjUsMC40Yy0yLjcsMC41LTUuNCwxLjItOCwyLjFjLTAuNCwwLjEtMC41LDAuMS0wLjUtMC40DQoJCQljMC0xLjcsMC0zLjUsMC01LjJjMC0wLjMsMC4xLTAuNiwwLjQtMC42YzMuOC0xLjQsNy44LTIuMywxMS44LTIuN2MyLjUtMC4zLDUuMS0wLjIsNy42LDAuMmMzLjcsMC42LDYuNSwzLjcsNi43LDcuNA0KCQkJYzAuMiwxLjgsMC4zLDMuNywwLjMsNS42YzAsNywwLjEsMTQuMSwwLjEsMjEuMWMwLDAuNi0wLjEsMC43LTAuNywwLjdjLTIsMC0zLjksMC01LjksMGMtMC42LDAtMC43LTAuMi0wLjctMC43DQoJCQlDMzg4LjMsNjIuNSwzODguMiw2MS40LDM4OC4yLDYwLjJ6IE0zODguMiw1Mi41YzAtMSwwLTIuMSwwLTMuMWMwLTAuNS0wLjEtMC42LTAuNi0wLjZjLTMuMiwwLTYuNCwwLjQtOS41LDENCgkJCWMtMi43LDAuNC00LjYsMi45LTQuMiw1LjZjMCwwLjEsMCwwLjIsMCwwLjJjMC4yLDEuNSwxLjIsMi44LDIuNywzLjRjMS41LDAuNiwzLjIsMC44LDQuOCwwLjVjMi41LTAuNCw0LjgtMS41LDYuNi0zLjINCgkJCWMwLjItMC4yLDAuMy0wLjQsMC4zLTAuN0MzODguMiw1NC42LDM4OC4yLDUzLjUsMzg4LjIsNTIuNXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIyNi4zLDYxLjFjLTEuMSwwLjctMi4yLDEuMy0zLjMsMS45Yy0zLjgsMi4yLTguNCwyLjgtMTIuNiwxLjhjLTEuNy0wLjQtMy4zLTEuMi00LjYtMi40DQoJCQljLTEuMy0xLjItMi4xLTIuOC0yLTQuNmMwLTkuMSwwLTE4LjEsMC0yNy4yYzAtMC41LDAuMS0wLjYsMC42LTAuNmMyLDAsNC4xLDAsNi4xLDBjMC41LDAsMC42LDAuMiwwLjYsMC42YzAsOC4xLDAsMTYuMiwwLDI0LjMNCgkJCWMwLDIuMywwLjksMy40LDMuMiwzLjljMi42LDAuNSw1LjMsMC4xLDcuNy0xLjJjMS41LTAuNywzLTEuNiw0LjMtMi41YzAuNC0wLjIsMC4zLTAuNSwwLjMtMC45YzAtNy44LDAtMTUuNiwwLTIzLjUNCgkJCWMwLTEtMC4xLTAuOSwwLjgtMC45YzIsMCw0LDAsNiwwYzAuNCwwLDAuNSwwLjEsMC41LDAuNWMwLDExLDAsMjIuMSwwLDMzLjFjMCwwLjQtMC4xLDAuNi0wLjUsMC41Yy0yLjEsMC00LjMsMC02LjQsMA0KCQkJYy0wLjQsMC0wLjUtMC4xLTAuNS0wLjVDMjI2LjMsNjIuOSwyMjYuMyw2Mi4xLDIyNi4zLDYxLjF6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOTMuOSw0NC43YzAsNi4zLDAsMTIuNywwLDE5YzAsMC41LTAuMSwwLjctMC43LDAuN2MtMi4zLDAtNC43LDAtNywwYy0wLjUsMC0wLjYtMC4yLTAuNi0wLjYNCgkJCWMwLTEyLjcsMC0yNS4zLDAtMzhjMC0wLjgsMC0wLjgtMC44LTAuOGMtMy43LDAtNy4zLDAtMTEsMGMtMC42LDAtMC43LTAuMi0wLjctMC44YzAtMiwwLTQsMC02YzAtMC40LDAuMS0wLjUsMC41LTAuNQ0KCQkJYzEwLjcsMCwyMS40LDAsMzIuMSwwYzAuNSwwLDAuNSwwLjIsMC41LDAuNmMwLDIsMCw0LjEsMCw2LjFjMCwwLjUtMC4xLDAuNi0wLjYsMC42Yy0zLjcsMC03LjQsMC0xMS4xLDBjLTAuNSwwLTAuNywwLjEtMC43LDAuNw0KCQkJQzI5My45LDMyLDI5My45LDM4LjMsMjkzLjksNDQuN3oiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI0MSw1Ny4xYzEuMiwwLjUsMi41LDEsMy44LDEuNGMyLjgsMC44LDUuNywxLjIsOC42LDEuMmMxLjQsMCwyLjgtMC40LDMuOS0xLjJjMS4yLTAuOSwxLjktMi40LDEuNi00DQoJCQljLTAuMi0xLjEtMC45LTItMi0yLjVjLTEuNi0wLjctMy4zLTEuMy01LjEtMS44Yy0yLjEtMC42LTQuMi0xLjMtNi4yLTIuMmMtMy0xLjUtNC40LTQtNC42LTcuM2MtMC4zLTIuNywwLjYtNS40LDIuNC03LjUNCgkJCWMxLjktMS45LDQuMy0zLjIsNi45LTMuNmM0LjEtMC45LDguMS0wLjMsMTIuMSwwLjljMC42LDAuMiwxLjIsMC40LDEuOCwwLjVjMC4yLDAsMC40LDAuMiwwLjQsMC41YzAsMCwwLDAsMCwwYzAsMS44LDAsMy42LDAsNS40DQoJCQljMCwwLjQtMC4xLDAuNC0wLjUsMC4zYy0yLjEtMC44LTQuMy0xLjMtNi41LTEuOGMtMi4yLTAuNC00LjQtMC42LTYuNiwwLjJjLTIsMC42LTMuMiwyLjctMi42LDQuOGMwLjIsMC45LDAuOCwxLjYsMS43LDEuOQ0KCQkJYzEuNywwLjcsMy41LDEuMyw1LjMsMS44YzIsMC41LDMuOSwxLjEsNS44LDEuOWMzLjMsMS4zLDUuNSw0LjUsNS41LDhjMC4yLDUtMi45LDguNy03LjIsMTAuMWMtMi44LDAuOS01LjgsMS4yLTguOCwxDQoJCQljLTMuMS0wLjItNi4yLTAuNy05LjItMS42Yy0wLjQtMC4xLTAuNS0wLjMtMC41LTAuN0MyNDEsNjAuOSwyNDEsNTksMjQxLDU3LjF6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNDQuNyw0Ni4zYzAtMy4xLDAtNi4yLDAtOS40YzAtMC41LTAuMS0wLjYtMC42LTAuNmMtMS43LDAtMy40LDAtNSwwYy0wLjQsMC0wLjYtMC4xLTAuNi0wLjYNCgkJCWMwLTEuNywwLTMuNSwwLTUuMmMwLTAuNCwwLjEtMC41LDAuNS0wLjVjMS43LDAsMy41LDAsNS4yLDBjMC40LDAsMC41LTAuMSwwLjUtMC41YzAtMi40LDAtNC44LDAtNy4yYzAtMC41LDAuMS0wLjYsMC42LTAuNg0KCQkJYzIsMCw0LjEsMCw2LjEsMGMwLjUsMCwwLjYsMC4xLDAuNiwwLjZjMCwyLjQsMCw0LjcsMCw3LjFjMCwwLjUsMC4xLDAuNiwwLjYsMC42YzMsMCw2LjEsMCw5LjEsMGMwLjUsMCwwLjYsMC4xLDAuNiwwLjYNCgkJCWMwLDEuNywwLDMuNCwwLDVjMCwwLjUtMC4yLDAuNi0wLjcsMC42Yy0zLDAtNi4xLDAtOS4xLDBjLTAuNCwwLTAuNiwwLTAuNiwwLjVjMCw2LDAsMTIsMC4xLDE4YzAsMC42LDAuMSwxLjEsMC4yLDEuNg0KCQkJYzAuMiwxLjQsMS4zLDIuNCwyLjcsMi41YzEuNSwwLjMsMy4xLDAuMiw0LjYtMC4yYzAuNy0wLjMsMS41LTAuNCwyLjMtMC42YzAuMy0wLjEsMC41LTAuMSwwLjUsMC40YzAsMS44LDAsMy41LDAsNS4zDQoJCQljMCwwLjIsMC4xLDAuNC0wLjMsMC41Yy0zLDAuNS02LjEsMS05LjIsMC43Yy00LjQtMC40LTcuMS0zLjEtNy44LTcuNGMtMC4zLTIuMS0wLjQtNC4xLTAuMy02LjJDMzQ0LjcsNDkuNywzNDQuNyw0OCwzNDQuNyw0Ni4zeg0KCQkJIi8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xODUuMiwzNC4yYzAuNi0wLjcsMS4zLTEuNCwyLTIuMWMyLjItMS45LDQuOS0zLDcuOC0zYzEsMCwyLDAsMywwYzAuMywwLDAuNSwwLjEsMC41LDAuNGMwLDIuMSwwLDQuMywwLDYuNA0KCQkJYzAsMC40LTAuMiwwLjQtMC41LDAuNGMtMi43LTAuMy01LjUtMC4xLTguMSwwLjZjLTEuNywwLjUtMy4yLDEuMy00LjYsMi40Yy0wLjMsMC4yLTAuMywwLjUtMC4zLDAuOGMwLDUuMSwwLDEwLjMsMCwxNS40DQoJCQljMCwyLjgsMCw1LjYsMCw4LjNjMCwwLjQtMC4xLDAuNi0wLjYsMC42Yy0yLjEsMC00LjEsMC02LjIsMGMtMC40LDAtMC41LTAuMS0wLjUtMC41YzAtMTEuMSwwLTIyLjEsMC0zMy4yYzAtMC40LDAuMS0wLjUsMC41LTAuNQ0KCQkJYzIuMSwwLDQuMiwwLDYuMiwwYzAuNCwwLDAuNSwwLjEsMC41LDAuNWMwLDEuMiwwLDIuMywwLDMuNEwxODUuMiwzNC4yeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTYxLjEsNDcuMmMwLTUuNSwwLTExLDAtMTYuNWMwLTAuNSwwLjEtMC42LDAuNi0wLjZjMiwwLDQuMSwwLDYuMSwwYzAuNCwwLDAuNSwwLjEsMC41LDAuNQ0KCQkJYzAsMTEsMCwyMi4xLDAsMzMuMWMwLDAuNC0wLjEsMC42LTAuNSwwLjZjLTIsMC00LjEsMC02LjEsMGMtMC41LDAtMC42LTAuMS0wLjYtMC42QzE2MS4xLDU4LjIsMTYxLjEsNTIuNywxNjEuMSw0Ny4yeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTY0LjgsMjQuN2MtMS4xLDAtMi4xLDAtMy4yLDBjLTAuMywwLTAuNS0wLjEtMC41LTAuNWMwLTIuMSwwLTQuMSwwLTYuMmMwLTAuNCwwLjEtMC41LDAuNS0wLjUNCgkJCWMyLjEsMCw0LjIsMCw2LjMsMGMwLjQsMCwwLjUsMC4xLDAuNSwwLjVjMCwyLjEsMCw0LjIsMCw2LjNjMCwwLjQtMC4xLDAuNS0wLjUsMC41Yy0xLDAtMi4xLDAtMy4xLDBMMTY0LjgsMjQuN3oiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==',
          displayName: 'VirusTotal',
          configuredDeviceCount: 1,
          description: 'This app integrates with the VirusTotal cloud to implement investigative and reputation actions',
          actionsCount: 5,
          time: '2025-02-10T05:17:11Z',
          token: 'AFEC97R0',
        },
        {
          isConfigured: false,
          appLogo: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNC4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA0NDkuOSAxODgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0OS45IDE4ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzkzOThBMDt9DQoJLnN0MXtmaWxsOiMzRjcyRkY7fQ0KPC9zdHlsZT4NCjxnPg0KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0wLDE0NS40VjYuNmMwLTMsMC42LTQuMSwxLjctNS4yYzEtMSwyLTEuNCw0LjktMS40aDQxNC4zYzUuNiwyLjgsNy4yLDcuNSw3LjIsMTMuNQ0KCQlDNDI4LDU1LjYsNDI4LDk3LjYsNDI4LDEzOS43YzAsOS41LTMuNCwxMi45LTEzLDEyLjljLTEzNCwwLTI2OCwwLTQwMiwwLjFDNy4xLDE1Mi43LDIuNiwxNTAuOSwwLDE0NS40eiBNMTUyLjMsMTM4aDEyMy40VjE0LjUNCgkJSDE1Mi4zVjEzOHogTTQxMy40LDEzOC4xVjE0LjVIMjkwLjR2MTIzLjZMNDEzLjQsMTM4LjF6IE0xMzcuNiwxMzguMVYxNC40SDE0LjR2MTIzLjdMMTM3LjYsMTM4LjF6Ii8+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNTMuNiwxODcuNWgtNHYtMTkuN2wxMS40LDEwLjZ2LTkuOGg0LjJ2MTguOGwtMC43LDAuNmwtMTEtMTAuOEwzNTMuNiwxODcuNXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTk2LjQsMTY4Ljd2MTguN2wtMC44LDAuN2wtMTAuOS0xMC45djEwLjRoLTQuMXYtMTkuN2wxMS40LDEwLjZ2LTkuN0g5Ni40eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzUuMywxNzguMmMtMC4xLDUuMy00LjQsOS41LTkuNyw5LjRjLTUuMy0wLjEtOS41LTQuNC05LjQtOS43YzAuMS01LjIsNC4zLTkuMyw5LjUtOS40DQoJCQljNS4zLDAsOS42LDQuMyw5LjYsOS42QzM1LjMsMTc4LjEsMzUuMywxNzguMiwzNS4zLDE3OC4yeiBNMjYsMTcyLjhjLTIuOSwwLTUuMywyLjEtNS41LDVjLTAuMSwyLjksMi4xLDUuNCw1LDUuNQ0KCQkJYzIuOSwwLjEsNS40LTIuMSw1LjUtNUMzMSwxNzUuNCwyOC45LDE3MywyNiwxNzIuOHoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTM4OSwxNzguM3Y3LjJjLTUuMywzLjQtMTEuNiwyLjYtMTUtMS43Yy0zLTMuOS0yLjUtOS41LDEuMy0xMi44YzMuOS0zLjUsOS40LTMuNCwxMy42LDAuNWwtMi4yLDIuNQ0KCQkJYy00LjYtMS43LTcuNC0xLjUtOC43LDEuMmMtMC44LDEuNi0xLjEsNC4yLTAuMyw1LjdjMS4zLDIuNiw0LjEsMyw3LjQsMS45YzAtMC40LTAuMS0xLjUtMC4xLTEuNWMtMC43LDAtMS40LDAtMi4yLTAuMXYtMi45SDM4OXoNCgkJCSIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTY2LjMsMTc5LjljMS4yLDIuNSwyLjMsNSwzLjYsNy43aC00LjNsLTQuMy04bC0xLjEsMC40djcuNmwtNC4xLDAuMnYtMTkuMmg3LjZjMi44LDAsNSwxLjIsNS45LDMuOA0KCQkJYzEsMi42LDAuMSw0LjktMi4zLDYuNkMxNjcsMTc5LjIsMTY2LjcsMTc5LjUsMTY2LjMsMTc5Ljl6IE0xNjAsMTc2LjZjMi4yLTAuNyw0LjksMS4xLDUuOS0yLjZjLTEuNC0yLjYtMy43LTEuNi01LjktMS41VjE3Ni42eiINCgkJCS8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMDguNiwxODAuNnY2LjlsLTMuOCwwLjJ2LTE5aDMuOHY3LjVoNy45di03LjZoMy44djE4LjhoLTMuN2MtMC4xLTIuMi0wLjItNC41LTAuMy02LjlIMzA4LjZ6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMzUuNSwxODAuNnY2LjlsLTMuOCwwLjJ2LTE5aDMuOHY3LjVoNy45di03LjZoMy44djE4LjhoLTMuN2MtMC4xLTIuMi0wLjItNC41LTAuMy02LjlIMTM1LjV6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNzYuOCwxODcuNWgtNC43Yy0xLTEuNi0yLjItMy4zLTMuNi01LjRsLTMuOCw1LjVoLTQuN2MyLTMuNCwzLjgtNi40LDUuOC05LjdjLTEuOC0yLjktMy41LTUuOC01LjYtOS4yaDQuOA0KCQkJbDMuNCw0LjlsMy4yLTVoNC45bC01LjYsOS4yQzI3Mi45LDE4MC45LDI3NC43LDE4NCwyNzYuOCwxODcuNXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTY1LjUsMTcyLjR2My45aDYuM3Y0aC02LjFsLTAuMywzLjRoNy44bDAuMiwzLjhINjEuNnYtMTguOGgxMS42djMuN0g2NS41eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDA4LjIsMTY4LjdjMC4xLDEuMiwwLjEsMi4yLDAuMiwzLjdoLTcuOHY0aDYuMnYzLjloLTYuMWMtMC4xLDEuMS0wLjIsMi4xLTAuMywzLjRoNy44DQoJCQljMC4xLDEuNCwwLjEsMi41LDAuMiwzLjhoLTExLjh2LTE4LjdINDA4LjJ6Ii8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xODEuMiwxODAuMnYzLjVoNy43djMuOGgtMTEuNnYtMTguOGgxMS42YzAuMSwxLjEsMC4xLDIuMiwwLjIsMy43aC03Ljh2My45aDYuM2MwLjEsMS40LDAuMiwyLjQsMC4zLDMuOQ0KCQkJSDE4MS4yeiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjQ3LjIsMTgzLjhoNy44djMuN2gtMTEuNnYtMTguOGgxMS42djMuN2gtNy42djMuOWg2LjJ2NGgtNi4yQzI0Ny4zLDE4MS41LDI0Ny4yLDE4Mi40LDI0Ny4yLDE4My44eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjk3LjQsMTg0LjVjLTQuNyw0LjItMTAuMyw0LTE0LDAuMWMtMy42LTMuOC0zLjQtOS43LDAuMy0xMy4zYzMuOC0zLjcsOS4zLTMuNywxMy40LDAuMg0KCQkJYy0wLjcsMC44LTEuNCwxLjYtMi4yLDIuNWMtMy0xLjYtNi4xLTIuNC04LjQsMC45Yy0xLjYsMi0xLjUsNC44LDAuMyw2LjdjMi4zLDIuNiw1LDIuMiw4LjMsMC40TDI5Ny40LDE4NC41eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjAyLjUsMTY3LjZsOS4yLDE5LjloLTQuMWwtMS42LTIuM0gxOTlsLTEuNiwyLjRoLTQuMUMxOTYuMywxODEsMTk5LjIsMTc0LjcsMjAyLjUsMTY3LjZ6IE0yMDQuNSwxODEuMg0KCQkJbC0yLTQuNmwtMS45LDQuNkgyMDQuNXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMzOS43LDE4Ny40Yy0wLjUtMC43LTEtMS41LTEuNS0yLjNoLTYuOWwtMS43LDIuNGgtNC4xYzMtNi42LDUuOS0xMi44LDkuMi0xOS45bDkuMiwxOS44TDMzOS43LDE4Ny40eg0KCQkJIE0zMzYuNiwxODEuM2wtMS45LTQuN2MtMC44LDEuOC0xLjMsMy4xLTIsNC43SDMzNi42eiIvPg0KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDYuMiwxODAuNXY3aC0zLjh2LTE4LjhjMi42LDAsNS40LTAuNCw4LDAuMWMyLjksMC41LDQuNCwyLjcsNC41LDUuN2MtMC4xLDIuOS0yLjEsNS4zLTQuOSw1LjgNCgkJCUM0OC42LDE4MC40LDQ3LjQsMTgwLjUsNDYuMiwxODAuNXogTTQ2LjQsMTc3YzIuMiwwLDMuOS0wLjgsNC42LTIuMWMwLjItMC41LDAuMi0xLjEtMC4yLTEuNWMtMS0xLjEtMi4zLTEuMS00LjUtMS4xTDQ2LjQsMTc3eiINCgkJCS8+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMjMuMSwxODcuNmgtNC4ydi0xNC45bC00LjItMC4zYy0wLjEtMS4xLTAuMS0yLjMtMC4yLTMuNmgxMi43djMuNWwtNC4xLDAuNVYxODcuNnoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEyNC43LDE2OC43djMuNmwtNC4xLDAuM3YxNC44aC00LjJ2LTE0LjhsLTQuMi0wLjR2LTMuNkgxMjQuN3oiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTIxMy45LDg4LjVjMC43LTEuNCwxLjEtMi4zLDEuNi0zLjNjOC4xLTE4LjIsMTYuMy0zNi4zLDI0LjItNTQuNWMxLjMtMi45LDIuOS00LjEsNi0zLjkNCgkJYzMuNiwwLjIsNy4zLDAsMTAuOSwwLjFjNSwwLDYuMSwxLjksNC4xLDYuNGMtMTAuNCwyMi42LTIwLjcsNDUuMS0zMS4xLDY3LjdjLTMuNyw4LjEtNy40LDE2LjItMTEuMSwyNC4zYy0wLjksMi0yLDMuNi00LjYsMy42DQoJCWMtMi42LDAtMy42LTEuNC00LjYtMy41Yy0xNC0zMC43LTI4LTYxLjMtNDIuMS05MmMtMi4xLTQuNS0wLjktNi40LDQtNi40YzMuNiwwLDcuMywwLjEsMTAuOS0wLjFjMy4xLTAuMiw0LjgsMSw2LDMuOQ0KCQljOC4xLDE4LjQsMTYuMywzNi44LDI0LjUsNTUuMUMyMTMsODYuNiwyMTMuNCw4Ny4zLDIxMy45LDg4LjV6Ii8+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNjYuNCwyNy45YzYuOSwwLjEsOS4yLDMuNiw2LjYsMTBjMC45LDIuMywxLjgsNC42LDIuOCw3YzUuMiwwLDEwLjUtMC42LDE1LjUsMC4xDQoJCQljMTEuMiwxLjYsMTUuNiw5LjQsMTEuNiwxOS45Yy0xLjIsMy4yLTMuMSw2LjItNC45LDkuOGwtNC42LTUuM2MxLjUtMy4zLDMuMi02LjIsNC4yLTkuM2MxLjYtNC45LTAuNi04LjYtNS40LTEwLjQNCgkJCWMtNC0xLjUtOS4zLTEuNi0xNC44LTAuM2MwLjMsMi4xLDAuNyw0LjMsMS4xLDdsLTQuMi0yLjZsLTEuMy0zLjZsLTQuMiwwLjhsLTQuOS0yLjVsNy44LTIuNmMtMC43LTItMS41LTQtMi4yLTUuOQ0KCQkJYy01LjktMS4zLTcuMi0yLjktNi43LTguN2MtMy41LTMtNy4xLTMuMS0xMC42LDBjLTMuOSwzLjUtNS44LDguMS03LjYsMTMuMmMxLjksMC43LDMuNSwxLjEsNS4yLDEuNw0KCQkJYzE3LjQsNi4yLDMyLjgsMTUuNSw0NC45LDI5LjdjMy4zLDMuOSw1LjksOC4yLDcuOSwxMi44YzQuMiw5LjksMC44LDE2LjYtOS4zLDIwYy00LjEsNi40LTguNyw1LjQtMTIuMSwwLjhsLTUuNy0wLjcNCgkJCWMtMS41LDMuMi0yLjcsNi4zLTQuNCw5LjFjLTMuNCw1LjgtNy40LDExLjUtMTUsMTEuNGMtNy40LTAuMS0xMS4zLTUuNi0xNC43LTExLjNjLTQuNy04LjEtNi45LTE3LjEtOC4xLTI2LjMNCgkJCWMtMi4yLTE2LjYtMS40LTMzLDQuNC00OC44YzEuNi00LjUsMy45LTguOCw2LjgtMTIuOEMzNTAuOSwyMS41LDM1OC4xLDIxLDM2Ni40LDI3Ljl6IE0zNDEuNCw5NC44YzAuNiwyLjgsMSw0LjgsMS41LDcuMQ0KCQkJYzE1LjktNS4yLDMwLjYtMTMuNyw0My0yNWwtNS42LTQuOHY3bC00LjEsMy4zdi0xNEwzNTQuOSw1NmwtMTQuNCw4LjJ2MjVsMTEuNiw3bC00LjksMS44TDM0MS40LDk0Ljh6IE0zNzEuOCwxMDguM0wzNTksMTA0DQoJCQlsLTE0LjQsNS4zYzIsMy41LDMuNiw3LDUuOSwxMGM0LjMsNS43LDkuOCw1LjgsMTQuMywwLjJDMzY3LjUsMTE2LjIsMzY5LjQsMTEyLjIsMzcxLjgsMTA4LjNMMzcxLjgsMTA4LjN6IE0zODEuMiwxMDUuMw0KCQkJYzQuMy00LjYsNi4zLTQuOCwxMS0xLjFjOC0zLjYsNy4yLTE0LjQtMS42LTIxLjVsLTExLjMsOS42Yy0wLjgsNC4xLTEuNyw4LjItMi42LDEyLjZMMzgxLjIsMTA1LjN6IE0zNzQuNiw5NS41bC0xMC41LDYuMQ0KCQkJbDguNiwyLjVDMzczLjQsMTAxLjEsMzczLjksOTguNiwzNzQuNiw5NS41TDM3NC42LDk1LjV6IE0zNDEuMyw1OWw4LjQtNC44bC03LjItMi40QzM0Mi4xLDU0LjMsMzQxLjgsNTYuMywzNDEuMyw1OXoiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMzMi4yLDQ5Yy0zLjUsMC4yLTYuNSwwLjItOS40LDAuNmMtNi4zLDAuOS05LjIsNS4yLTcuNiwxMS4zYzEuMyw0LjksNCw4LjksNy40LDEyLjhsNS42LTUuMVY3NGwtMi42LDIuOA0KCQkJbDIuOCwzLjJjMC4xLDEuNCwwLjEsMywwLjMsNS41bC02LTUuNGwtMi45LDMuNmMxLjksNi4yLDEuMSw4LTQuNiwxMC40Yy0xLjMsNy42LDIuOSwxMC4xLDE3LjMsMTAuM2MwLjcsMiwxLjUsNC4xLDIuNiw3DQoJCQljLTQuOC0wLjMtOS4xLTAuMS0xMy4zLTAuOWMtOS45LTItMTMuNC03LjktMTEuMi0xOC4yYy0yLjgtNi0xLjItOS4xLDUuMy0xMC40bDMuNy00LjdjLTIuMy0zLjUtNC43LTYuNy02LjYtMTAuMw0KCQkJYy03LjQtMTMuOS0xLjMtMjQuMSwxNC4zLTI0LjVjMi4yLTAuMSw0LjQsMCw3LjEsMEMzMzMuNSw0NC45LDMzMi44LDQ3LjEsMzMyLjIsNDl6Ii8+DQoJPC9nPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMjMuMiw3MS4xYzAuMSw1LjEtMS42LDEyLjEtNC42LDE4LjhjLTUuNiwxMi41LTEzLjksMjMuNi0yNC4xLDMyLjdjLTAuNywwLjctMS41LDEuMy0yLjMsMS45DQoJCWMtOC43LDYuNy0xMyw2LjgtMjEuNy0wLjJjLTExLjItOS0xOS42LTIwLjItMjUuNy0zMy4xYy0zLjktOC4yLTUuOS0xNi44LTUuMS0yNS45YzEuNy0xNy45LDEwLjEtMzEuNiwyNy0zOC44DQoJCWMyMC04LjUsNDIuOSwxLjUsNTIuMywyMi41QzEyMS44LDU1LjIsMTIzLjEsNjEuNywxMjMuMiw3MS4xeiBNNDMuOSw3MS4xQzQyLDg3LjgsNTguOCwxMDIuMSw3Nyw5OS41DQoJCUM3OS40LDgyLjEsNjMuMyw2OC4yLDQzLjksNzEuMUw0My45LDcxLjF6IE04NS40LDk5LjVjMTkuMiwxLjksMzUuNi0xMi4xLDMzLjMtMjguM0MxMDAuOSw2Nyw4NC40LDgwLjksODUuNCw5OS41TDg1LjQsOTkuNXoiLz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDQwLDE4LjZoLTEuNnYtMS4xaDQuNHYxLjFoLTEuNnY0LjVINDQwVjE4LjZ6Ii8+DQoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDQzLjUsMTcuNWgxLjlsMS4zLDMuN2wwLDBsMS4zLTMuN2gxLjl2NS42aC0xLjJ2LTQuM2wwLDBsLTEuNiw0LjNoLTAuOWwtMS40LTQuM2wwLDB2NC4zaC0xLjJWMTcuNXoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K',
          displayName: 'AlienVault OTX',
          configuredDeviceCount: 0,
          description: 'This app integrates with an instance of AlienVault OTX to perform investigative actions',
          actionsCount: 5,
          time: '2022-09-24T12:22:10Z',
          token: 'JRADVCX2',
        },
      ],
    },
    GetActionTokenResponse: {
      status: true,
      message: 'Action token fetched successfully',
      data: '824',
      code: 200,
    },
    GetListExecutedResponse: {
      status: true,
      data: {
        totalElement: mockActionData,
        currentPage: 0,
        totalCount: 31,
        totalPages: 1,
      },
    },
    LunchActionResponse: {
      status: false,
      data: {
        message: 'Action launched successfully',
      },
    },
    ScheduledActionResponse: {
      status: false,
      data: {
        message: 'Action scheduled successfully',
      },
    },
    UpdateScheduledActionResponse: {
      status: false,
      data: {
        message: 'Schedule updated successfully',
      },
    },
    GetOldDataActionResponse: {
      status: false,
      data: {},
    },
    GetExecutedActionResponse: {
      status: false,
      data: {
        parameters: [],
        result: {},
        executeTime: '2024-03-20T11:00:00Z',
        scheduledTime: '2024-03-20T11:00:00Z',
        terminatedTime: '2024-03-20T11:00:00Z',
        terminatedBy: 'Admin',
        createdTime: '2024-03-20T10:00:00Z',
      },
    },
    GetActionResponse: {
      status: true,
      data: {
        token: '824',
        deviceToken: 'AFEC97R0',
        actionName: 'fileReputation',
        description: 'Queries VirusTotal for file reputation info',
        displayName: 'File Reputation',
        method: 'POST',
        tags: '[File Reputation]',
        isApproval: true,
        autoExecute: false,
        inputParam: JSON.stringify([
          {
            field: 'Hash',
            required: 'true',
            description: 'Queries VirusTotal for file reputation info',
            type: 'text',
            isValid: 'false',
            validationKey: 'Hash',
            actionField: 'Hash',
            suggestion: 'false',
            groupName: 'hash_group',
            count: 1,
            size: 128,
            value: '',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash2',
            required: 'true',
            fieldDisable: 'false',
            description: 'Additional hash field for file reputation',
            type: 'text',
            isValid: 'false',
            validationKey: 'Hash2',
            actionField: 'Hash2',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 128,
            value: '',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash3',
            required: 'true',
            fieldDisable: 'false',
            description: 'Third hash field for file reputation',
            type: 'text',
            isValid: 'false',
            validationKey: 'Hash3',
            actionField: 'Hash3',
            suggestion: 'true',
            groupName: 'hash_text_group',
            count: 1,
            size: 128,
            value: '',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash4',
            required: 'true',
            fieldDisable: 'false',
            description: 'Select hash status',
            type: 'radio',
            isValid: 'false',
            validationKey: 'Hash4',
            actionField: 'Hash4',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 128,
            value: '',
            data: [
              { name: 'Valid', value: 'valid' },
              { name: 'Invalid', value: 'invalid' },
            ],
          },
          {
            field: 'Hash5',
            required: 'true',
            fieldDisable: 'false',
            description: 'Select hash date and time',
            type: 'dateTime',
            isValid: 'false',
            validationKey: 'Hash5',
            actionField: 'Hash5',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 20,
            value: '',
          },
          {
            field: 'Hash6',
            required: 'true',
            fieldDisable: 'false',
            description: 'Enter hash count',
            type: 'long',
            isValid: 'false',
            validationKey: 'Hash6',
            actionField: 'Hash6',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 10,
            value: '',
          },
          {
            field: 'Hash7',
            required: 'true',
            fieldDisable: 'false',
            description: 'Enter hash password',
            type: 'password',
            isValid: 'false',
            validationKey: 'Hash7',
            actionField: 'Hash7',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 32,
            value: '',
          },
          {
            field: 'Hash8',
            required: 'true',
            fieldDisable: 'false',
            description: 'Select hash type',
            type: 'select',
            isValid: 'false',
            validationKey: 'Hash8',
            actionField: 'Hash8',
            suggestion: 'false',
            groupName: 'hash_text_group',
            count: 1,
            size: 50,
            value: '',
            data: [
              { name: 'MD5', value: 'md5' },
              { name: 'SHA1', value: 'sha1' },
              { name: 'SHA256', value: 'sha256' },
            ],
          },
          {
            field: 'Status',
            required: 'true',
            description: 'Select the status',
            type: 'select',
            isValid: 'false',
            validationKey: 'Status',
            suggestion: 'false',
            groupName: 'status_group',
            count: 1,
            size: 50,
            value: '',
            data: [
              { name: 'Active', value: 'active' },
              { name: 'Inactive', value: 'inactive' },
            ],
          },
          {
            field: 'dateTime',
            required: 'true',
            description: 'Select date and time',
            type: 'dateTime',
            isValid: 'false',
            validationKey: 'DateTime',
            suggestion: 'false',
            groupName: 'datetime_group',
            count: 1,
            size: 20,
            value: '',
          },
          {
            field: 'Password',
            required: 'true',
            description: 'Enter your password',
            type: 'password',
            isValid: 'false',
            validationKey: 'Password',
            suggestion: 'false',
            groupName: 'password_group',
            count: 1,
            size: 32,
            value: 'passwordValue',
          },
          {
            field: 'Amount',
            required: 'true',
            description: 'Enter amount',
            type: 'long',
            isValid: 'false',
            validationKey: 'Amount',
            suggestion: 'false',
            groupName: 'amount_group',
            count: 1,
            size: 10,
            value: 'longValue',
          },
          {
            field: 'Gender',
            required: 'true',
            description: 'Select gender',
            type: 'radio',
            isValid: 'false',
            validationKey: 'Gender',
            suggestion: 'false',
            groupName: 'gender_group',
            count: 1,
            size: 10,
            value: '',
            data: [
              { name: 'Male', value: 'male' },
              { name: 'Female', value: 'female' },
            ],
          },
          {
            field: 'Hash3',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'true',
            groupName: 'textGroup',
            count: 1,
            size: 100,
            value: '',
          },
          {
            field: 'Password2',
            required: 'true',
            description: 'Enter your password',
            type: 'password',
            isValid: 'false',
            validationKey: 'Password2',
            suggestion: 'false',
            groupName: 'password2_group',
            count: 1,
            size: 32,
            value: 'passwordValue2',
          },
          {
            field: 'Hash9',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'false',
            groupName: 'textGroup1',
            count: 1,
            size: 100,
          },
          {
            field: 'Hash10',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'false',
            groupName: 'textGroup2',
            count: 1,
            size: 100,
            value: 'abcdeabcdeabcdeabcdeabcdeabcde12',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
          {
            field: 'Hash10',
            required: 'false',
            fieldDisable: 'false',
            description: 'Enter text input',
            type: 'text',
            isValid: 'false',
            validationKey: 'TextInput',
            actionField: 'TextInput',
            suggestion: 'false',
            groupName: 'textGroup3',
            count: 1,
            size: 100,
            value: 'abcdeabcdeabcdeabcde',
            regex: '(\\b[a-f\\d]{32}\\b)|(\\b[a-f\\d]{40}\\b)|(\\b[a-f\\d]{56}\\b)|(\\b[a-f\\d]{64}\\b)|(\\b[a-f\\d]{96}\\b)|(\\b[a-f\\d]{128}\\b)',
          },
        ]),
        suggectionField: [
          {
            Hash3: [],
          },
        ],
      },
    },
    CancelActionResponse: {
      status: false,
      data: {
        message: 'Action cancelled successfully',
      },
    },
    GetTemplateForReportIncidentResponse: {
      status: false,
      data: {
        template: 'Report template data',
      },
    },
  },
  Incident: {
    incidentReportReportTempResponse: {
      status: false,
      data: {
        template: 'Incident report template',
      },
    },
    getMailRecipientResponse: {
      status: false,
      data: [
        {
          email: 'test@example.com',
        },
      ],
    },
  },
};

const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  ActionEkasha,
  { ...props, IncidentId: 1 },
  initialState,
  {
    ...contextValue,
    customerID: 'Customer_1',
    tableView: false,
    setTableView: jest.fn(),
  },
);

describe('SearchByAppsOrAction Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('U_TOKENS', JSON.stringify({ userToken: 'm33b2e747' }));
    localStorage.setItem('customerID', 'Customer_1');
    localStorage.setItem('serverTimezone', 'Asia/Kolkata');
    setPermissions(handlePermission('RW', 'incidents', 'action'));
  });

  describe('Initial Rendering - search by action with Actions', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
    });

    it('should render search by action section', () => {
      const searchByApps = getById('incident_action_searchByAppsOrAction_wrapper');
      expect(searchByApps).toBeInTheDocument();
    });

    it('Should handle search input change in action', async () => {
      const searchByAction = getById('incident_action_searchByAppsOrAction_searchIcn');
      fireEvent.click(searchByAction);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const searchInput = getById('incident_action_searchByAppsOrAction_device_list_search');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      expect(searchInput.value).toBe('admin');
      // Wait for debounce
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle search clear in action', async () => {
      const searchByAction = getById('incident_action_searchByAppsOrAction_searchIcn');
      fireEvent.click(searchByAction);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const searchInput = getById('incident_action_searchByAppsOrAction_device_list_search');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const clearButton = getById('ekasha_searchInput_clearSearch_incident_action_searchByAppsOrAction_device_list_search');
      fireEvent.click(clearButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      expect(searchInput.value).toBe('');
    });

    it('should render search action and click on close icon in action', async () => {
      const searchByAction = getById('incident_action_searchByAppsOrAction_searchIcn');
      fireEvent.click(searchByAction);
      const searchByActionClose = getById('incident_action_searchByAppsOrAction_searchCloseBtn');
      fireEvent.click(searchByActionClose);
    });

    it('should render apps by action click ', async () => {
      const searchByAppClick = getById('incident_action_searchByAction_collapseTask');
      fireEvent.click(searchByAppClick);
    });
  });

  describe('Initial Rendering - search by action with Apps', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
    });

    it('Should handle search input change in apps by action', async () => {
      const searchByActionApps = getById('incident_action_searchByAppsOrAction_assetsSearch');
      fireEvent.click(searchByActionApps);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const searchInput = getById('incident_action_searchByAppsOrAction_searchFilterDevice');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      expect(searchInput.value).toBe('admin');
      // Wait for debounce
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });

    it('Should handle search clear in apps by action', async () => {
      const searchByActionApps = getById('incident_action_searchByAppsOrAction_assetsSearch');
      fireEvent.click(searchByActionApps);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const searchInput = getById('incident_action_searchByAppsOrAction_searchFilterDevice');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const clearButton = getById('ekasha_searchInput_clearSearch_incident_action_searchByAppsOrAction_searchFilterDevice');
      fireEvent.click(clearButton);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      expect(searchInput.value).toBe('');
    });

    it('should render search action and click on close icon in apps by action', async () => {
      const searchByActionApps = getById('incident_action_searchByAppsOrAction_assetsSearch');
      fireEvent.click(searchByActionApps);
      const searchByActionClose = getById('incident_action_searchByAppsOrAction_filterDeviceSearchCloseBtn');
      fireEvent.click(searchByActionClose);
    });

    it('should render apps by Device click ', async () => {
      const searchByDeviceClick = getById('incident_action_searchByAction_getActionMethod');
      fireEvent.click(searchByDeviceClick);
    });
  });

  describe('Initial Rendering - search by Apps with Device', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
    });

    it('Should handle search input change in apps by Device', async () => {
      const searchByAppsDevice = getById('incident_action_searchByAppsOrAction_toggleSearch');
      fireEvent.click(searchByAppsDevice);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const searchInput = getById('incident_action_searchByAppsOrAction_actionBodySearch');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      expect(searchInput.value).toBe('admin');
    });

    it('Should handle search clear in apps by Device', async () => {
      const searchByAppsDevice = getById('incident_action_searchByAppsOrAction_toggleSearch');
      fireEvent.click(searchByAppsDevice);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      const searchInput = getById('incident_action_searchByAppsOrAction_actionBodySearch');
      fireEvent.change(searchInput, { target: { value: 'admin' } });
      const clearButton = getById('ekasha_searchInput_clearSearch_incident_action_searchByAppsOrAction_actionBodySearch');
      fireEvent.click(clearButton);
      expect(searchInput.value).toBe('');
    });

    it('should render search action and click on close icon in apps by Device', async () => {
      const searchByAppsDevice = getById('incident_action_searchByAppsOrAction_toggleSearch');
      fireEvent.click(searchByAppsDevice);
      const searchByActionClose = getById('incident_action_searchByAppsOrAction_actionBodySearchClose');
      fireEvent.click(searchByActionClose);
    });

    it('should render Device by Field click ', async () => {
      const searchByFieldClick = getById('incident_action_searchByAppsOrAction_getParam');
      fireEvent.click(searchByFieldClick);
      fireEvent.click(searchByFieldClick);
    });
  });

  describe('should render parameter section', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
    });
    it('should render date time picker', () => {
      const dateTimePicker = getById('incident_action_searchByAppsOrAction_fields_Date_Time3');
      fireEvent.change(dateTimePicker, { target: { value: moment(new Date()).format() } });
    });
    it('should render text, password, long input', () => {
      const inputChange = getById('incident_action_searchByAppsOrAction_fields_Normal_pass_input_10');
      fireEvent.change(inputChange, { target: { value: '' } });
    });
    it('should render text, password, long input', () => {
      const inputChange = getById('incident_action_searchByAppsOrAction_fields_Normal_pass_input_10');
      fireEvent.change(inputChange, { target: { value: 'asdsdasd' } });
    });
    it('should render select dropdown', () => {
      selectOption('incident_action_searchByAppsOrAction_fields_Normal_Select_Data2', 'Active');
    });
    it('should render with suggestion true and text filed', () => {
      const suggestionFieldTextInput = getById('incident_action_searchByAppsOrAction_fields_suggest70');
      fireEvent.change(suggestionFieldTextInput, { target: { value: 'asdsdasd' } });
    });
    it('should render with radio button select text after show input', () => {
      const jsonRadio = getById('Radio_Name_incident_action_searchByAppsOrAction_fields_Normal_Radio_button6_Text');
      fireEvent.click(jsonRadio);
      const radioTextInput = getById('incident_action_searchByAppsOrAction_fields_Normal_Text_Input6');
      fireEvent.change(radioTextInput, { target: { value: 'asdsdasd' } });
    });
  });

  describe('should render parameter section deviceData.requireParam[type].length > 1', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
    });
    it('should render date time picker', () => {
      const launchBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      const dateTimePicker = getById('incident_action_searchByAppsOrAction_fields_Normal_DateTime_Picker3');
      fireEvent.change(dateTimePicker, { target: { value: moment(new Date()).format() } });
      fireEvent.click(launchBtn);
    });
    it('should render text, password, long input', () => {
      const launchBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      const inputChange = getById('incident_action_searchByAppsOrAction_fields_Normal_Pass_input_Text4');
      fireEvent.change(inputChange, { target: { value: 'asdsdasd' } });
      fireEvent.click(launchBtn);
    });
    it('should render select dropdown', () => {
      const launchBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      selectOption('incident_action_searchByAppsOrAction_fields_Normal_Select6', 'MD5');
      fireEvent.click(launchBtn);
    });
    it('should render with suggestion true and text filed', () => {
      const launchBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      const suggestionFieldTextInput = getById('incident_action_searchByAppsOrAction_fields_suggest_10');
      fireEvent.change(suggestionFieldTextInput, { target: { value: 'asdsdasd' } });
      fireEvent.click(launchBtn);
    });
    it('should render with radio button select text after show input', () => {
      const launchBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      const jsonRadio = getById('Radio_Name_incident_action_searchByAppsOrAction_fields_Radio_Button2_Text');
      fireEvent.click(jsonRadio);
      const radioTextInput = getById('incident_action_searchByAppsOrAction_fields_Checked_Input2');
      fireEvent.change(radioTextInput, { target: { value: 'asdsdasd' } });
      fireEvent.click(launchBtn);
    });
  });

  describe('should render parameter section with suggestion fileds', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetActionResponse.data.suggectionField = [
        {
          Hash3: [{ name: 'dds', value: 'sdsdds' }],
        },
      ];
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
    });
    it('should render with suggestion true and autocomplete filed', () => {
      const launchBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      const suggestionFieldAutocompleteInput = getById('incident_action_searchByAppsOrAction_fields_Normal_AutoComplete_Select70');
      fireEvent.change(suggestionFieldAutocompleteInput, { target: { value: 'asdsdasd' } });
      fireEvent.click(launchBtn);
    });
    it('should render with suggestion true and autocomplete filed deviceData.requireParam[type].length > 1', () => {
      const launchBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      const suggestionFieldAutocompleteInput = getById('incident_action_searchByAppsOrAction_fields_Auto_Complete_Select10');
      fireEvent.change(suggestionFieldAutocompleteInput, { target: { value: 'asdsdasd' } });
      fireEvent.click(launchBtn);
    });
  });

  describe('Launch Action with password input', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      const inputParam = JSON.parse(initial.IncdentAction.GetActionResponse.data.inputParam);
      const index = inputParam.findIndex((e) => e.field === 'Password2');
      if (index !== -1) {
        inputParam[index].value = 'passwordValue';
      }
      initial.IncdentAction.GetActionResponse.data.inputParam = JSON.stringify(inputParam);
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
    });

    it('Should handle password input', async () => {
      const passInput2 = getById('incident_action_searchByAppsOrAction_fields_Normal_Pass_input_Text5');
      fireEvent.change(passInput2, { target: { value: 'passwordValue' } });
      const submitBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
  });
  describe('Launch Action with proper data', () => {
    beforeEach(async () => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.IncdentAction.GetActionResponse.data.inputParam = JSON.stringify([{
        field: 'Hash',
        required: 'true',
        description: 'Queries VirusTotal for file reputation info',
        type: 'text',
        isValid: 'false',
        validationKey: 'Hash',
        actionField: 'Hash',
        suggestion: 'false',
        groupName: 'hash_group',
        count: 1,
        size: 128,
        value: '',
      }]);
      setUp(rerunProps, initial);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
      const searchByFieldClick = getById('incident_action_searchByAppsOrAction_getParam');
      fireEvent.click(searchByFieldClick);
      const passInput2 = getById('incident_action_searchByAppsOrAction_fields_Normal_pass_input_0');
      fireEvent.change(passInput2, { target: { value: 'passwordValue' } });
      const submitBtn = getById('incident_action_searchByAppsOrAction_launch_btn');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
    it('Should handle date-time picker change with value and submit button click', async () => {
      const submitBtn = getById('launch_incident_action_generate');

      const datePicker2 = getById('launch_schedule_incident_action');
      fireEvent.change(datePicker2, { target: { value: moment(new Date()).add(1, 'days').format() } });
      fireEvent.click(submitBtn);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
    it('Should handle submit button click with action token empty', async () => {
      const checkbox = getById('launch_run_now_Incdent_action');
      fireEvent.click(checkbox);

      const submitBtn = getById('launch_incident_action_generate');
      fireEvent.click(submitBtn);
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    });
    it('Should close modal when clicking close button', async () => {
      const closeButton = getById('ekasha_model_close_launch_incident_action_model');
      fireEvent.click(closeButton);
      expect(screen.queryByText('Launch Action')).not.toBeInTheDocument();
    });
  });

  describe('should render search by Apps section', () => {
    beforeEach(() => {
      setUp(rerunProps, initialData);
      const rerunBtn = getById('incident_action_add');
      fireEvent.click(rerunBtn);
      const selectOption1 = (id, option) => {
        fireEvent.mouseDown(getById(id));
        const options = screen.getAllByText(option);
        fireEvent.click(options[1]);
      };
      selectOption1('incident_actions_fields', 'Search By Apps');
    });
    it('should render device and Apps section', () => {
      const searchByFieldClick = getById('incident_action_searchByAppsOrAction_getParam');
      fireEvent.click(searchByFieldClick);

      const searchByAppDeviceClick = getById('incident_action_searchByApps_getActionMethod');
      fireEvent.click(searchByAppDeviceClick);

      const searchByAppActionClick = getById('incident_action_searchByApps_collapseTask');
      fireEvent.click(searchByAppActionClick);

      const backButton = getById('incident_actions_backBtn');
      fireEvent.click(backButton);
    });
  });

  describe('Response Handling', () => {
    it('Should handle failed GetActionListResponse response', () => {
      const failedState = {
        ...initialData,
        IncdentAction: {
          ...initialData.IncdentAction,
          GetActionListResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
    it('Should handle failed GetActionDeviceListResponse response', () => {
      const failedState = {
        ...initialData,
        IncdentAction: {
          ...initialData.IncdentAction,
          GetActionDeviceListResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
    it('Should handle failed GetActionTokenResponse response', () => {
      const failedState = {
        ...initialData,
        IncdentAction: {
          ...initialData.IncdentAction,
          GetActionTokenResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
    it('Should handle failed GetListExecutedResponse response', () => {
      const failedState = {
        ...initialData,
        IncdentAction: {
          ...initialData.IncdentAction,
          GetListExecutedResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
    it('Should handle failed GetActionResponse response', () => {
      const failedState = {
        ...initialData,
        IncdentAction: {
          ...initialData.IncdentAction,
          GetActionResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
    it('Should handle failed GetListAssetResponse response', () => {
      const failedState = {
        ...initialData,
        APPS: {
          ...initialData.APPS,
          GetListAssetResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
    it('Should handle failed GetDeviceActionResponse response', () => {
      const failedState = {
        ...initialData,
        APPS: {
          ...initialData.APPS,
          GetDeviceActionResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
    it('Should handle failed GetAllConfiguresResponse response', () => {
      const failedState = {
        ...initialData,
        APPS: {
          ...initialData.APPS,
          GetAllConfiguresResponse: {
            status: false,
            data: null,
          },
        },
      };
      setUp(rerunProps, failedState);
      const addButton = getById('incident_action_add');
      fireEvent.click(addButton);
    });
  });
});

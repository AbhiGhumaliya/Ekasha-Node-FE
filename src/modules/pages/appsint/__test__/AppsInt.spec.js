import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { handlePermission } from '../../../../helpers/lib/testUtils';
import { setPermissions } from '../../../../helpers/lib/StorageHandlers';
import { renderComponent, getById } from '../../../../helpers/lib/RTL';
import AppIntEkasha from '../../../containers/appint';
import {
  getAllConfiguredAction, fakeActionApps, getByAppsDeviceAction, getListAsset,
  deleteIntegration, getProxyDevice, addIntegration, getAllAppsTagsListAction,
  getIntegration, updateIntegration, getAllSmtpList,
  filterSearchAppsAction, ActionStatusUpdateAction,
} from '../../../../apis/appinit/actions';

jest.useFakeTimers();
jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ height: 600, width: 800 }));

const getAllTagsList = {
  code: 200,
  message: 'Get tags data.',
  status: true,
  data: [
    { tagName: 'Reputation', status: false },
    { tagName: 'SMTP', status: false },
    { tagName: ' Mail', status: false },
    { tagName: 'Response', status: false },
    { tagName: ' Investigate', status: false },
    { tagName: ' AD', status: false },
    { tagName: ' Windows', status: false },
    { tagName: 'URL Reputation', status: false },
    { tagName: 'Email Reputation', status: false },
    { tagName: 'File Reputation', status: false },
    { tagName: 'Domain Reputation', status: false },
    { tagName: 'IP Reputation', status: false },
    { tagName: 'Test Connectivity', status: false },
    { tagName: 'Report Incident', status: false },
  ],
};
const searchApp = {
  code: 200,
  message: 'Get all devices.',
  status: true,
  data: [
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
      appLogo: 'PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MzMuMjkgMTQyLjM3Ij48dGl0bGU+U01UUDwvdGl0bGU+PHBvbHlnb24gcG9pbnRzPSIxMDguMzkgMTQyLjM3IDEyOC42NSA2MC40OCA1MC42NCA4NS4wNSAxNy4yNCAzMy43NiAwIDkxLjMgMTA4LjM5IDE0Mi4zNyIgZmlsbD0iIzMxNTVhNCIvPjxwb2x5Z29uIHBvaW50cz0iMjQuMTQgMjkuOTUgNTIuMDEgNzYuNSAxMjUuNTYgNTQuMDkgMjQuMTQgMjkuOTUiIGZpbGw9IiM5Mzk3OWYiLz48cG9seWdvbiBwb2ludHM9IjY2LjA4IDkuODggNzMgNDAuODUgNTAuMzMgMzUuNDYgNjYuMDggOS44OCIgZmlsbD0iIzMxNTVhNCIvPjxwb2x5Z29uIHBvaW50cz0iNzEuOTcgNS43MyAxNTIuODYgNTEuMjcgMTI1LjU2IDUzIDc4Ljk1IDQxLjkxIDcxLjk3IDUuNzMiIGZpbGw9IiM5Mzk3OWYiLz48cG9seWdvbiBwb2ludHM9IjEyOS4wMyA2MC40OCAxNTUuOTEgNTcuNzMgMTIwLjE5IDEyMi43NiAxMTQuNyAxMTguNCAxMjkuMDMgNjAuNDgiIGZpbGw9IiMzMTU1YTQiLz48cG9seWdvbiBwb2ludHM9IjEwOC40MiAxNC4xNSAxMTUuNiA1LjUzIDEyOC42NSAxMyAxMjEuMTYgMjAuODUgMTA4LjQyIDE0LjE1IiBmaWxsPSIjMzE1NWE0Ii8+PHBvbHlnb24gcG9pbnRzPSIxMjkuMzUgMTIuOSAxMzYuNTQgNC4yOCAxNDkuNTkgMTEuNzUgMTQyLjA5IDE5LjYgMTI5LjM1IDEyLjkiIGZpbGw9IiMzMTU1YTQiLz48cG9seWdvbiBwb2ludHM9IjEzNS4zMSAyOS40NyAxNDIuNDkgMjAuODUgMTU1LjU0IDI4LjMyIDE0OC4wNCAzNi4xOCAxMzUuMzEgMjkuNDciIGZpbGw9IiMzMTU1YTQiLz48cG9seWdvbiBwb2ludHM9IjE1Ny4xNiAyNy44MiAxNjQuMzQgMTkuMiAxNzcuMzkgMjYuNjcgMTY5LjkgMzQuNTIgMTU3LjE2IDI3LjgyIiBmaWxsPSIjMzE1NWE0Ii8+PHBvbHlnb24gcG9pbnRzPSIxNTEuNTYgOS40MSAxNTguNzUgMC43OSAxNzEuNzkgOC4yNiAxNjQuMyAxNi4xMSAxNTEuNTYgOS40MSIgZmlsbD0iIzMxNTVhNCIvPjxwb2x5Z29uIHBvaW50cz0iMTc1LjkzIDguNjIgMTgzLjExIDAgMTk2LjE2IDcuNDcgMTg4LjY2IDE1LjMyIDE3NS45MyA4LjYyIiBmaWxsPSIjMzE1NWE0Ii8+PHBhdGggZD0iTTI1Ni4xNyw4MC4yNHYyYzAsMTMuNzEtLjA3LDI3LjQzLDAsNDEuMTQsMCwxLjkyLS41NywyLjM1LTIuMzQsMi4yN2E4OC4zNyw4OC4zNywwLDAsMC05LjM1LDBjLTIsLjEzLTIuMDYtLjg4LTIuMDYtMi4zN3EwLTI3LjYzLDAtNTUuMjdjMC0yLjcxLjA3LTUuNDEsMC04LjExLS4wNi0xLjU5LjQxLTIuMjMsMi4xLTIuMiw0LjQzLjA3LDguODYsMCwxMy4yOS0uMDZhMy43NSwzLjc1LDAsMCwxLDMuNjQsMi41NFEyNjksNzYuMSwyNzYuNjEsOTJjLjUsMSwxLjA1LDIuMDYsMS44MSwzLjU0Ljg0LTEuNSwxLjUyLTIuNTYsMi4wNy0zLjY5LDUuMDktMTAuNDUsMTAuMi0yMC44OCwxNS4yLTMxLjM3QTQuMTgsNC4xOCwwLDAsMSwzMDAsNTcuNjlxNi40NC4xNSwxMi44OCwwYzEuNDIsMCwyLC4zMiwyLDEuODJxLS4wNiwzMi4yMiwwLDY0LjQyYzAsMS40My0uNDEsMS45Mi0xLjkyLDEuODVhNzYuNzYsNzYuNzYsMCwwLDAtOS4zNSwwYy0yLjEuMTYtMi41Ny0uNTUtMi41Ni0yLjUxLjA4LTEzLjU3LjA2LTI3LjE1LjA2LTQwLjczLDAtLjcyLS4wNy0xLjQ0LS4xMS0yLjE2bC0uNTYtLjE4Yy0uNDQuNy0uOTEsMS4zNy0xLjI5LDIuMS00Ljg1LDkuMTYtOS43MSwxOC4zMS0xNC41LDI3LjUtLjg0LDEuNjMtMiwyLjA3LTMuNzUsMi4zMy01LjI3Ljc5LTguMTgtMS0xMC40My02LjE0LTMuNzUtOC42NS04LjY0LTE2LjgxLTEzLjA2LTI1LjE3YTQuMTEsNC4xMSwwLDAsMC0uNjUtLjc0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuODUgLTguMjkpIiBmaWxsPSIjOTE5NjlmIi8+PHBhdGggZD0iTTQzMy43Myw2Ni40Yy00LjUtNS45LTExLTguMTgtMTguMjItOC4zNi05LjA2LS4yMy0xOC4xNC0uMjMtMjcuMjEtLjMxLTIuNzgsMC0yLjc5LDAtMi43OSwyLjdxMCwzMS41OSwwLDYzLjE3YTE5LjY2LDE5LjY2LDAsMCwwLC4yMiwyLjA1YzQuMDcsMCw3Ljk0LS4wOSwxMS44LDAsMS43MiwwLDIuMDctLjU2LDIuMDUtMi4xNS0uMDgtNi43MiwwLTEzLjQ0LS4wOC0yMC4xNiwwLTEuODQuNS0yLjMxLDIuMzItMi4zMyw1LjY3LS4wNiwxMS4zOS4xLDE3LS42MUM0MzguMzUsOTgsNDQyLjU4LDc4LDQzMy43Myw2Ni40Wk00MTQuOTIsOTAuM2MtNSwuMzUtMTAuMDcuMDctMTUuMjMuMDdWNjguNjJjNS4zOSwwLDEwLjYtLjQsMTUuNzIuMSw1LjY4LjU2LDguODQsNS4xMyw4LjY1LDExLjI4QzQyMy44OSw4NS42MSw0MjAuMzMsODkuOTIsNDE0LjkyLDkwLjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNC44NSAtOC4yOSkiIGZpbGw9IiM5MTk2OWYiLz48cGF0aCBkPSJNMTgwLjg1LDEwOWMyLjI1LDEuMTIsNC4xNywyLjE3LDYuMTYsMy4wNiw3LjcsMy40NCwxNS44MywzLjczLDI0LDNhNi41Niw2LjU2LDAsMCwwLDYuMTQtNS4zNCw3LDcsMCwwLDAtMy4yMS04LjA4LDY0LjI1LDY0LjI1LDAsMCwwLTgtMy44NWMtNS4xNS0yLjE5LTEwLjQyLTQuMS0xNS41MS02LjQzLTYuNzEtMy4wNy0xMC4zMi04LjM5LTEwLjM0LTE1Ljg3LDAtNy4yNSw0LTExLjksMTAtMTUuMjRzMTIuNjUtMy43NCwxOS4zNS0zLjQ1YTU0LjI1LDU0LjI1LDAsMCwxLDE2Ljc1LDMuNzFjMS4xNi40MywxLjY2LDEsMS4yMywyLjM0LS44OCwyLjc2LTEuNjcsNS41Ni0yLjQ3LDguMzUtLjM3LDEuMy0uNzUsMS44LTIuMjgsMUEzNC44NSwzNC44NSwwLDAsMCwyMDEsNjguMTJjLTMuNTcuNTItNi4zMiwyLjk0LTYuOCw2LS41OSwzLjgyLjc5LDYuNDQsNC41Miw4LjE1LDIuMzIsMS4wNyw0Ljc1LDEuODksNy4xLDIuOSw1LjcxLDIuNDQsMTEuNjcsNC40NCwxNy4wNSw3LjQ3LDExLjgsNi42NywxMS40MiwyMy41NC0uMzgsMzAuMTdhMzAuMTYsMzAuMTYsMCwwLDEtMTMuMjMsMy44Yy0xMC4xNi41Ni0yMC0uNzQtMjkuMzktNS0xLjM3LS42Mi0xLjg5LTEuMjEtMS40Mi0yLjhDMTc5LjM4LDExNS43NywxODAsMTEyLjU4LDE4MC44NSwxMDlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNC44NSAtOC4yOSkiIGZpbGw9IiM5MTk2OWYiLz48cGF0aCBkPSJNMzQzLjE0LDEyNS41OVY2OC40MWMtLjksMC0xLjY0LS4xMy0yLjM4LS4xMy01LjE5LDAtMTAuMzksMC0xNS41OCwwLTEuMjQsMC0xLjkxLS4yMS0xLjc5LTEuNzMuMTgtMi4yLjEzLTQuNDMuMS02LjY1YTEuODcsMS44NywwLDAsMSwyLTIuMTRjLjU1LDAsMS4xMS0uMDYsMS42Ni0uMDYsMTUuNzksMCwzMS41OSwwLDQ3LjM4LS4wNSwyLjE3LDAsMi44LjY3LDIuNjEsMi43MmEyOC45MSwyOC45MSwwLDAsMCwwLDUuMThjLjE5LDItLjQ0LDIuNzktMi42MiwyLjcyLTQuOTEtLjE2LTkuODQsMC0xNC43NS0uMDktMi4wNy0uMDYtMi41Mi42OC0yLjUxLDIuNjIuMDcsMTcuMzgsMCwzNC43Ny4wOSw1Mi4xNiwwLDIuMDctLjUyLDIuNzctMi42NywyLjY3QzM1MC45MiwxMjUuNDYsMzQ3LjE5LDEyNS41OSwzNDMuMTQsMTI1LjU5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuODUgLTguMjkpIiBmaWxsPSIjOTE5NjlmIi8+PC9zdmc+',
      displayName: 'SMTP',
      configuredDeviceCount: 0,
      description: 'SMTP is used to send emails',
      actionsCount: 2,
      time: '2022-09-09T10:19:04Z',
      token: 'QFE097RO',
    },
    {
      isConfigured: false,
      appLogo: 'PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHRpdGxlPkFjdGl2ZSBEaXJlY3Rvcnk8L3RpdGxlPjxwYXRoIGQ9Ik0zMi4wNiwxOS4xN2MyLjU2LDAsNS4xMywwLDcuNjksMCwuNjYsMCwxLC4xLDEsLjg4cS0uMDYsNi44MSwwLDEzLjYzYzAsLjc3LS4yMi44OC0uOTMuOHEtNy43Ni0uOS0xNS41LTEuNjljLS42NC0uMDctLjg3LS4yNC0uODYtLjkycTAtNS45NCwwLTExLjg3YzAtLjY4LjE2LS44Ni44NC0uODUsMi42LDAsNS4yLDAsNy44MSwwWiIgZmlsbD0iIzM4NjVhZSIvPjxwYXRoIGQ9Ik0zMiwxOC41MWMtMi41NywwLTUuMTMsMC03LjY5LDAtLjczLDAtLjkxLS4xOS0uOS0uOXEwLTUuODgsMC0xMS43NmMwLS42NC4xNS0uOS44Mi0xcTcuOS0uODMsMTUuODItMS43MmMuNDktLjA2LjY1LjA2LjY1LjU2cTAsNy4wOCwwLDE0LjE3YzAsLjc0LS40OS41OS0uOS41OUgzMloiIGZpbGw9IiMzODY1YWUiLz48cGF0aCBkPSJNMTYuMDcsMTkuMTdjMiwwLDQsMCw1LjkzLDAsLjYzLDAsLjc5LjE3Ljc5Ljc5cTAsNiwwLDEyYzAsLjYtLjE5LjczLS43NS42N3EtNi4xLS42OS0xMi4yMi0xLjMzYy0uNDUsMC0uNTItLjI0LS41Mi0uNjMsMC0zLjYyLDAtNy4yNSwwLTEwLjg3LDAtLjYxLjI5LS42Mi43NC0uNjIsMiwwLDQsMCw2LDBaIiBmaWxsPSIjMzg2NWFlIi8+PHBhdGggZD0iTTIyLjc4LDExLjg2YzAsMS45NCwwLDMuODgsMCw1LjgyLDAsLjU3LS4wNy44NC0uNzUuODNxLTYsMC0xMiwwYy0uNjMsMC0uNzgtLjE5LS43OC0uOCwwLTMuNDgsMC02Ljk1LDAtMTAuNDMsMC0uNjIuMTMtLjg1LjgzLS45MkMxMy44Niw2LDE3LjYsNS41NiwyMS4zNCw1LjEzLDIyLjc4LDUsMjIuNzgsNSwyMi43OCw2LjM3WiIgZmlsbD0iIzM4NjVhZSIvPjxwYXRoIGQ9Ik04Ljg2LDQ1LjJjLjU3LTIuMTMsMS4wNy00LDEuNTgtNS44NS4wOC0uMzIuMTgtLjYzLjI3LTFzLjUtLjM3LjgtLjM0Yy41LDAsLjI4LjQzLjIxLjY3LS42OSwyLjQ2LTEuNDIsNC45LTIuMSw3LjM2YS42Ny42NywwLDAsMS0uNzUuNTljLS40OSwwLS42OS0uMTctLjgyLS42NGE1NC40MSw1NC40MSwwLDAsMC0xLjg0LTUuNzNxLS43NiwyLjctMS41NCw1LjRjLS4xNC40Ni0uMTQsMS0uOTIsMXMtLjcxLS41LS44NC0uOTJDMi4yMiw0My41LDEuNTQsNDEuMjMuODksMzljLS4wNy0uMjYtLjUxLS43Mi4xMS0uODguNDctLjEzLjgsMCwxLC41OS41NSwyLjEyLDEuMTcsNC4yMSwxLjgzLDYuNTNsMS44Ni02LjM4Yy4xMi0uMzguMTUtLjc3LjczLS43OHMuNTguNDQuNjkuOEM3LjY0LDQwLjg3LDguMjEsNDIuOTEsOC44Niw0NS4yWiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik00Mi4yOCw0NS40NWMuNDQtMS41NS44NC0yLjgxLDEuMTQtNC4wOC4xMy0uNTUuMjktMSwuOS0uNzVzLjA4LjcsMCwxYy0uMzgsMS40NS0uODQsMi44OC0xLjI4LDQuMzEtLjExLjM5LS4xNy43Ni0uNzUuNzZzLS42Ni0uMzItLjc4LS43MmEyMy44OCwyMy44OCwwLDAsMC0xLjI3LTMuNjFjLS4zNywxLjIxLS43NSwyLjQyLTEuMTMsMy42My0uMTEuMzUtLjE4LjY2LS42OC43cy0uNy0uMy0uODEtLjY4Yy0uNDktMS41Ny0xLTMuMTUtMS40Mi00LjczLS4wNi0uMi0uNDItLjU3LjE0LS42Ni4zNi0uMDYuNy0uMS44NC40MmEyNC42MiwyNC42MiwwLDAsMCwxLjM2LDRjLjM4LTEuMjMuNzctMi40NiwxLjE2LTMuNy4xMi0uMzguMTUtLjc5LjcyLS44cy41OS40My42OS44QzQxLjQ3LDQyLjY0LDQxLjg0LDQzLjksNDIuMjgsNDUuNDVaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTI3LjksMzguMjJjMC0uMzcsMC0uNjMtLjUzLS42MnMtLjU1LjI0LS41NC42MmMwLC45MiwwLDEuODMsMCwyLjkyYTMuMjMsMy4yMywwLDAsMC0xLjczLS43M2MtMi4wOCwwLTMuNDUsMi0yLjg2LDQuMzJhMi40OSwyLjQ5LDAsMCwwLDQuMDcsMS41NWMuMzItLjIxLjQ3LS40My41OC4xNi4wNi4zNi40OS4yMi43Ni4ycy4yNC0uMzEuMjQtLjUxUTI3Ljg5LDQyLjE3LDI3LjksMzguMjJabS0yLDcuNDhhMS43NCwxLjc0LDAsMCwxLTIuMjUtLjQ1LDMsMywwLDAsMSwuMjMtMy40NSwxLjcyLDEuNzIsMCwwLDEsMi4yOS0uMTMsMS44NywxLjg3LDAsMCwxLC42NSwxLjg0QTIuMSwyLjEsMCwwLDEsMjUuOSw0NS43WiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik0zMi40NCw0MC40MmEyLjk0LDIuOTQsMCwwLDAtMy4xNSwzLjI0LDIuODMsMi44MywwLDAsMCwzLDMuMTVjMiwwLDMuMTEtMS4xNiwzLjExLTMuMjRTMzQuMzMsNDAuNDIsMzIuNDQsNDAuNDJabTAsNS41YTIuMDYsMi4wNiwwLDAsMS0yLjEtMi4yOCwyLjEsMi4xLDAsMCwxLDIuMDctMi4zM2MxLjI1LDAsMiwuODksMiwyLjM1UzMzLjYyLDQ1LjkxLDMyLjQsNDUuOTJaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTIwLjg3LDQ0LjI2YzAsLjUxLDAsMSwwLDEuNTQsMCwuMzIuMy44Ni0uNDUuODdzLS41LS41Ni0uNTItLjkzYzAtLjg4LDAtMS43NiwwLTIuNjQtLjA1LTEuMjMtLjU1LTEuODEtMS40Ni0xLjc5YTEuNzEsMS43MSwwLDAsMC0xLjYxLDEuODZjMCwuOTIsMCwxLjg0LDAsMi43NSwwLC4zNi4wOC43My0uNS43NnMtLjU2LS4yOS0uNTYtLjY5YzAtMS42MSwwLTMuMjIsMC00LjgzLDAtLjg3Ljc1LS43LjkxLS40NC4zMy41Ny40Ny4zMi44My4wOWEyLjA3LDIuMDcsMCwwLDEsMy4zNiwxLjY5YzAsLjU5LDAsMS4xNywwLDEuNzZaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTQ1LjMxLDQ1LjQ2YTMuMzUsMy4zNSwwLDAsMCwyLjE4LjQyLjc3Ljc3LDAsMCwwLC4zLTEuNDdjLS41NS0uMjktMS4xMy0uNTEtMS42OS0uNzhhMS40OCwxLjQ4LDAsMCwxLS45LTEuNSwxLjYxLDEuNjEsMCwwLDEsMS0xLjQzLDMuNTcsMy41NywwLDAsMSwyLS4yNWMuNy4wOC45NC40NC43MiwxLjEyYTEyLjg5LDEyLjg5LDAsMCwwLTEuNi0uMjRjLS40OCwwLTEsLjEtMS4wOC43cy4yOS43OS43MSwxLC45NC40LDEuNC42MmExLjUxLDEuNTEsMCwwLDEsLjkxLDEuNSwxLjYxLDEuNjEsMCwwLDEtMSwxLjQ0LDQuMTUsNC4xNSwwLDAsMS0yLjE1LjIyQzQ1LjM5LDQ2LjcsNDUsNDYuMzgsNDUuMzEsNDUuNDZaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTEzLjgyLDQzLjcyYzAsLjgsMCwxLjYxLDAsMi40MSwwLC4zNi0uMS41My0uNDkuNTJzLS40Ny0uMjEtLjQ3LS41NWMwLTEuNjQsMC0zLjI5LDAtNC45MywwLS4zMSwwLS41Ni40NC0uNThzLjUzLjIyLjUzLjZjMCwuODUsMCwxLjY5LDAsMi41M1oiIGZpbGw9IiM5Mzk3OWYiLz48cGF0aCBkPSJNMTMuNDEsMzguOTNhLjYuNiwwLDAsMS0uNy0uNTMuNjMuNjMsMCwwLDEsLjYtLjc2LjYxLjYxLDAsMCwxLC42OS42NkEuNTcuNTcsMCwwLDEsMTMuNDEsMzguOTNaIiBmaWxsPSIjOTM5NzlmIi8+PC9zdmc+',
      displayName: 'Windows Endpoint',
      configuredDeviceCount: 0,
      description: 'This app integrates with the Windows Remote Management service to execute various actions',
      actionsCount: 20,
      time: '2022-10-07T12:22:10Z',
      token: 'GHNBVERTH',
    },
    {
      isConfigured: false,
      appLogo: 'PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHRpdGxlPkFjdGl2ZSBEaXJlY3Rvcnk8L3RpdGxlPjxwYXRoIGQ9Ik0yNS41LDM2LjI1YTEuOTMsMS45MywwLDAsMC0xLjQyLTEuMzMsNS42MSw1LjYxLDAsMCwwLTIuMi0uMDZjLS4xOSwwLS4yOC4wOS0uMjcuMjksMCwuNzIsMCwxLjQzLDAsMi4xNWgwYzAsLjcyLDAsMS40NCwwLDIuMTYsMCwuMTcsMCwuMjYuMjQuMjdhNi4zNSw2LjM1LDAsMCwwLDEuNjMsMCwyLjQxLDIuNDEsMCwwLDAsMS43LS45NEEyLjgyLDIuODIsMCwwLDAsMjUuNSwzNi4yNVptLTEuMjIsMi41OWEyLjM3LDIuMzcsMCwwLDEtMS45Mi4zNmMtLjEzLDAtLjEtLjE1LS4xLS4yNFYzNy4yN2gwYzAtLjU1LDAtMS4xLDAtMS42NCwwLS4yMi4wOC0uMjkuMjktLjNhMy42OCwzLjY4LDAsMCwxLDEuMjguMDksMS41MywxLjUzLDAsMCwxLDEuMTEsMS4yM0EyLjE0LDIuMTQsMCwwLDEsMjQuMjgsMzguODRaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTQuODcsMzkuMzhsLS41Mi0xLjUzTDMuMzksMzVhLjI1LjI1LDAsMCwwLS4yOC0uMjJIMi43NGEuMjYuMjYsMCwwLDAtLjI2LjE5UTEuNzIsMzcuMjUuOTQsMzkuNWMwLC4wNiwwLC4xMywwLC4xN2EuODQuODQsMCwwLDAsLjQ3LDAsLjIuMiwwLDAsMCwuMi0uMTZjLjExLS4zOC4yNS0uNzYuMzYtMS4xNGEuMy4zLDAsMCwxLC4zMS0uMjVsMS4zMywwYS4yMy4yMywwLDAsMSwuMjQuMTljLjExLjM0LjIzLjY3LjMzLDFzLjE3LjM5LjQuMzNTNSwzOS42OSw0Ljg3LDM5LjM4Wk0zLjM4LDM3LjY3Yy0uMzMsMC0uNjUsMC0xLDAtLjEsMC0uMiwwLS4xNS0uMTZsLjYzLTEuOXMwLDAsLjA4LS4xYTE5LjEyLDE5LjEyLDAsMCwwLC42LDEuOUMzLjYyLDM3LjYsMy41OCwzNy42NywzLjM4LDM3LjY3WiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik00Mi45MywzNy42M2ExLjYsMS42LDAsMCwwLTEuNTktMS41MSwxLjg3LDEuODcsMCwwLDAtLjY5LDMuNTlBMS43NywxLjc3LDAsMCwwLDQyLjkzLDM3LjYzWm0tLjY0LjI2YTEuMywxLjMsMCwwLDEtLjcxLDEuMzQsMSwxLDAsMCwxLTEuMjEtLjQ2LDEuOCwxLjgsMCwwLDEsMC0xLjcuODkuODksMCwwLDEsLjkxLS40Ni45NC45NCwwLDAsMSwuODEuNTVBMS4zNywxLjM3LDAsMCwxLDQyLjI5LDM3Ljg5WiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik0zMSwzOC4wOWgxLjc1Yy41MSwwLC41MiwwLC40OC0uNTJ2MGExLjQsMS40LDAsMCwwLTEuNTYtMS4zOSwxLjUzLDEuNTMsMCwwLDAtMS4zMi44OSwyLjA3LDIuMDcsMCwwLDAsLjM5LDIuNDIsMi4yNCwyLjI0LDAsMCwwLDIuMDcuMjJjLjIxLS4wNi4yMi0uMTkuMTgtLjM2cy0uMTktLjE0LS4zMi0uMWEyLjM0LDIuMzQsMCwwLDEtLjkxLjA3LDEsMSwwLDAsMS0xLS45MkMzMC44LDM4LjE4LDMwLjg0LDM4LjA4LDMxLDM4LjA5Wm0uNDQtMS40M2EuODMuODMsMCwwLDEsLjk0LjIuNDkuNDksMCwwLDEsLjExLjE4Yy4yMi40OS4xNy41Ny0uMzUuNTdIMzFjLS4xLDAtLjE3LDAtLjE2LS4xNUExLDEsMCwwLDEsMzEuNDgsMzYuNjZaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTQ3LjU0LDM4LjkxYy4yOC0uODUuNTUtMS42NC44Mi0yLjQzYS41MS41MSwwLDAsMSwuNjYtLjI3Yy4xMi4wNywwLC4xOCwwLC4yNi0uMTMuMzYtLjI3LjczLS40MiwxLjA5YTIwLjMzLDIwLjMzLDAsMCwxLTEuMTcsMi43NywxLjg4LDEuODgsMCwwLDEtMSwuOTJjLS4xMiwwLS4yNSwwLS4yNi0uMXMtLjI1LS4zLjA1LS40NGExLjc3LDEuNzcsMCwwLDAsLjktLjg5LjUuNSwwLDAsMCwwLS40M2MtLjM4LS45My0uNzUtMS44Ny0xLjEyLTIuOCwwLS4xMi0uMi0uMjYsMC0uMzdhLjUzLjUzLDAsMCwxLC42NC4xN2wuNSwxLjM0WiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik0xNS41NywzNy4xNGMtLjMxLjc4LS42MywxLjU2LS45MywyLjM1LS4wNi4xNi0uMTMuMjQtLjMuMjJzLS4zOS4wNi0uNDktLjJjLS4zOC0xLS43Ny0yLTEuMTYtMy4wNi0uMDctLjE3LDAtLjI1LjE4LS4yNnMuNDgsMCwuNTMuMzZhMiwyLDAsMCwwLC4xMS4zMmMuMTguNTEuMzUsMSwuNTMsMS41NGwuMTUuMzljMCwuMDUsMCwuMTIuMDcuMTNzLjA4LS4wNi4wOS0uMTFjLjIzLS42OS40Ny0xLjM3LjctMmEuODguODgsMCwwLDAsMC0uMTVjLjE0LS40My4xNC0uNDMuNTktLjQxLjE5LDAsLjIzLjA3LjE2LjI1UzE1LjY3LDM2LjkxLDE1LjU3LDM3LjE0WiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik05LjA2LDM3LjljMC0uMzEsMC0uNjIsMC0uOTNzMC0uMy0uMjYtLjI3LS4yOSwwLS4yOC0uMjQuMDUtLjI5LjI2LS4yNi4zLS4wNy4yNy0uMjksMC0uMjYsMC0uMzlhLjIuMiwwLDAsMSwuMTgtLjIyYy40NS0uMTMuNDgtLjExLjQ4LjM2LDAsLjYzLDAsLjUyLjUzLjU0LjE1LDAsLjM2LS4wOS4zNy4ycy0uMDYuMzEtLjMuM2MtLjYsMC0uNiwwLS42LjU3czAsMSwwLDEuNDguMTcuNTEuNTYuNWMuMTUsMCwuMjUsMCwuMjcuMThzMCwuMy0uMjEuMzNjLS42Ni4xMS0xLjI0LS4wOC0xLjI4LS45NCwwLS4zMSwwLS42MiwwLS45MloiIGZpbGw9IiM5Mzk3OWYiLz48cGF0aCBkPSJNNiwzOGExLjIxLDEuMjEsMCwwLDAsMS42MiwxLjIzYy4zNi0uMDkuNC0uMDcuNDUuMThzMCwuMjMtLjE0LjI3YTIuMiwyLjIsMCwwLDEtMS44MS0uMTMsMS44OCwxLjg4LDAsMCwxLS43Ny0xLjgzLDEuNzcsMS43NywwLDAsMSwxLjM5LTEuNTIsMi4xNiwyLjE2LDAsMCwxLDEuMDcsMGMuMTUsMCwuMzIuMDcuMjYuM3MtLjE1LjI5LS4zOC4yMWExLjM4LDEuMzgsMCwwLDAtLjcsMEExLjIsMS4yLDAsMCwwLDYsMzhaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTM1LjU3LDM5LjhBMS43NywxLjc3LDAsMCwxLDM0LDM3LjI2YTEuODksMS44OSwwLDAsMSwyLjM1LTFjLjI2LjA4LjMyLjI4LjE1LjVzLS4xMiwwLS4xOSwwYTEuOTEsMS45MSwwLDAsMC0uNzUtLjA4LDEuMjMsMS4yMywwLDAsMC0xLDEuNDYsMS4yLDEuMiwwLDAsMCwxLjYyLDEuMWMuMTIsMCwuMjgtLjE3LjQsMHMuMDcuMzktLjE5LjQ2QTMuMTIsMy4xMiwwLDAsMSwzNS41NywzOS44WiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik00NC4zNSwzNi43NGwuMjUtLjI4YS44OS44OSwwLDAsMSwuNTYtLjMyYy4xLDAsLjI2LS4wNy4zMSwwYS43NS43NSwwLDAsMSwwLC40OWMwLC4wNi0uMDguMDYtLjEzLjA2YS45MS45MSwwLDAsMC0uOTIuOWMwLC41OCwwLDEuMTYsMCwxLjc0LDAsLjMzLDAsLjM0LS4zNC4zNXMtLjMyLS4wNy0uMzItLjMyYzAtLjk1LDAtMS45LDAtMi44NSwwLS4xOCwwLS4zNS4yNS0uMzZzLjM2LjEuMzUuMzRDNDQuMzMsMzYuNTgsNDQuMzQsMzYuNjMsNDQuMzUsMzYuNzRaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTI4Ljc5LDM2LjcxYTEuMjgsMS4yOCwwLDAsMSwuNjMtLjU0Yy4xNS0uMDUuMzItLjExLjQyLDBzMCwuMywwLC40Ni0uMDcuMDgtLjE0LjA4Yy0uNjQsMC0uOTMuNTMtLjk1LDEuMTFzMCwxLjA5LDAsMS42NGMwLC4yMS0uMDguMjctLjI3LjI0cy0uMzguMDgtLjM4LS4yNGMwLTEsMC0yLDAtMywwLS4xNy4wNS0uMjYuMjQtLjI1cy4zNiwwLC4zNS4yM2MwLC4wOCwwLC4xNywwLC4yNVoiIGZpbGw9IiM5Mzk3OWYiLz48cGF0aCBkPSJNMTEuMzIsMzhjMC0uNDksMC0xLDAtMS40OCwwLS4yNi4xMS0uMzEuMzMtLjMxcy4zMywwLC4zMi4yOWMwLDEsMCwyLDAsMywwLC4zNS0uMjIuMjQtLjM5LjI1cy0uMywwLS4yOS0uMjZjMC0uNDksMC0xLDAtMS40OFoiIGZpbGw9IiM5Mzk3OWYiLz48cGF0aCBkPSJNMjYuNDQsMzhjMC0uNSwwLTEsMC0xLjUxLDAtLjIyLjA5LS4yNy4yOC0uMjZzLjM2LDAsLjM2LjI1YzAsMSwwLDIuMDUsMCwzLjA3LDAsLjI5LS4yMS4xOS0uMzYuMnMtLjMsMC0uMjktLjIyYzAtLjUxLDAtMSwwLTEuNTNaIiBmaWxsPSIjOTM5NzlmIi8+PHBhdGggZD0iTTI2Ljc2LDM1LjYyYS4zNi4zNiwwLDAsMS0uMzgtLjM4LjM4LjM4LDAsMCwxLC40My0uMzkuMzQuMzQsMCwwLDEsLjM2LjM2QS4zNy4zNywwLDAsMSwyNi43NiwzNS42MloiIGZpbGw9IiM5Mzk3OWYiLz48cGF0aCBkPSJNMTEuNjUsMzUuNjFhLjMzLjMzLDAsMCwxLS4zOC0uMzkuMzUuMzUsMCwwLDEsLjQxLS4zNy4zNS4zNSwwLDAsMSwuMzYuMzdBLjM2LjM2LDAsMCwxLDExLjY1LDM1LjYxWiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik0xNywzOC4wN2gxLjcyYy41LDAsLjUxLDAsLjQ5LS41MWExLjM2LDEuMzYsMCwwLDAtLjczLTEuMjYsMS41MiwxLjUyLDAsMCwwLTEuNzguMjgsMi4xMywyLjEzLDAsMCwwLS4zNywyLjI4LDEuNTEsMS41MSwwLDAsMCwxLC44NCwyLjU3LDIuNTcsMCwwLDAsMS40OC0uMDZjLjE2LDAsLjI1LS4xMS4yLS4zcy0uMi0uMTctLjMzLS4xM2EyLjExLDIuMTEsMCwwLDEtLjc5LjA4LDEuMTEsMS4xMSwwLDAsMS0xLjA5LTFDMTYuNzcsMzguMTUsMTYuODIsMzguMDcsMTcsMzguMDdabS0uMTgtLjcxYTEsMSwwLDAsMSwuODUtLjc1LjguOCwwLDAsMSwuOTEuNjJjLjExLjI5LjA1LjM4LS4yNS4zOGgtMS4zQzE2Ljg3LDM3LjYzLDE2LjgxLDM3LjU0LDE2Ljg1LDM3LjM2WiIgZmlsbD0iIzkzOTc5ZiIvPjxwYXRoIGQ9Ik0zNy41NiwzNy44NWMwLS4zLDAtLjYxLDAtLjkycy0uMDctLjI4LS4yNi0uMjctLjI4LDAtLjI4LS4yMS4xMS0uMjUuMjYtLjI0LjMxLS4wOS4yOC0uM2ExLjQ3LDEuNDcsMCwwLDEsMC0uMjFjMC0uMzQsMC0uMzkuMzgtLjQyLjE1LDAsLjIzLDAsLjIzLjE5czAsLjM2LDAsLjUzLjA3LjI0LjI0LjIzaC40NGMuMTYsMCwuMjMuMDUuMjMuMjFzLS4wNy4yMy0uMjMuMjItLjMsMC0uNDUsMC0uMjQuMDctLjI0LjI1YzAsLjU5LDAsMS4xOCwwLDEuNzdzLjE2LjU5LjU5LjU4Yy4xMywwLC4yNiwwLC4yNi4xN3MwLC4yNi0uMTkuMzFhLjk0Ljk0LDAsMCwxLTEuMjctLjkxYzAtLjMyLDAtLjY1LDAtMVoiIGZpbGw9IiM5Mzk3OWYiLz48cGF0aCBkPSJNMjcsOS44M2ExLjE2LDEuMTYsMCwwLDAsMC0uMzIsMS4xMSwxLjExLDAsMCwwLTEuMTQtLjc5aC05YTEuMTIsMS4xMiwwLDAsMC0xLjIsMS4yVjMxLjdoMy4xN2ExLjY5LDEuNjksMCwwLDEsLjM1LS45NGMuMTQtLjIyLjI3LS40NC40LS42NmwuMzctLjYzSDE3LjM1VjI4LjMzaDMuMTdhLjIxLjIxLDAsMCwwLC4yMS0uMTJsLjM1LS41OC4yNS0uNDFoLTRWMjYuMDloNC41MUEuMjQuMjQsMCwwLDAsMjIuMSwyNmMuNzEtMS4xOCwxLjQzLTIuMzQsMi4xNC0zLjUxTDI2LDE5LjUxYTEuMzUsMS4zNSwwLDAsMSwuODUtLjY4LjE2LjE2LDAsMCwwLC4xNC0uMTlRMjcsMTQuMjUsMjcsOS44M1ptLTEuNjgsMy4zNmgtOFYxMi4wN2g4WiIgZmlsbD0iIzM4NjVhZSIvPjxwYXRoIGQ9Ik0zNC4zMSwzMWExLjI3LDEuMjcsMCwwLDAtLjE1LS4zMXEtMi45Mi00Ljc4LTUuODYtOS41N2MtLjIxLS4zNS0uNDItLjctLjY1LTFhLjUxLjUxLDAsMCwwLS44NCwwbC0uMTcuMjRRMjMuODEsMjUsMjEsMjkuNjNjLS4yNi40My0uNTMuODYtLjc4LDEuM2EuMzkuMzksMCwwLDAsLjI2LjYyLDEuNTMsMS41MywwLDAsMCwuNDMsMEgzMy43NWEuNzQuNzQsMCwwLDAsLjIxLDBBLjM5LjM5LDAsMCwwLDM0LjMxLDMxWk0zMSwzMC42SDI4LjJWMjguOTJoMS4xMVYyNy44SDI1LjUyYy0uMTQsMC0uMTgsMC0uMTguMTgsMCwuMzEsMCwuNjIsMCwuOTRoMS4xNFYzMC42SDIzLjY0VjI4LjkyaDEuMTJWMjcuMjNIMjd2LTEuMUgyNS45di0xLjdoMi43MWMuMTIsMCwuMTYsMCwuMTYuMTZWMjZzMCwuMDgsMCwuMTRIMjcuNjN2MS4xSDI5Ljl2MS42OUgzMVoiIGZpbGw9IiMzODY1YWUiLz48L3N2Zz4=',
      displayName: 'Windows AD',
      configuredDeviceCount: 0,
      description: 'This app integrates with Windows AD server and perform actions',
      actionsCount: 14,
      time: '2022-11-11T12:22:10Z',
      token: 'ZARULXPPL',
    },
  ],
};

const actionProps = {
  getAllConfiguredAction,
  fakeActionApps,
  getByAppsDeviceAction,
  getListAsset,
  deleteIntegration,
  getProxyDevice,
  addIntegration,
  getAllAppsTagsListAction,
  getIntegration,
  updateIntegration,
  getAllSmtpList,
  filterSearchAppsAction,
  ActionStatusUpdateAction,
};
const initialData = {
  APPS: {
    GetAllAppsTagsListResponse: getAllTagsList,
    GetAllSearchAppsResponse: searchApp,
    GetAppsDeviceActionResponse: {},
    DeleteIntegrationResponse: {},
    AddIntegrationResponse: {},
    TestAssetResponse: {},
    UpdateIntegrationResponse: {},
    GetIntegrationResponse: {},
    ActionStatusUpdateResponse: {},
  },
};
const setUp = (props = {}, initialState = {}, contextValue = {}) => renderComponent(
  AppIntEkasha,
  { ...props },
  initialState,
  { ...contextValue, tableView: false, setTableView: jest.fn() },
);

describe('Render component without permission', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('NA', 'apps'));
    setUp(actionProps, initial);
  });
  it('should not render component', () => {
    expect(getById('AppsInt_NoData')).toBeInTheDocument();
  });
});

describe('Permission Read Only', () => {
  beforeEach(() => {
    const initial = JSON.parse(JSON.stringify(initialData));
    localStorage.setItem('customerID', 'Customer_1');
    setPermissions(handlePermission('RO', 'apps'));
    setUp(actionProps, initial);
  });
  it('Should show no permission message', () => {
    expect(getById('AppsInt_Wrapper')).toBeInTheDocument();
  });
});

describe('Response Handle', () => {
  describe('False Response index file', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.APPS.GetAllAppsTagsListResponse = {
        code: 400,
        message: 'Get tags data error',
        status: false,
        data: [],
      };
      initial.APPS.GetAllSearchAppsResponse = {
        code: 400,
        message: 'Get all devices error',
        status: false,
        data: [],
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'apps'));
      setUp(actionProps, initial);
    });
    it('Render component', () => {
      expect(getById('AppsInt_Wrapper')).toBeInTheDocument();
    });
  });
  describe('False Response AssetModal file', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.APPS.GetAppsDeviceActionResponse = {
        code: 400,
        message: 'Get device data error',
        status: false,
        data: {},
      };
      initial.APPS.DeleteIntegrationResponse = {
        code: 400,
        message: 'Delete integration error',
        status: false,
        data: {},
      };
      initial.APPS.AddIntegrationResponse = {
        code: 400,
        message: 'Add integration error',
        status: false,
        data: {},
      };
      initial.APPS.TestAssetResponse = {
        code: 400,
        message: 'Test asset error',
        status: false,
        data: {},
      };
      initial.APPS.UpdateIntegrationResponse = {
        code: 400,
        message: 'Update integration error',
        status: false,
        data: {},
      };
      initial.APPS.GetIntegrationResponse = {
        code: 400,
        message: 'Get integration error',
        status: false,
        data: {},
      };
      initial.APPS.ActionStatusUpdateResponse = {
        code: 400,
        message: 'Action status update error',
        status: false,
        data: {},
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'apps'));
      setUp(actionProps, initial);
    });
    beforeAll(() => {
      window.matchMedia = window.matchMedia || function () {
        return {
          matches: false,
          addListener() {},
          removeListener() {},
        };
      };
    });
    it('Click on card Functionality', async () => {
      fireEvent.click(getById('AppInt_AppsCardSelect_QFE097RO'));
    });
  });
  describe('True Response AssetModal file', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      initial.APPS.DeleteIntegrationResponse = {
        code: 200,
        message: 'Delete integration.',
        status: true,
      };
      initial.APPS.AddIntegrationResponse = {
        code: 200,
        message: 'Add integration.',
        status: true,
      };
      initial.APPS.TestAssetResponse = {
        code: 200,
        message: 'Test asset.',
        status: true,
      };
      initial.APPS.UpdateIntegrationResponse = {
        code: 200,
        message: 'Update integration.',
        status: true,
      };
      initial.APPS.GetIntegrationResponse = {
        code: 200,
        message: 'Get integration.',
        status: true,
        data: {
          isProxy: true,
          proxyToken: '123',
          configuration: {
            proxyDevice: '123',
            proxyDeviceName: '123',
            proxyDeviceType: '123',
          },
          isApproval: true,
          approvalId: '123',
          approvalTime: '123',
          isDefaultAction: true,
          approvalForAll: true,
          assetName: '123',
          description: '123',
          deviceToken: '123',
          token: '123',
        },
      };
      initial.APPS.ActionStatusUpdateResponse = {
        code: 200,
        message: 'Action status update.',
        status: true,
      };
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'apps'));
      setUp(actionProps, initial);
    });
    beforeAll(() => {
      window.matchMedia = window.matchMedia || function () {
        return {
          matches: false,
          addListener() {},
          removeListener() {},
        };
      };
    });
    it('Click on card Functionality', async () => {
      fireEvent.click(getById('AppInt_AppsCardSelect_QFE097RO'));
    });
  });
});

describe('Search Functionality', () => {
  describe('Search Functionality with Input', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'apps'));
      setUp(actionProps, initial);
    });
    it('Search Functionality', async () => {
      fireEvent.change(getById('Apps_Free_Search_for_device'), { target: { value: '16' } });
      jest.runAllTimers();
      jest.advanceTimersByTime(300);
      expect(getById('Apps_Free_Search_for_device')).toHaveValue('16');
      fireEvent.click(getById('ekasha_searchInput_clearSearch_Apps_Free_Search_for_device'));
      act(() => {
        jest.runAllTimers();
        jest.advanceTimersByTime(300);
      });
      expect(getById('Apps_Free_Search_for_device')).toHaveValue('');
    });
  });
  describe('Search Functionality with dropdown', () => {
    beforeEach(() => {
      const initial = JSON.parse(JSON.stringify(initialData));
      localStorage.setItem('customerID', 'Customer_1');
      setPermissions(handlePermission('RW', 'apps'));
      setUp(actionProps, initial);
    });
    it('Search Functionality', async () => {
      fireEvent.click(getById('incident_searchBoxIcn'));
      fireEvent.click(getById('AppInt_selectTag_0'));
      fireEvent.click(getById('AppInt_selectTag_0'));
      fireEvent.click(getById('AppInt_selectTag_1'));
      fireEvent.click(getById('AppInt_selectFilterTag_0'));
      fireEvent.click(getById('AppInt_selectFilterTag_0'));
    });
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

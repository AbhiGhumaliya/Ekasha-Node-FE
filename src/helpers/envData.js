/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
import moment from 'moment';
import $ from 'jquery';
// import { stompClient } from './lib/SocketHandlers';
import { history } from '../configurations/redux/Store';
// eslint-disable-next-line import/no-extraneous-dependencies
const CryptoJSAES = require('crypto-js/aes');

const passwordProtectedKey = 'Zeronsec@123';

export const encryptPassword = (password) => {
  const passwordString = CryptoJSAES.encrypt(password, passwordProtectedKey).toString();
  return passwordString.split('+').join('%2B');
};

export const callLogout = () => new Promise(() => {
  localStorage.clear();
  history.push('/');
  // stompClient && stompClient.connected && stompClient.disconnect();
});
export const localRefreshToken = () => localStorage.getItem('refreshToken');

// retry lazy function
export function retryLazy(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          // Passing on "reject" is the important part
          retryLazy(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

export const ExecutionCountData = [
  { name: 'First Execution', value: '0' },
  { name: 'Second Execution', value: '1' },
  { name: 'Third Execution', value: '2' },
  { name: 'Fourth Execution', value: '3' },
  { name: 'Fifth Execution', value: '4' },
  { name: 'Sixth Execution', value: '5' },
  { name: 'Seventh Execution', value: '6' },
  { name: 'Eighth Execution', value: '7' },
  { name: 'Ninth Execution', value: '8' },
  { name: 'Tenth Execution', value: '9' },
  { name: 'Eleventh Execution', value: '10' },
  { name: 'Twelfth Execution', value: '11' },
  { name: 'Thirteenth Execution', value: '12' },
  { name: 'Fourteenth Execution', value: '13' },
  { name: 'Fifteenth Execution', value: '14' },
  { name: 'Sixteenth Execution', value: '15' },
  { name: 'Seventeenth Execution', value: '16' },
  { name: 'Eighteenth Execution', value: '17' },
  { name: 'Nineteenth Execution', value: '18' },
  { name: 'Twenty Execution', value: '19' },
];

export function nFormatter(number) {
  let value = Math.ceil(number);
  if (number < 1000) {
    value = Math.ceil(number).toString(); // No conversion needed for numbers less than 1000
  } else if (number >= 1000 && number < 1000000) {
    value = `${(number / 1000).toFixed(1)}k`; // Convert to thousands (1K, 2K, etc.)
  } else if (number >= 1000000 && number < 1000000000) {
    value = `${(number / 1000000).toFixed(1)}M`; // Convert to millions (1M, 2M, etc.)
  } else if (number > 1000000000) {
    value = `${(number / 1000000000).toFixed(1)}B`; // Convert to crores (1Cr, 2Cr, etc.)
  }
  return value.replace('.0', ''); // Remove trailing
}

export const getLocalStorateTimeFilter = () => {
  if (localStorage.getItem('timeFilter')) {
    const x = JSON.parse(localStorage.getItem('timeFilter'));
    if (localStorage.getItem('fromTo')) {
      if (localStorage.getItem('fromTo') === 'quick') {
        const y = localStorage.getItem('quickString').split(' ');
        if (localStorage.getItem('quickString').includes('from now')) {
          return JSON.stringify({ from: 'now', to: `now+${parseInt(y[1])}${y[2][0]}` });
        }
        return JSON.stringify({ from: `now-${parseInt(y[1])}${y[2][0]}`, to: 'now' });
      } if (localStorage.getItem('fromTo') === 'common') {
        const str = localStorage.getItem('commonString');
        if (str === 'Today') {
          return JSON.stringify({ from: 'now-1d', to: 'now' });
        }
        if (str.includes('year')) {
          return JSON.stringify({ from: 'now-1y', to: 'now' });
        } if (str.includes('month')) {
          return JSON.stringify({ from: 'now-1M', to: 'now' });
        } if (str.includes('week')) {
          return JSON.stringify({ from: 'now-1w', to: 'now' });
        }
      } else {
        return JSON.stringify({ from: new Date(x.from), to: new Date(x.to) });
      }
    }
  }
  return null;
};
export const getTimeFilterData = (timeFilData) => {
  const data = timeFilData[0];
  if (data !== undefined) {
    if (data.timeFilter) {
      const x = JSON.parse(data.timeFilter);
      if (data.fromTo) {
        if (data.fromTo === 'quick') {
          const y = data.quickString.split(' ');
          if (data.quickString.includes('from now')) {
            return JSON.stringify({ from: 'now', to: `now+${parseInt(y[1])}${y[2][0]}` });
          }
          return JSON.stringify({ from: `now-${parseInt(y[1])}${y[2][0]}`, to: 'now' });
        }
        if (data.fromTo === 'common') {
          const str = data.commonString;
          if (str !== undefined) {
            if (str === 'Today') {
              return JSON.stringify({ from: 'now-1d', to: 'now' });
            }
            if (str.includes('year')) {
              return JSON.stringify({ from: 'now-1y', to: 'now' });
            }
            if (str.includes('month')) {
              return JSON.stringify({ from: 'now-1M', to: 'now' });
            }
            if (str.includes('week')) {
              return JSON.stringify({ from: 'now-1w', to: 'now' });
            }
          }
        } else {
          return JSON.stringify({ from: new Date(x.from), to: new Date(x.to) });
        }
      }
    }
  }
};

export const setTolocalStorage = () => {
  localStorage.setItem('activeTypeFrom', 'absolute');
  localStorage.setItem('activeTypeTo', 'absolute');
  localStorage.setItem('fromTo', 'quick');
  localStorage.setItem('quickString', 'Last 1 years');

  const time = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');

  time.subtract(1, 'year');

  const range = {
    from: moment(time).format(),
    to: moment(new Date()).format(),
  };

  localStorage.setItem('timeFilter', JSON.stringify(range));
};
export const scrollToError = () => {
  setTimeout(() => {
    const errorClass = $('div.errorMsg');
    if (errorClass.length > 0) {
      if (errorClass[0].parentElement) {
        errorClass[0].parentElement.scrollIntoView();
      } else {
        errorClass[0].scrollIntoView();
      }
    }
  }, 10);
};

export const getTableHeight = (rows, rules) => {
  const getHeight = rules ? `calc(100% - ${rules}px)` : '100%';

  if (rows && rows.length < 1) {
    return getHeight;
  }
  return `calc(${getHeight} - 50px)`;
};

export const onScrollIncList = (outerRef, nextPage, listLoad, setListLoad, totalCount, dataLength) => {
  if (listLoad === false && outerRef.current) {
    const y = outerRef?.current;
    // eslint-disable-next-line max-len
    if (Math.ceil(y?.scrollTop) === Math.ceil(y?.scrollHeight - y?.offsetHeight) && nextPage && y?.scrollTop > 0 && totalCount > dataLength) {
      setListLoad(true);
      setTimeout(() => {
        nextPage();
        setListLoad(false);
      }, 1200);
    }
  }
};

let timer = null;
export const debounceFunc = (func) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    func();
  }, 500);
};

// export const removeChartTooltipOnLoad = () => {
//   const tool = document.getElementById('HDS_Tooltip');
//   if (tool) {
//     tool.style.display = 'none';
//   }
// };

export const ChipColorArray = [
  'rgb(87, 159, 215, .5)',
  'rgb(119, 203, 198, .5)',
  'rgb(62, 183, 109, .5)',
  'rgb(219, 159, 199, .5)',
  'rgb(108, 86, 164, .5)',
  'rgb(4, 95, 124, .5)',
  'rgb(32, 64, 128, .5)',
  'rgb(240, 87, 123, .5)',
  'rgb(244, 129, 116, .5)',
  'rgb(71, 137, 200, .5)',
  'rgb(250, 191, 69, .5)',
  'rgb(185, 31, 67, .5)',
  'rgb(151, 66, 67, .5)',
  'rgb(203, 176, 72, .5)',
  'rgb(195, 84, 150, .5)',
  'rgb(244, 157, 85, .5)',
  'rgb(234, 93, 36, .5)',
  'rgb(60, 84, 62, .5)',
  'rgb(153, 189, 69, .5)',
  'rgb(248, 176, 178, .5)',
  'rgb(254, 228, 104, .5)',
];

export const statusList = [
  { name: 'Queue', value: 'Queue' },
  { name: 'Investigate', value: 'Investigate' },
  { name: 'Response', value: 'Response' },
  // { name: 'Close', value: 'Closed' },
];
export const cyberkillChainStageList = [
  { name: 'Reconnaissance', value: 'Reconnaissance' },
  { name: 'Delivery', value: 'Delivery' },
  { name: 'Exploitation', value: 'Exploitation' },
  { name: 'Installation', value: 'Installation' },
  { name: 'Command and Control', value: 'Command And Control' },
  { name: 'Action', value: 'Action' },
];
export const attackMechanismList = [
  { name: 'Physical', value: 'Physical' },
  { name: 'Operational', value: 'Operational' },
  { name: 'Information', value: 'Information' },
  { name: 'Unknown', value: 'Unknown' },
];
export const attackAgentList = [
  { name: 'Insider', value: 'Insider' },
  { name: 'Collaborative', value: 'Collaborative' },
  { name: 'Outsider', value: 'Outsider' },
  { name: 'Unknown', value: 'Unknown' },
];
export const incidentTypes = [
  { name: 'Undefined', value: 'Undefined' },
  { name: 'Phishing', value: 'Phishing' },
  { name: 'Access', value: 'Access' },
  { name: 'Malware', value: 'Malware' },
  { name: 'Vulnerability', value: 'Vulnerability' },
  { name: 'Authentication', value: 'Authentication' },
  { name: 'C2 Communication', value: 'C2 Communication' },
  { name: 'Defacement', value: 'Defacement' },
  { name: 'Device Lost', value: 'Device Lost' },
  { name: 'DOS', value: 'DOS' },
  { name: 'Exfiltration', value: 'Exfiltration' },
  { name: 'Exploit', value: 'Exploit' },
  { name: 'Hunt', value: 'Hunt' },
  { name: 'Job', value: 'Job' },
  { name: 'Lateral Movement', value: 'Lateral Movement' },
  { name: 'Network', value: 'Network' },
  { name: 'Policy Violation', value: 'Policy Violation' },
  { name: 'Ransomware', value: 'Ransomware' },
  { name: 'Reconnaissance', value: 'Reconnaissance' },
  { name: 'Simulation', value: 'Simulation' },
  { name: 'Unclassified', value: 'Unclassified' },
  { name: 'Unknown Binary', value: 'Unknown Binary' },
];
export const possibleBusinessImpactList = [
  { name: 'Financial', value: 'Financial' },
  { name: 'Legal/Contractual', value: 'Legal/Contractual' },
  { name: 'Operational', value: 'Operational' },
  { name: 'Regulatory', value: 'Regulatory' },
  { name: 'Reputational', value: 'Reputational' },
];
export const dataSecurityClassificationList = [
  { name: 'Unclassified', value: 'Unclassified' },
  { name: 'Confidential', value: 'Confidential' },
  { name: 'Secret', value: 'Secret' },
  { name: 'Top Secret', value: 'Top Secret' },
];
export const DataTypeList = [
  { name: 'Card Data', value: 'Card Data' },
  { name: 'Financial Transactions', value: 'Financial Transactions' },
  { name: 'Health Information', value: 'Health Information' },
  { name: 'Intellectual Property', value: 'Intellectual Property' },
  { name: 'Personal Information (Customer Data)', value: 'Personal Information (Customer Data)' },
  { name: 'Personal Information (Employee Data)', value: 'Personal Information (Employee Data)' },

];
export const CIATriadList = [
  { name: 'Availability', value: 'Availability' },
  { name: 'Confidentiality', value: 'Confidentiality' },
  { name: 'Integrity', value: 'Integrity' },
];
export const operatorList = [
  { name: 'Greater than', value: 'gt' },
  { name: 'Less than', value: 'lt' },
  { name: 'Greater than equal to', value: 'gte' },
  { name: 'Less than equal to', value: 'lte' },
  { name: 'Equal to', value: 'equal' },
  { name: 'Not equal to', value: 'notEq' },
  { name: 'Exist', value: 'isExist' },
  { name: 'Not exist', value: 'isNotExist' },
  { name: 'Contain', value: 'cont' },
];
export const metricList = [
  { name: 'Min', value: 'MIN' },
  { name: 'Max', value: 'MAX' },
  { name: 'Sum', value: 'SUM' },
  { name: 'Count', value: 'COUNT' },
  { name: 'Avg', value: 'AVG' },
];
export const aggTypeList = [
  { name: 'Terms', value: 'terms' },
  { name: 'Range', value: 'range' },
  { name: 'Date Range', value: 'dateRange' },
  { name: 'Histogram', value: 'histogram' },
  { name: 'Date Histogram', value: 'dateHistogram' },
  { name: 'IP Range', value: 'ipRange' },
];
export const aclDataAdmin = [
  { module: 'SLA' },
  { module: 'Risk Weightage Configuration' },
  { module: 'Integration' },
  { module: 'Asset' },
  { module: 'Server Management' },
  { module: 'LDAP Configuration' },
  { module: 'SSL Configuration' },
  { module: 'Critical User' },
  { module: 'User Management' },
  { module: 'Tenant' },
  { module: 'Escalation Rules' },
  { module: 'Custom Fields' },
  { module: 'Proxy Configuration' },
  { module: 'Workbook' },
  { module: 'Template' },
  { module: 'Lists' },
  { module: 'Timezone' },
  { module: 'Backup & Restore' },
  { module: 'Logs' },
];
export const aclDataIncident = [
  { module: 'Timeline' },
  { module: 'Overview' },
  { module: 'Workbooks' },
  { module: 'Actions' },
  { module: 'Playbooks' },
  { module: 'Assets' },
  { module: 'Artifacts' },
  { module: 'Reports' },
  { module: 'Evidence' },
  { module: 'References' },
  { module: 'Notes' },
  { module: 'Warroom' },
  { module: 'Activities' },
];

export const IncidentDataField = [
  { key: 'destinationAddress' },
  { key: 'destinationTranslatedAddress' },
  { key: 'deviceAddress' },
  { key: 'deviceTranslatedAddress' },
  { key: 'sourceAddress' },
  { key: 'sourceTranslatedAddress' },
  { key: 'sourceNTDomain' },
  { key: 'destinationNTDomain' },
  { key: 'sourceHostName' },
  { key: 'destinationHostName' },
  { key: 'deviceHostName' },
  { key: 'destinationProcess' },
  { key: 'sourceProcess' },
  { key: 'deviceProcess' },
  { key: 'destinationUser' },
  { key: 'sourceUser' },
  { key: 'iocUrl' },
  { key: 'iocIP' },
  { key: 'requestUrl' },
  { key: 'fileName' },
  { key: 'attachmentHash' },
  { key: 'destinationHashValue' },
  { key: 'sourceHashValue' },
  { key: 'fileHash' },
  { key: 'iocHash' },
];

export const aclApprovalDataIncident = [
  { module: 'Approvals' },
  { module: 'Timeline' },
  { module: 'Overview' },
];

export const severityColor = {
  veryLow: '#86ff4c',
  low: '#ebffa9',
  moderate: '#ffdc4c',
  medium: '#ffdc4c',
  high: '#ff804c',
  critical: '#ff4c4c',
  undefine: '#4cffed',
  'risk weightage': '#0779BC',
};

export const statuColors = {
  Queue: '#ffff00',
  Investigate: '#008000',
  Response: '#ffa500',
  Closed: '#808080',
  Reopen: '#f37576',
};

export const severityList = [
  { name: 'Low', value: 'Low' },
  { name: 'Medium', value: 'Medium' },
  { name: 'High', value: 'High' },
  { name: 'Critical', value: 'Critical' },
  // { name: "Undefine ", value: "undefine " },
];

export const licenceExpireList = {
  aclData: JSON.stringify([
    {
      module: 'home',
      permission: 'NA',
      subModules: [
        {
          module: 'dashboard',
          permission: 'NA',
        },
        {
          module: 'panel',
          permission: 'NA',
        },
      ],
    },
    {
      module: 'administration',
      permission: 'RW',
      subModules: [
        {
          module: 'sla',
          permission: 'NA',
        },
        {
          module: 'riskScore',
          permission: 'NA',
        },
        {
          module: 'integration',
          permission: 'NA',
        },
        {
          module: 'assets',
          permission: 'NA',
        },
        {
          module: 'server',
          permission: 'NA',
        },
        {
          module: 'ldap',
          permission: 'NA',
        },
        {
          module: 'ssl',
          permission: 'NA',
        },
        {
          module: 'criticalUser',
          permission: 'NA',
        },
        {
          module: 'userManagement',
          permission: 'NA',
        },
        {
          module: 'tenant',
          permission: 'NA',
        },
        {
          module: 'escalateRule',
          permission: 'NA',
        },
        {
          module: 'customField',
          permission: 'NA',
        },
        {
          module: 'proxy',
          permission: 'NA',
        },
        {
          module: 'workbook',
          permission: 'NA',
        },
        {
          module: 'template',
          permission: 'NA',
        },
        {
          module: 'lists',
          permission: 'NA',
        },
        {
          module: 'timezone',
          permission: 'NA',
        },
        {
          module: 'backupandrestore',
          permission: 'NA',
        },
        {
          module: 'license',
          permission: 'RW',
        },
        {
          module: 'client',
          permission: 'NA',
        },
        {
          module: 'zone',
          permission: 'NA',
        },
        {
          module: 'logs',
          permission: 'NA',
        },
      ],
    },
    {
      module: 'incidents',
      permission: 'NA',
      subModules: [
        {
          module: 'overview',
          permission: 'NA',
        },
        {
          module: 'incidentWorkbook',
          permission: 'NA',
        },
        {
          module: 'action',
          permission: 'NA',
        },
        {
          module: 'incidentPlaybook',
          permission: 'NA',
        },
        {
          module: 'incidentAssets',
          permission: 'NA',
        },
        {
          module: 'artifact',
          permission: 'NA',
        },
        {
          module: 'incidentReports',
          permission: 'NA',
        },
        {
          module: 'evidence',
          permission: 'NA',
        },
        {
          module: 'references',
          permission: 'NA',
        },
        {
          module: 'notes',
          permission: 'NA',
        },
        {
          module: 'warNAom',
          permission: 'NA',
        },
        {
          module: 'activity',
          permission: 'NA',
        },
      ],
    },
    {
      module: 'playbook',
      permission: 'NA',
    },
    {
      module: 'ruleEngine',
      permission: 'NA',
    },
    {
      module: 'apps',
      permission: 'NA',
    },
    {
      module: 'reports',
      permission: 'NA',
    },
    {
      module: 'ioc',
      permission: 'NA',
    },
    {
      module: 'jobs',
      permission: 'NA',
    },
  ]),
};

export const TestCasePermissionData = {
  aclData: JSON.stringify([
    {
      module: 'home',
      permission: 'RW',
      subModules: [
        {
          module: 'dashboard',
          permission: 'NA',
        },
        {
          module: 'panel',
          permission: 'NA',
        },
      ],
    },
    {
      module: 'administration',
      permission: 'RW',
      subModules: [
        {
          module: 'sla',
          permission: 'NA',
        },
        {
          module: 'riskScore',
          permission: 'NA',
        },
        {
          module: 'integration',
          permission: 'NA',
        },
        {
          module: 'assets',
          permission: 'NA',
        },
        {
          module: 'server',
          permission: 'NA',
        },
        {
          module: 'ldap',
          permission: 'NA',
        },
        {
          module: 'ssl',
          permission: 'NA',
        },
        {
          module: 'criticalUser',
          permission: 'NA',
        },
        {
          module: 'userManagement',
          permission: 'NA',
        },
        {
          module: 'tenant',
          permission: 'NA',
        },
        {
          module: 'escalateRule',
          permission: 'NA',
        },
        {
          module: 'customField',
          permission: 'NA',
        },
        {
          module: 'proxy',
          permission: 'NA',
        },
        {
          module: 'workbook',
          permission: 'NA',
        },
        {
          module: 'template',
          permission: 'NA',
        },
        {
          module: 'lists',
          permission: 'NA',
        },
        {
          module: 'timezone',
          permission: 'NA',
        },
        {
          module: 'backupandrestore',
          permission: 'NA',
        },
        {
          module: 'license',
          permission: 'RW',
        },
        {
          module: 'client',
          permission: 'NA',
        },
        {
          module: 'zone',
          permission: 'NA',
        },
        {
          module: 'logs',
          permission: 'NA',
        },
      ],
    },
    {
      module: 'incidents',
      permission: 'RW',
      subModules: [
        {
          module: 'overview',
          permission: 'NA',
        },
        {
          module: 'incidentWorkbook',
          permission: 'NA',
        },
        {
          module: 'action',
          permission: 'NA',
        },
        {
          module: 'incidentPlaybook',
          permission: 'NA',
        },
        {
          module: 'incidentAssets',
          permission: 'NA',
        },
        {
          module: 'artifact',
          permission: 'NA',
        },
        {
          module: 'incidentReports',
          permission: 'NA',
        },
        {
          module: 'evidence',
          permission: 'NA',
        },
        {
          module: 'references',
          permission: 'NA',
        },
        {
          module: 'notes',
          permission: 'NA',
        },
        {
          module: 'warNAom',
          permission: 'NA',
        },
        {
          module: 'activity',
          permission: 'NA',
        },
      ],
    },
    {
      module: 'playbook',
      permission: 'NA',
    },
    {
      module: 'ruleEngine',
      permission: 'NA',
    },
    {
      module: 'apps',
      permission: 'NA',
    },
    {
      module: 'reports',
      permission: 'NA',
    },
    {
      module: 'ioc',
      permission: 'NA',
    },
    {
      module: 'jobs',
      permission: 'NA',
    },
  ]),
};

export const da = {
  isVersion: false,
  description: 'sasas',
  configStatus: true,
  userName: 'Ekasha Admin',
  version: '1.1',
  userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
  taskCount: 1,
  view: {
    scale: 0.9,
  },
  createdBy: 'Ekasha Admin',
  name: 'checked(1)(1)(1)',
  createdTime: '2023-05-09T08:31:53.078Z',
  lastUpdatedTime: '2023-05-09T08:31:53.078Z',
  id: 'PedmeUA2E2',
  tasks: {
    0: {
      note: {},
      starttask: {
        default: [
          '2',
        ],
      },
      scriptarguments: {},
      playbookToken: '',
      permission: {},
      previousIDs: [],
      actionToken: 'start',
      type: 'start',
      deviceName: 'Start',
      configrationStatus: true,
      deviceToken: 'start',
      view: {
        position: {
          x: 320,
          y: 260,
        },
        ports: {
          inPorts: [],
          outPorts: [
            'out-0',
          ],
        },
      },
      nexttasks: {
        default: [
          '2',
        ],
      },
      name: 'Start',
      id: '0',
      assetToken: 'start',
      displayArgument: {},
      actionDesc: 'Playbook starts here',
      isPlaybook: false,
      validate: false,
    },
    1: {
      note: {},
      starttask: {
        default: [
          '2',
        ],
      },
      scriptarguments: {},
      playbookToken: '',
      permission: {},
      previousIDs: [
        {
          p: '2',
          c: '1',
          port: 'out-0',
        },
      ],
      actionToken: 'end',
      type: 'end',
      deviceName: 'End',
      configrationStatus: true,
      deviceToken: 'end',
      view: {
        position: {
          x: 1070,
          y: 360,
        },
        ports: {
          inPorts: [
            'in-0',
          ],
          outPorts: [],
        },
      },
      nexttasks: {
        default: [],
      },
      name: 'End',
      id: '1',
      assetToken: 'end',
      displayArgument: {},
      actionDesc: 'Playbook ends here',
      isPlaybook: false,
      validate: false,
    },
    2: {
      note: {},
      starttask: {
        default: [
          '2',
        ],
      },
      scriptarguments: {
        IP: '10.1.3.120',
      },
      playbookToken: '',
      previousIDs: [
        {
          p: '0',
          c: '2',
          port: 'out-0',
        },
      ],
      actionToken: '824',
      type: 'action',
      deviceName: 'VirusTotal',
      configrationStatus: true,
      deviceToken: 'AFEC97R0',
      actionType: 'searchByAction',
      view: {
        position: {
          x: 680,
          y: 400,
        },
        ports: {
          inPorts: [
            'in-0',
          ],
          outPorts: [
            'out-0',
          ],
        },
      },
      nexttasks: {
        default: [
          '1',
        ],
      },
      name: 'VirusTotal',
      assetName: 'Ipconfig',
      id: '2',
      assetToken: 'bffd9733b-b88e-40ef-9fda-cb203868bad5',
      displayArgument: {
        IP: '10.1.3.120',
      },
      actionDesc: 'Queries VirusTotal for IP info',
      isPlaybook: false,
      actionName: 'IP Reputation',
      validate: false,
    },
  },
};

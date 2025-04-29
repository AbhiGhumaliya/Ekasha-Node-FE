const FilterNotification = [

  // Tenant List
  'TENANT_LIST',

  // Notification
  'GET_ALL_NOTIFICATION',

  // Auth
  'GET_USER_PERMISSION',
  'LOGIN',
  'CHECK_SETUP',
  'OTP_VERIFY',
  'CHECK_VALID_PASS',
  'VALID_PASS',
  'GUEST_LOGIN',
  'GET_CURRENT_TIMEZONE',

  // Setup
  'SYSLOG_CONFIG_SETUP',
  'TIME_ZONE_CONFIG_SETUP',
  'TIME_ZONE_LIST_SETUP',
  'LDAP_TEST_CONNECTION',

  // Home
  'INCIDENT_TYPE_HOME',
  'RECENT_DATA',
  'INCIDENT_NAME',
  'INCIDENT_CYBER_KILL',
  'INCIDENT_STATUS',
  'INCIDENT_SEVERITY',
  'INCIDENT_TOTAL',

  // Dashboard
  'GET_ALL_DASHBOARD_LIST',
  'GET_CHART_DATA',
  'LIST_PANEL_DASHBOARD',

  // Panel
  'GET_ALL_PANEL_LIST',
  'PANEL_PREVIEW',
  'FIND_BY_TOKEN_PANEL',
  'GET_INDEX_FIELDS',
  'FATCH_QUERY_FIELDS',
  'DELETE_PANEL_LIST_ACTION',

  // KPI
  'TOTAL_INCIDENTS_KPI',
  'ESCALATION_RATE_KPI',
  'REOPEN_INCIDENT_RATE_KPI',
  'OPEN_INCIDENT_RATE_KPI',
  'AVG_OVERDUE_TIME_KPI',
  'INCIDENT_PER_ROLE_KPI',
  'INCIDENT_OVER_TIME_KPI',
  'SLA_BREAKDOWN_KPI',
  'MTTA_KPI',
  'MTTI_KPI',
  'MTTR_KPI',
  'FALSE_POSITIVE_KPI',

  // Rule-engine
  'GET_ALL_RULE_ENGINE',

  // Report
  'GET_ALL_REPORT',
  'GET_ALL_ARCHIVE_REPORT',

  // Playbook
  'GET_NEW_ALL_PLAYBOOK',

  // Apps
  'FILTER_SEARCH_APPS_ACTION',
  'GET_PROXY_DEVICE',

  // Jobs
  'GET_ALL_JOBS',

  // IOC
  'GET_ALL_IOC_LIST',

  // Action Approval
  'APPROVAL_COMMENT',
  'GET_BASIC_DETAIL',
  'ACTION_REQUEST',
  'CHECK_DECLINE_ACTION',
  'DECLINE_ACTION_APPROVAL',

  // Incident
  'ASSIGN_USER',
  'CHANGE_INCIDENT_STATUS',
  'GET_TIME_LINE',
  'GET_OWNER_WITH_ROLE',

  // Incident Action
  'SEARCH_KEYWORD_ACTION',
  'GET_LIST_EXECUTED_ACTIONS',

  // Incident Asset
  'GET_ASSETS_DATA_EXPAND',

  // Incident Playbook
  'GET_EXECUTED_TASK_DATA_ACTION',

  // Incident Workbook
  'GET_ASSIGNED_WORKBOOK',

  // Incident Report
  'PREVIEW_SUMMARY_REPORT',

  // Incident Warroom
  'GET_ALL_MESSAGES',
  'GET_WARROOM_FILE_SIZE',
  'FILE_UPLOAD',
  'GET_DETAIL_WARROOM',

  // Incident Evidance
  'GET_EVIDENCE_FILESIZE',
  'GET_CYBER_MRI_ASSET',
  'PREVIEW_FILE',

  // Administration Timezone
  'GET_ALL_TIMEZONE_LIST',

  // Administration Asset
  'GET_OWNER',
  'GET_ALL_INCIDENT_ASSETS',
  'GET_ALL_ASSETS',

  // Administration Role
  'ROLE_LIST_GET',
  'ROLE_GET',

  // Administration Integration
  'GET_ALL_INTEGRATION',

  // Administration LDAP
  'GET_ALL_LDAP_LIST',

  // Administration User
  'GET_ALL_COUNTRY_CODE',

  // Administration Group
  'GET_ALL_GROUP',

  // Administration Workbook
  'GET_ALL_WORKBOOK',
  'GET_WORKBOOK_ACTION_LIST',

  // Administration Zone
  'GET_ALL_ZONE',

  // Administration Authentication Policy
  'GET_ALL_PASSWORD_POLICY_DETAIL',

  // Administration Critical User
  'GET_ALL_CRITICAL_USER',

  // Administration Custom Field
  'GET_CUSTOM_FIELD',

  // Administration List
  'GET_ALL_LIST',
  'GET_PREVIEW_LIST',
  'GET_ALL_LIST_DATA',

  // Administration Proxy
  'GET_ALL_PROXY',

  // Administration Server Management
  'GET_QUEUE_DATA',

  // Administration SLA
  'FIND_ALL_SLA',

  // Administration Risk Weight
  'FIND_ALL_RISK_WEIGHTAGE',

  // Administration RiskScore
  'GET_RISK_SCORE',

  // Administration Template
  'GET_ALL_TEMPLATE',

  // Administration SSl
  'GET_SSL',

  // Administration User
  'USER_GET',

  // Administration Tenant
  'GET_ALL_TENANT_LIST',
  'PERMISSION_BASED_TENANT_LIST',
  'LIST_GROUP_TENANT',

  // Administration Group
  'GET_ALL_ONLY_GROUP',

  // Administration Logs
  'PREVIEW_LOGS',

  // Administration Backup
  'GET_BACKUP',
  'GET_BACKUP_SERVERL_LIST',
  'EXECUTE_BACKUP',

  // Administration Restore
  'GET_RESTORE_FILE_LIST',
  'RESTORE_FILE_ACTION',

  // Administration Client
  'GET_CLIENT_DATA',

  // Administration License
  'GET_LICENSE',

  // Administration Integration
  'GET_ALL_FIELDS',
  'GET_ALL_INTEGRATION_FOR_RULE',

  // Alert
  'GET_ALL_RAWLOG_BY_ID',
];
export default FilterNotification;

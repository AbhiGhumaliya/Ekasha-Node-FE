const permissionData = [
  {
    module: 'home',
    permission: 'RW',
    subModules: [
      {
        module: 'dashboard',
        permission: 'RW',
      },
      {
        module: 'panel',
        permission: 'RW',
      },
    ],
  },
  {
    module: 'administration',
    permission: 'RW',
    subModules: [
      {
        module: 'sla',
        permission: 'RW',
      },
      {
        module: 'integration',
        permission: 'RW',
      },
      {
        module: 'assets',
        permission: 'RW',
      },
      {
        module: 'server',
        permission: 'RW',
      },
      {
        module: 'ldap',
        permission: 'RW',
      },
      {
        module: 'ssl',
        permission: 'RW',
      },
      {
        module: 'userManagement',
        permission: 'RW',
      },
      {
        module: 'escalateRule',
        permission: 'RW',
      },
      {
        module: 'customField',
        permission: 'RW',
      },
      {
        module: 'proxy',
        permission: 'RW',
      },
      {
        module: 'workbook',
        permission: 'RW',
      },
      {
        module: 'template',
        permission: 'RW',
      },
      {
        module: 'lists',
        permission: 'RW',
      },
      {
        module: 'timezone',
        permission: 'RW',
      },
      {
        module: 'backupandrestore',
        permission: 'RW',
      },
      {
        module: 'license',
        permission: 'RW',
      },
      {
        module: 'client',
        permission: 'RW',
      },
      {
        module: 'zone',
        permission: 'RW',
      },
      {
        module: 'logs',
        permission: 'RW',
      },
      {
        module: 'criticalUser',
        permission: 'RW',
      },
      {
        module: 'tenant',
        permission: 'RW',
      },
    ],
  },
  {
    module: 'incidents',
    permission: 'RW',
    subModules: [
      {
        module: 'overview',
        permission: 'RW',
      },
      {
        module: 'workbook',
        permission: 'RW',
      },
      {
        module: 'action',
        permission: 'RW',
      },
      {
        module: 'incidentPlaybook',
        permission: 'RW',
      },
      {
        module: 'assets',
        permission: 'RW',
      },
      {
        module: 'artifact',
        permission: 'RW',
      },
      {
        module: 'reports',
        permission: 'RW',
      },
      {
        module: 'evidence',
        permission: 'RW',
      },
      {
        module: 'references',
        permission: 'RW',
      },
      {
        module: 'notes',
        permission: 'RW',
      },
      {
        module: 'activity',
        permission: 'RW',
      },
    ],
  },
  {
    module: 'playbook',
    permission: 'RW',
  },
  {
    module: 'ruleEngine',
    permission: 'RW',
  },
  {
    module: 'apps',
    permission: 'RW',
  },
  {
    module: 'reports',
    permission: 'RW',
  },
  {
    module: 'ioc',
    permission: 'RW',
  },
  {
    module: 'jobs',
    permission: 'RW',
  },
];

export const initialAuthData = {
  Auth: {
    SignInResponse: {
      status: true,
      message: 'no data',
      data: {
        Group: 'x249a2995-3666-4243-af80-1d5c26739a33',
        role: 'pl67e394bc-362b-4dda-b7435-54fb8hjdrty2t5',
        resetStatus: true,
        aclData: permissionData,
        userName: 'admin',
        checkAccess: true,
        userToken: 'm33b2e747-b977-4db6-9f9c-828f8c6cccd9',
        groupName: 'Administrator',
        contact: '9879898798',
        jwtToken: {
          token: 'eyJ1c2VyVG9rZW4iOiJtMzNiMmU3NDctYjk3Ny00ZGI2LTlmOWMtODI4ZjhjNmNjY2Q5IiwiYWxnIjoiSFM1MTIifQ.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcxNzY5Nzg5NSwiaWF0IjoxNzE3NjY5MDk1fQ.tRDr2n32akFitDSNOPjlvq7B1pf_XtUNbr5bpEvryI-BR75iSplUuwueM6JtM5FtNJYN6sjxX0ZaY5k8Imze5w',
        },
        fullname: 'Ekasha Admin',
        email: 'support@zeronsec.com',
        status: true,
      },
    },
    CheckValidPassResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
    userPermissionsResponse: {
      status: true,
      message: 'no data',
      data: [
        permissionData,
        {
          licenseStatus: true,
        },
      ],
      code: 200,
    },
    SetupResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
    TwoFactoreOtpResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
    TwoFactorOtpVerifyResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
    ValidPassPolicyResponse: {
      status: false,
      message: 'no data',
      data: ['test', 'run'],
      code: 200,
    },
    getCurrentTimezoneResponse: {
      status: true,
      message: 'no data',
      data: {
        serverTimezone: 'Asia/Kolkata',
        userTimezone: 'Asia/Kolkata',
      },
      code: 200,
    },
    OtpSendResponse: {
      status: false,
      message: 'no data',
      data: { },
      code: 200,
    },
    OtpVerifyResponse: {
      status: false,
      message: 'no data',
      data: { },
      code: 200,
    },
    ResetPassResponse: {
      status: false,
      message: 'no data',
      data: { },
      code: 200,
    },
  },
  User: {
    ChangePasswordExpResponse: {
      status: false,
      message: 'no data',
      data: {},
      code: 200,
    },
  },
};

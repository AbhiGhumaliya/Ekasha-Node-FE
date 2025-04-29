const proxyIp = 'https://10.1.1.21:8001';

export const apiEndPoint = process.env.NODE_ENV === 'development' ? proxyIp : '';
export const reportEndPoint = process.env.NODE_ENV === 'development' ? proxyIp : '';

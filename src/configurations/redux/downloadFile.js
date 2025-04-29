import { apiEndPoint } from '../../helpers/lib/ApiEndpoint';

export const downloadFileAction = (path, fileName) => {
  fetch(`${apiEndPoint}/${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('U_TOKENS')).jwtToken}`,
      userToken: JSON.parse(localStorage.getItem('U_TOKENS')).userToken,
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        fileName || 'file.zip',
      );
      link.click();
    }).catch((err) => err.response || 'Something Went Wrong.');
};

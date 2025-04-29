import { apiEndPoint } from './ApiEndpoint';

const Stomp = require('stompjs');
const SockJS = require('sockjs-client');

// //--Socket START--//
let SockJSConnect = new SockJS(`${apiEndPoint}/ws`);
// eslint-disable-next-line import/no-mutable-exports
export let stompClient = Stomp.over(SockJSConnect);

// Add connection state tracking
let isConnecting = false;

const onError = (e, callback) => {
  console.log('Disconnected..');
  stompClient = {};
  // setStompClient(null);
  setTimeout(() => {
    // eslint-disable-next-line no-use-before-define
    reConnect(callback);
  }, 5000);
};

export const reConnect = (onConnected) => {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    console.log('Connection already in progress...');
    return;
  }

  console.log('Connecting....', stompClient);
  isConnecting = true;

  SockJSConnect = new SockJS(`${apiEndPoint}/ws`);
  stompClient = Stomp.over(SockJSConnect);
  stompClient.debug = null;

  stompClient.connect({},
    () => {
      isConnecting = false;
      onConnected();
      const event = new CustomEvent('stompClientChanged', {
        detail: { stompClient }, // Fix: Add detail property
      });
      window.dispatchEvent(event);
    },
    (e) => {
      isConnecting = false;
      onError(e, onConnected);
    });
};

// --Socket END--//

import React from 'react';
import RabbitMQ from './lib/RabbitMQ';
import ServerManagement from './lib/ServerManagement';
import { ServerWrapper } from './style';

const Server = (props) => (
  <>
    <ServerWrapper data-test="ServerRabbitManagement">
      <div style={{ overflow: 'auto', height: '100%' }}>
        <ServerManagement {...props} />
        <RabbitMQ {...props} />
      </div>
    </ServerWrapper>
  </>
);
Server.propTypes = {
};

Server.defaultProps = {
};
export default Server;

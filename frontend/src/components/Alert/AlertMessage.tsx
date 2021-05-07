import React from 'react';
import { Alert } from 'react-bootstrap';

import './AlertMessage.scss';

interface AlertMessageProps {
  closeHandler: () => void;
  show: boolean;
  message: string;
  variantType:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | string;
}

const AlertMessage: React.FC<AlertMessageProps> = (props) => {
  const { show, closeHandler, message, variantType } = props;
  return (
    <div className="comp-alert-message">
      <Alert
        className="comp-alert-message--alert mr-4"
        show={show}
        variant={variantType}
        onClose={closeHandler}
        dismissible
      >
        <p>{message}</p>
      </Alert>
    </div>
  );
};

export default AlertMessage;

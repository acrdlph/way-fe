import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function RefreshIndicator() {
  const style = {
    container: {
      position: 'relative',
    },
    refresh: {
      display: 'inline-block',
      position: 'relative',
    },
  };
  return (
    <div>
      <div style={style.container}>
        <CircularProgress status="loading" style={style.refresh} />
      </div>
    </div>
  );
}

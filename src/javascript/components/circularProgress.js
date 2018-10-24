import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function RefreshIndicator() {
  const style = {
    container: {
      position: 'absolute',
    },
    refresh: {
      display: 'inline-block',
      position: 'relative',
      color: '#0095b3',
    },
    center: {
      display: 'flex',
      justifyContent:'center',
    }
  };
  return (
    <div style={style.center}>
      <div style={style.container}>
        <CircularProgress status="loading" style={style.refresh} />
      </div>
    </div>
  );
}

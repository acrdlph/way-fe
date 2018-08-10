import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

export default function CircularProgress() {
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
        <RefreshIndicator
          size={40}
          left={10}
          top={0}
          loadingColor="#3ab966"
          status="loading"
          style={style.refresh}
        />
      </div>
    </div>
  );
}

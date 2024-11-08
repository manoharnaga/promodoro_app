import React from 'react';

const Loader = () => (
  <div style={styles.loaderContainer}>
    <div style={styles.loader}></div>
  </div>
);

const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loader: {
    border: '8px solid #f3f3f3', // Light gray
    borderTop: '8px solid #3498db', // Blue
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 2s linear infinite',
  },
};

export default Loader;

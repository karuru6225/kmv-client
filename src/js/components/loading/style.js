export default themes => ({
  hide: {
    display: 'none'
  },
  center: {
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    zIndex: themes.zIndex.modal - 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  progress: {
    width: '20vw',
    height: '20vw'
  }
});

export default themes => ({
  hide: {
    display: 'none',
  },
  container: {
    position: 'absolute',
    width: '100vw',
    zIndex: themes.zIndex.modal - 1,
  },
});

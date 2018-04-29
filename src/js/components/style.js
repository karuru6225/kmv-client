export default (themes) => {
  console.log(themes);
  return {
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
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      transition: 'background-color 200ms',
    },
    progress: {
      width: '20vw',
      height: '20vw'
    }
  };
};

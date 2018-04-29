import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '../../containers/appbar';
import File from '../../models/file';

class Movie extends React.Component {
  constructor(props) {
    super(props);
    console.log('Movie Component');
    this.state = {
      appBarHeight: 48,
      windowSize: {
        width: 100,
        height: 100
      }
    };
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  render() {
    const maxWidth = this.state.windowSize.width;
    const maxHeight = this.state.windowSize.height - this.state.appBarHeight;
    return (
      <div>
        <AppBar
          {...this.props}
          onChangeHeight={(height) => {
            this.setState({
              appBarHeight: height
            });
          }}
        />
        <div
          style={{
            backgroundColor: 'gray',
            display: 'block',
            width: maxWidth,
            height: maxHeight
          }}
        />
      </div>
    );
  }
}

Movie.propTypes = {
  current: PropTypes.shape(File.shape).isRequired,
};

export default Movie;

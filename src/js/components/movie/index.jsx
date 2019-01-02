import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import videojs from 'video.js';
import '@videojs/http-streaming';

import File from '../../models/file';
import AppBase from '../common/app-base.jsx';

const styles = theme => ({
});

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.player = null;
  }

  initPlayer() {
    const {
      current
    } = this.props;
    this.player = videojs(`video-${current.id}`, {
      controls: true,
      html5: {
        hls: {
          withCredentials: true
        }
      }
    });
    const src = `${process.env.API_ENTRY}/file/${current.id}/direct`;
    this.player.src({
      src,
      type: 'application/x-mpegURL'
    });
  }

  componentDidMount() {
    this.initPlayer();
  }

  componentDidUpdate() {
    this.initPlayer();
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    const {
      current,
      cd
    } = this.props;
    return (
      <AppBase
        current={current}
        cd={cd}
      >
        <video id={`video-${current.id}`} />
      </AppBase>
    );
  }
}

Movie.propTypes = {
  current: PropTypes.instanceOf(File),
  files: PropTypes.arrayOf( PropTypes.instanceOf(File) ),
  cd: PropTypes.func.isRequired,
};

export default Movie;

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';

import File from '../../models/file';
import AppBase from '../common/app-base.jsx';

const styles = theme => ({
  container: {
    width: '100vw',
    display: 'flex',
    justifyContent: 'center'
  },
  player: {
    minWidth: '640px',
    minHeight: '480px',
    maxWidth: '100vw',
    maxHeight: 'calc(100vh - 48px)'
  }
});

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.player = null;
    this.id = null;
  }

  initPlayer() {
    const {
      current,
      token
    } = this.props;
    if (current.type === 'm3u8'
      && this.id !== current.id) {
      this.player = videojs(this.videoRef.current, {
        controls: true,
        seekToLive: true,
        controlBar: {
          liveDisplay: false
        }
      });
      const src = `${process.env.API_ENTRY}/file/${current.id}?open`;
      this.player.src({
        src,
        type: 'application/x-mpegURL',
        withCredentials: true
      });
      let lastDuration = Infinity;
      this.player.on('timeupdate', () => {
        var duration = this.player.duration();
        if(!isFinite(duration)) {
          var start = this.player.seekable().start(0);
          var end = this.player.seekable().end(0);
          if(start !== end) {
            duration = end - start - 5;
            if(duration >= 0 && duration !== lastDuration) {
              this.player.duration(duration);
              lastDuration = duration;
            } else if(isFinite(lastDuration)) {
              this.player.duration(lastDuration);
            }
          }
        }
      });
      this.id = current.id;
    }
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
      classes,
      current,
      cd
    } = this.props;
    return (
      <AppBase
        current={current}
        cd={cd}
      >
        <div className={classnames(classes.container)}>
          <video
            className={classnames('video-js', classes.player)}
            ref={this.videoRef}
          />
        </div>
      </AppBase>
    );
  }
}

Movie.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  current: PropTypes.instanceOf(File),
  cd: PropTypes.func.isRequired,
};

export default withStyles(styles)(Movie);

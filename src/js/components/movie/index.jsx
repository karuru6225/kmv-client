import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';

import File from '../../models/file';
import AppBase from '../../containers/app-base.js';
import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
  KEY_DOWN
} from '../../utils/consts';

let lastTime = 0;
const throttle = (delay, callback) => {
  if (Date.now() - lastTime > delay) {
    callback();
    lastTime = Date.now();
  }
};

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
    this.state = {
      duration: 0,
      current: 0
    };
  }

  getStartTime() {
    let sec = 0;
    if (location.search.length !== 0) {
      const qparams = {};
      location.search.substr(1).split('&').forEach((kv) => {
        const [
          key, value
        ] = kv.split('=');
        qparams[key] = value;
      });
      if (qparams.index) {
        sec = parseInt(qparams.index);
      }
    }
    return sec;
  }

  initPlayer() {
    const {
      current,
      token,
      is_playing_bookmark,
      timeupdate
    } = this.props;
    if (current.type === 'm3u8'
      && this.id !== current.id) {
      this.id = current.id;
      this.player = videojs(this.videoRef.current, {
        controls: true,
        autoplay: is_playing_bookmark,
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
          this.setState({
            duration,
            current: this.player.currentTime()
          });
        }
        throttle(1000, () => {
          timeupdate(this.id, this.player.currentTime());
        });
      });
      this.player.currentTime(this.getStartTime());
    }
  }

  handleKey = (e) => {
    switch(e.keyCode) {
      case KEY_LEFT: {
        const time = this.player.currentTime();
        this.player.currentTime(time - 5);
        break;
      }
      case KEY_RIGHT: {
        const time = this.player.currentTime();
        this.player.currentTime(time + 5);
        break;
      }
      case KEY_UP: {
        const vol = this.player.volume();
        this.player.volume(vol + 0.05);
        break;
      }
      case KEY_DOWN: {
        const vol = this.player.volume();
        this.player.volume(vol - 0.05);
        break;
      }
    }
  }

  componentDidMount() {
    this.initPlayer();
    document.addEventListener('keydown', this.handleKey);
  }

  componentDidUpdate() {
    this.initPlayer();
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
    document.removeEventListener('keydown', this.handleKey);
  }

  render() {
    const {
      classes,
      is_playing_bookmark,
    } = this.props;
    return (
      <AppBase
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
  timeupdate: PropTypes.func.isRequired,
  is_playing_bookmark: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Movie);

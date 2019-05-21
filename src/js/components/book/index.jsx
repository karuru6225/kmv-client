import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Measure from "react-measure";
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import Plus1Icon from '@material-ui/icons/ExposurePlus1';

import File from '../../models/file';
import AppBase from '../../containers/app-base.js';
import {
  BOOK_NO_CACHE,
  BOOK_LOADING,
  BOOK_CACHED
} from '../../utils/consts';

import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
  KEY_DOWN,
  KEY_SPACE
} from '../../utils/consts';

const styles = theme => ({
  container: {
    width: '100vw',
    height: 'calc(100vh - 48px)',
    display: 'flex',
    justifyContent: 'center'
  },
  containerFull: {
    width: '100vw',
    height: 'calc(100vh - 3px)',
    marginTop: '3px',
    display: 'flex',
    justifyContent: 'center'
  },
  imageContainer: {
    height: '100%',
    '& > img': {
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
    }
  },
  reverse: {
    transform: 'scaleX(-1)'
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '3px',
    zIndex: 100000,
    backgroundColor: '#eee',
    display: 'flex'
  },
  progressBarR: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '3px',
    zIndex: 100000,
    transform: 'scaleX(-1)',
    backgroundColor: '#eee',
    display: 'flex'
  },
  [`progressCell${BOOK_NO_CACHE}`]: {
    flexGrow: '1',
    borderRight: 'solid 1px #ccc',
    backgroundColor: '#eee'
  },
  [`progressCell${BOOK_LOADING}`]: {
    flexGrow: '1',
    borderRight: 'solid 1px #ccc',
    backgroundColor: '#fff'
  },
  [`progressCell${BOOK_CACHED}`]: {
    flexGrow: '1',
    borderRight: 'solid 1px #ccc',
    backgroundColor: '#CBFFD3'
  },
  progressCellCurrent: {
    flexGrow: '1',
    borderRight: 'solid 1px #ccc',
    backgroundColor: '#FFBEDA'
  },
});

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAppbar: true
    };
    this.updateActionMappings();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey);
    this.updateActionMappings();
  }

  componentDidUpdate() {
    this.updateActionMappings();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);
  }

  updateActionMappings() {
    const {
      reverse,
      toggle_reverse
    } = this.props;
    if (reverse) {
      this.actionMappings = {
        left: this.nextPage,
        up: toggle_reverse,
        center: this.toggleAppbar,
        down: this.onePage,
        right: this.prevPage
      };
    } else {
      this.actionMappings = {
        left: this.prevPage,
        up: toggle_reverse,
        center: this.toggleAppbar,
        down: this.onePage,
        right: this.nextPage
      };
    }
  }

  getRenderImages() {
    const {
      pageCount,
      images,
      page,
      reverse,
      singleMode
    } = this.props;
    const {
      width: sw,
      height: sh 
    } = this.state;
    const _page = Math.min(page, pageCount - 1);
    let targetImages = [];
    if (pageCount !== 0) {
      targetImages = images.slice(_page, _page + 2);
    }
    if (targetImages.length === 1) {
      targetImages.push({
        height: 1,
        width: 1,
        image: {
          src: ''
        }
      });
    }
    if (singleMode) {
      targetImages.pop();
    }
    if (reverse) {
      targetImages.reverse();
    }
    const ratio = singleMode ? sw/sh : sw/2/sh;
    return targetImages.map((img, idx) => {
      let cssKey = 'width';
      if (img.width/img.height < ratio) {
        cssKey = 'height';
      }
      return {
        key: _page + idx,
        cssKey,
        image: img
      };
    });
  }

  toggleAppbar = () => {
    this.setState({
      showAppbar: !this.state.showAppbar
    });
  }

  nextPage = () => {
    const {
      page,
      change_page,
      nextDiff,
    } = this.props;
    change_page(page + nextDiff);
  }

  prevPage = () => {
    const {
      page,
      change_page,
      prevDiff,
    } = this.props;
    change_page(page - prevDiff);
  }

  onePage = () => {
    const {
      page,
      change_page
    } = this.props;
    change_page(page + 1);
  }

  handleClick = (e) => {
    const {
      clientX: x,
      clientY: y
    } = e;
    const {
      width: w,
      height: h
    } = this.state;
    if (x < w * 2 / 5) {
      this.actionMappings.left();
    } else if (w * 2 / 5 <= x
      && x < w * 3 / 5 
    ) {
      if (y < h * 1 / 3) {
        this.actionMappings.up();
      } else if (h * 1 / 3 <= y
        && y < h * 2 / 3
      ) {
        this.actionMappings.center();
      } else {
        this.actionMappings.down();
      }
    } else {
      this.actionMappings.right();
    }
  }

  handleKey = (e) => {
    const {
      page,
      change_page
    } = this.props;
    switch(e.keyCode) {
      case KEY_LEFT: {
        this.actionMappings.left();
        break;
      }
      case KEY_RIGHT: {
        this.actionMappings.right();
        break;
      }
      case KEY_UP: {
        this.actionMappings.up();
        break;
      }
      case KEY_SPACE: {
        this.actionMappings.center();
        break;
      }
      case KEY_DOWN: {
        this.actionMappings.down();
        break;
      }
      default: {
        console.log(e.keyCode);
      }
    }
  }

  renderProgress() {
    const {
      classes,
      cacheStatus,
      reverse,
      singleMode,
      page
    } = this.props;
    const cacheArray = cacheStatus.split(',');
    return cacheArray.map((stat, idx) => {
      if (idx === page
        || idx === page + 1 && !singleMode ) {
        return (
          <div key={`progCell${idx}`} className={classes.progressCellCurrent} />
        );
      }
      const cPostfix = stat === '' ? BOOK_NO_CACHE : stat;
      return (
        <div key={`progCell${idx}`} className={classes[`progressCell${cPostfix}`]} />
      );
    });
  }

  renderHeaderRight() {
    const {
      classes,
      reverse,
      page,
      change_page,
      toggle_reverse
    } = this.props;
    return [
      <IconButton
        key='plus1'
        color="inherit"
        onClick={() => change_page(page + 1)}
      >
        <Plus1Icon />
      </IconButton>,
      <IconButton
        key='direction'
        color="inherit"
        className={classnames({[classes.reverse]: reverse})}
        onClick={() => toggle_reverse()}
      >
        <InputIcon />
      </IconButton>
      ];
  }

  render() {
    const {
      classes,
      images,
      pageCount,
      page,
      reverse,
      change_page,
    } = this.props;
    const {
      showAppbar
    } = this.state;
    const renderImages = this.getRenderImages();
    return (
      <AppBase
        headerRight={this.renderHeaderRight()}
        max_pos={pageCount}
        current_pos={page}
        show_appbar={showAppbar}
      >
        <div className={classnames({
          [classes.progressBar]: !reverse,
          [classes.progressBarR]: reverse
        })}>
          {this.renderProgress()}
        </div>
        <Measure
          bounds
          onResize={rect => this.setState({...rect.bounds})}
        >
          {({measureRef}) =>
            <div
              ref={measureRef}
              className={classnames({
                [classes.container]: showAppbar,
                [classes.containerFull]: !showAppbar
              })}
              onClick={this.handleClick}
            >  
              { renderImages.map((item, idx) => (
              <div
                key={item.key}
                className={classes.imageContainer}
              >
                <img
                  src={item.image.src}
                  style={{
                    [item.cssKey]: '100%'
                  }}
                />
              </div>
              )) }
            </div>
          }
        </Measure>
      </AppBase>
    );
  }
}

Book.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  pageCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  images: PropTypes.array.isRequired,
  cacheStatus: PropTypes.string.isRequired,
  prevDiff: PropTypes.number.isRequired,
  nextDiff: PropTypes.number.isRequired,
  singleMode: PropTypes.bool.isRequired,
  reverse: PropTypes.bool.isRequired,
  change_page: PropTypes.func.isRequired,
  toggle_reverse: PropTypes.func.isRequired,
};

export default withStyles(styles)(Book);

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
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
  KEY_DOWN
} from '../../utils/consts';

const styles = theme => ({
  container: {
    width: '100vw',
    height: 'calc(100vh - 48px)',
    display: 'flex',
    justifyContent: 'center'
  },
  imageContainer: {
    flexShrink: 1,
    flexGrow: 1,
    width: '50vw',
    height: '100%',
    '&:first-child': {
      textAlign: 'right'
    },
    '& > img': {
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
    }
  },
  reverse: {
    transform: 'scaleX(-1)'
  }
});

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.reverse) {
      this.actionMappings = {
        left: this.nextPage,
        center: () => {},
        right: this.prevPage
      };
    } else {
      this.actionMappings = {
        left: this.prevPage,
        center: () => {},
        right: this.prevPage
      };
    }
  }

  getPageDelta(idx) {
    if (this.props.reverse) {
      switch(idx) {
        case 0:
          return 2;
        case 1:
          return -2;
      }
    } else {
      switch(idx) {
        case 0:
          return -2;
        case 1:
          return 2;
      }
    }
  }

  nextPage = () => {
    const {
      page,
      change_page
    } = this.props;
    change_page(page + 2);
  }

  prevPage = () => {
    const {
      page,
      change_page
    } = this.props;
    change_page(page - 2);
  }

  onePage = () => {
    const {
      page,
      change_page
    } = this.props;
    change_page(page + 1);
  }

  handleClick = (e) => {
    console.log(e);
    console.log(`${this.state.width}, ${this.state.height} => ${e.clientX}, ${e.clientY}`);
    const {
      clientX: x,
      clientY: y
    } = e;
    const {
      width: w,
      height: h
    } = this.state;
    if (x < w / 3) {
      this.actionMappings.left();
    } else if ( w / 3 <= x
      && x < w * 2 / 3 ) {
      this.actionMappings.center();
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
        this.nextPage();
        break;
      }
      case KEY_RIGHT: {
        this.prevPage();
        break;
      }
      // case KEY_UP: {
      //   change_page(page + 1);
      //   break;
      // }
      case KEY_DOWN: {
        this.onePage();
        break;
      }
      default: {
        console.log(e.keyCode);
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);
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

  getRenderImages() {
    const {
      pageCount,
      images,
      page,
      reverse,
    } = this.props;
    let targetImages = [];
    if (pageCount !== 0) {
      targetImages = images.slice(page, page + 2);
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
    if (reverse) {
      targetImages.reverse();
    }
    const {
      width: sw,
      height: sh 
    } = this.state;
    const ratio = sw/2/sh;
    return targetImages.map((img, idx) => {
      let cssKey = 'width';
      if (img.width/img.height < ratio) {
        cssKey = 'height';
      }
      return {
        key: page + idx,
        cssKey,
        image: img
      };
    });
  }

  render() {
    const {
      classes,
      images,
      page,
      reverse,
      change_page,
    } = this.props;
    const renderImages = this.getRenderImages();
    return (
      <AppBase
        headerRight={this.renderHeaderRight()}
        show_progress={true}
        reverse_progress={reverse}
        max_pos={images.length}
        current_pos={page}
      >
        <Measure
          bounds
          onResize={rect => this.setState({...rect.bounds})}
        >
          {({measureRef}) =>
            <div
              ref={measureRef}
              className={classnames(classes.container)}
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
  reverse: PropTypes.bool.isRequired,
  change_page: PropTypes.func.isRequired,
  toggle_reverse: PropTypes.func.isRequired,
};

export default withStyles(styles)(Book);

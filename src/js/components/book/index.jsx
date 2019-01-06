import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Measure from "react-measure";

import File from '../../models/file';
import AppBase from '../common/app-base.jsx';
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import Plus1Icon from '@material-ui/icons/ExposurePlus1';

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
      current,
      cd,
      page,
      change_page,
    } = this.props;
    const renderImages = this.getRenderImages();
    return (
      <AppBase
        current={current}
        cd={cd}
        headerRight={this.renderHeaderRight()}
      >
        <Measure
          bounds
          onResize={rect => this.setState({...rect.bounds})}
        >
          {({measureRef}) =>
            <div
              ref={measureRef}
              className={classnames(classes.container)}
            >  
              { renderImages.map((item, idx) => (
              <div
                key={item.key}
                className={classes.imageContainer}
                onClick={e => change_page(page + this.getPageDelta(idx))}
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
  current: PropTypes.instanceOf(File),
  cd: PropTypes.func.isRequired,
};

export default withStyles(styles)(Book);

import React, { PropTypes } from 'react';
import BrowserInfo from './BrowserInfo'
import BrowserDetail from './BrowserDetail'

class Explorer extends React.Component {

  render() {

    return (
      <div>
        <BrowserInfo/>
        {/* <ImageCard {...imagecardProps} /> */}
        {/* <MapCard /> */}
        <BrowserDetail/>
      </div>
    );
  }
}

export default Explorer;

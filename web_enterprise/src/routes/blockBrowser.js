import React, { PropTypes } from 'react';
import BrowserInfo from '../components/BrowserInfo'
import BrowserDetail from '../components/BrowserDetail'

class BlockBrowser extends React.Component {

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

export default BlockBrowser;

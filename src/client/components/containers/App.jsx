import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../../assets/style/App.scss'
import * as actions from '../../actions/actions';
import ContentsContainer from './ContentsContainer.jsx';
import { ipcRenderer } from 'electron';
import ReqResCtrl from '../../controllers/connectionController'
import SidebarContainer from './SidebarContainer.jsx';
import dbController from '../../controllers/dbController'
import db from '../../db';

const mapStateToProps = store => ({
  store: store,
});

const mapDispatchToProps = dispatch => ({

});

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const wave = new Audio('../../../assets/audio/wavebig.mp3');
    // wave.play();
    ipcRenderer.on('selectAll', ReqResCtrl.selectAllResReq);
    ipcRenderer.on('deselectAll', ReqResCtrl.deselectAllResReq);
    ipcRenderer.on('openAllSelected', ReqResCtrl.openAllSelectedReqRes);
    ipcRenderer.on('closeAllSelected', ReqResCtrl.closeAllReqRes);
    ipcRenderer.on('clearAll', ReqResCtrl.clearAllReqRes);
    dbController.getHistory();
  }

  render() {
    return(
      <div id='app'>
        {/* App */}
        <SidebarContainer/>
        <ContentsContainer/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../s... Remove this comment to see the full error message;
import * as store from '../store';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../a... Remove this comment to see the full error message;
import * as actions from '../actions/actions';
import graphQLController from './graphQLController';
import { NewRequestResponseObject } from '../../types';


// @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Window & ty... Remove this comment to see the full error message
const { api }: { api: Record<string, unknown> } = window; // this is maybe not the best way to type this -Prince
const connectionController = {
  openConnectionArray: [] as any[],
  
  // toggles checked in state for entire reqResArray
  toggleSelectAll(): void {
    const { reqResArray }: { reqResArray: NewRequestResponseObject[] } = store.default.getState().business;
    
    if (reqResArray.every((obj: NewRequestResponseObject): boolean => obj.checked === true)) {
      reqResArray.forEach((obj: NewRequestResponseObject): boolean => obj.checked = false);
    } else {
      reqResArray.forEach((obj: NewRequestResponseObject): boolean => obj.checked = true);
    }
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },
  // listens for reqResUpdate event from main process telling it to update reqResObj REST EVENTS
  openReqRes(id: number): void {
    // remove all previous listeners for 'reqResUpdate' before starting to listen for 'reqResUpdate' again
    api.removeAllListeners('reqResUpdate');
    
    api.receive('reqResUpdate', (reqResObj: NewRequestResponseObject) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.response.events.length > 0
      ) {
        store.default.dispatch(actions.updateGraph(reqResObj));
      }
      store.default.dispatch(actions.reqResUpdate(reqResObj));
      // If current selected response equals reqResObj received, update current response
      const currentID = store.default.getState().business.currentResponse.id;
      if (currentID === reqResObj.id) {
        store.default.dispatch(
          actions.saveCurrentResponseData(reqResObj, 'currentID===reqResObj.id')
        );
      }
    });
    // Since only obj ID is passed in, next two lines get the current array of request objects and finds the one with matching ID
    const reqResArr: NewRequestResponseObject[] = store.default.getState().business.reqResArray;
    const reqResObj: NewRequestResponseObject = reqResArr.find((el: NewRequestResponseObject) => el.id === id);

    console.log('this is the reqResArr!!!!!!!', reqResArr);
    console.log('this is the openConnectionArray!!!!!!!', this.openConnectionArray);

    if (reqResObj.request.method === 'SUBSCRIPTION')
      graphQLController.openSubscription(reqResObj);
    else if (reqResObj.graphQL) {
      graphQLController.openGraphQLConnection(reqResObj);
    } else if (/wss?:\/\//.test(reqResObj.protocol) && !reqResObj.webrtc) {
      // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
      api.send('open-ws', reqResObj, this.openConnectionArray);

      // update the connectionArray when connection is open from ws
      api.receive('update-connectionArray', (connectionArray: any) => {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        this.openConnectionArray.push(...connectionArray);
      });
    }
    // gRPC connection
    else if (reqResObj.gRPC) {
      api.send('open-grpc', reqResObj);
      // Standard HTTP?
    } else if (reqResObj.openapi) {
      console.log('got an open api request to fill');
      console.log(reqResObj);
    } else {
      api.send('open-http', reqResObj, this.openConnectionArray);
    }
  },

  openScheduledReqRes(id: string | number): void {
    // listens for reqResUpdate event from main process telling it to update reqResObj
    // REST EVENTS
    api.removeAllListeners('reqResUpdate');
    api.receive('reqResUpdate', (reqResObj: any) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.response.events.length > 0
      ) {
        store.default.dispatch(actions.updateGraph(reqResObj));
      }
      store.default.dispatch(actions.scheduledReqResUpdate(reqResObj));
    });
    // Since only obj ID is passed in, next two lines get the current array of request objects and finds the one with matching ID
    const reqResArr = store.default.getState().business.reqResArray;
    const reqResObj = reqResArr.find((el: any) => el.id === id);
    if (reqResObj.request.method === 'SUBSCRIPTION')
      graphQLController.openSubscription(reqResObj);
    else if (reqResObj.graphQL) {
      graphQLController.openGraphQLConnection(reqResObj);
    } else if (/wss?:\/\//.test(reqResObj.protocol)) {
      // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
      api.send('open-ws', reqResObj, this.openConnectionArray);

      // update the connectionArray when connection is open from ws
      api.receive('update-connectionArray', (connectionArray: any) => {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
        this.openConnectionArray.push(...connectionArray);
      });
    }
    // gRPC connection
    else if (reqResObj.gRPC) {
      api.send('open-grpc', reqResObj);
      // Standard HTTP?
    } else {
      api.send('open-http', reqResObj, this.openConnectionArray);
    }
  },


  runCollectionTest(reqResArray: NewRequestResponseObject[]): void {
    api.removeAllListeners('reqResUpdate');
    let index = 0;
    api.receive('reqResUpdate', (reqResObj: any) => {
      if (
        (reqResObj.connection === 'closed' ||
          reqResObj.connection === 'error') &&
        reqResObj.timeSent &&
        reqResObj.timeReceived &&
        reqResObj.response.events.length > 0
      ) {
        store.default.dispatch(actions.updateGraph(reqResObj));
      }
      store.default.dispatch(actions.reqResUpdate(reqResObj));

      store.default.dispatch(
        actions.saveCurrentResponseData(reqResObj, 'api.receive reqresupdate')
      );
      if (index < reqResArray.length) {
        runSingletest(reqResArray[index]);
        index += 1;
      }
    });
    const reqResObj = reqResArray[index];

    function runSingletest(this: any, reqResObj: any) {
      if (reqResObj.request.method === 'SUBSCRIPTION')
        graphQLController.openSubscription(reqResObj);
      else if (reqResObj.graphQL) {
        graphQLController.openGraphQLConnectionAndRunCollection(reqResArray);
      } else if (/wss?:\/\//.test(reqResObj.protocol)) {
        // create context bridge to wsController in node process to open connection, send the reqResObj and connection array
        api.send('open-ws', reqResObj);

        // update the connectionArray when connection is open from ws
        api.receive('update-connectionArray', (connectionArray: any) => {
          this.openConnectionArray.push(...connectionArray);
        });
      }
      // gRPC connection
      else if (reqResObj.gRPC) {
        api.send('open-grpc', reqResObj);
        // Standard HTTP?
      } else {
        api.send('open-http', reqResObj);
      }
    }
    runSingletest(reqResObj);
    index += 1;
  },

  openAllSelectedReqRes(): void {
    connectionController.closeAllReqRes();

    const { reqResArray }: { reqResArray: NewRequestResponseObject[] } = store.default.getState().business;

    reqResArray.forEach((reqRes: NewRequestResponseObject) => connectionController.openReqRes(reqRes.id));
  },

  getConnectionObject(id: number): any {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'never'.
    return this.openConnectionArray.find((obj) => (obj.id = id));
  },

  setReqResConnectionToClosed(id: number): void {
    const reqResArr = store.default.getState().business.reqResArray;

    const foundReqRes = JSON.parse(
      JSON.stringify(reqResArr.find((reqRes: any) => reqRes.id === id))
    );

    foundReqRes.connection = 'closed';
    store.default.dispatch(actions.reqResUpdate(foundReqRes));
    store.default.dispatch(
      actions.saveCurrentResponseData(
        foundReqRes,
        'foundreqres.connection closed'
      )
    );
  },

  closeReqRes(reqResObj: NewRequestResponseObject): void {
    if (reqResObj.protocol.includes('http')) {
      api.send('close-http', reqResObj);
    }

    const { id } = reqResObj;
    this.setReqResConnectionToClosed(id);

    // WS is the only protocol using openConnectionArray
    const foundAbortController = this.openConnectionArray.find(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'never'.
      (obj) => obj.id === id
    );
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'protocol' does not exist on type 'never'... Remove this comment to see the full error message
    if (foundAbortController && foundAbortController.protocol === 'WS') {
      api.send('close-ws');
    }
    this.openConnectionArray = this.openConnectionArray.filter(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'never'.
      (obj) => obj.id !== id
    );
  },

  /* Closes all open endpoint */
  closeAllReqRes(): void {
    const { reqResArray }: { reqResArray: NewRequestResponseObject[] } = store.default.getState().business;
    reqResArray.forEach((reqRes: NewRequestResponseObject) => connectionController.closeReqRes(reqRes));
  },

  clearAllReqRes() {
    connectionController.closeAllReqRes();
    store.default.dispatch(actions.reqResClear());
  },

  // toggles minimized in ReqRes array in state
  toggleMinimizeAll() {
    const { reqResArray }: { reqResArray: NewRequestResponseObject[] } = store.default.getState().business;

    if (reqResArray.every((obj: NewRequestResponseObject) => obj.minimized === true)) {
      reqResArray.forEach((obj: NewRequestResponseObject) => obj.minimized = false);
    } else {
      reqResArray.forEach((obj: NewRequestResponseObject) => obj.minimized = true);
    }
    store.default.dispatch(actions.setChecksAndMinis(reqResArray));
  },
  // clears a dataPoint from state
  clearGraph(): void {
    store.default.dispatch(actions.clearGraph());
  },
  // clears ALL data points from state
  clearAllGraph(): void {
    store.default.dispatch(actions.clearAllGraph());
  },
};

export default connectionController;

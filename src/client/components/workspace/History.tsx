/* eslint-disable default-case */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../toolkit-refactor/hooks';
import { historyDeleted } from '../../toolkit-refactor/slices/historySlice';
import { setSidebarActiveTab } from '../../toolkit-refactor/slices/uiSlice';

import { newRequestSSESet } from '../../toolkit-refactor/slices/newRequestSlice';

import historyController from '../../controllers/historyController';

import { 
  NewRequestFields,
  OpenAPIRequest,
  NewRequestBody,
  NewRequestStreams,
  CookieOrHeader,
  ConnectionStatus,
  Protocol,
  Methods,
  Network,
  ReqResRequest,
  ReqResResponse } from '../../../types.js';
import { request } from 'http';
import { graphql } from 'graphql';

  interface NewRequestCookiesSet {
    cookiesArr: CookieOrHeader[];
    count: number;
  };
  
  interface NewRequestHeadersSet {
  headersArr: CookieOrHeader[];
  count: number;
  };

interface Props {
  newRequestFields: NewRequestFields,
  newRequestsOpenAPI: OpenAPIRequest,
  content: {
    checked: boolean;
    checkSelected: boolean;
    closeCode?: number;
    connection: ConnectionStatus;
    connectionType: string | null;
    createdAt: Date;
    error?: string;
    graphQL: boolean;
    gRPC: boolean;
    host: string;
    id: string;
    isHTTP2?: boolean;
    minimized: boolean;
    openapi?: boolean;
    protocol: Protocol;
    protoPath: string;
    path: string;
    request: ReqResRequest;
    response: ReqResResponse;
    rpc?: string;
    service?: string;
    tab: string;
    timeReceived: Date | number | null;
    timeSent: number | null;
    url: string;
    webrtc: boolean;
    frequency?: number;
    duration?: number;
  },
  connectContent: {
    request: {
      method: Methods,
      isSSE: boolean,
      headers: CookieOrHeader,
      cookies: CookieOrHeader,
      bodyType: string,
      body: string,
      bodyVariables: string,
      rawType: string,
      JSONFormatted: boolean,
      network: Network,
      restUrl: string
      wsUrl: string,
      gqlUrl: string,
      grpcUrl: string
    },
    protocol: Protocol
    url: string,
    webrtcUrl: string,
    graphQL: boolean,
    gRPC: boolean,
    webrtc: boolean,
    streamsArr: Record<string, unknown>[],
    streamContent: Record<string, unknown>[],
    queryArr: Record<string, unknown>[] | null,
    packageName: string | null,
    rpc: string,
    service: string | null,
    initialQuery: unknown | null,
    protoPath: unknown | null,
    servicesObj: any | null,
    protoContent: string
  },
  fieldsReplaced: (obj: {}) => void,
  newRequestHeadersSet: (obj: NewRequestHeadersSet) => void,
  newRequestCookiesSet: (obj: NewRequestCookiesSet) => void,
  newRequestBodySet: (obj: NewRequestBody) => void,
  newRequestStreamsSet: NewRequestStreams,
  network: Network,
  isSSE: boolean
  url: string,
  restUrl: string,
  wsUrl: string,
  gqlUrl: string,
  webrtcUrl: string,
  grpcUrl: string
  method: Methods
}

const History = (props: Props)=> {
  //destructuring props
  const {
    content,
    fieldsReplaced,
    newRequestHeadersSet,
    newRequestCookiesSet,
    newRequestBodySet,
    newRequestStreamsSet,
    newRequestFields
  } = props;

  //destructuring nested props within content
  const {
    gRPC,
    graphQL,
    protoPath,
    protocol,
    request,
    response,
    tab,
    timeReceived,
    timeSent,
    url,
    webrtc
  } = content;
  
  //destructuring nested props within content.request
  const {
    body,
    bodyType,
    bodyVariables,
    cookies,
    grpcUrl,
    isSSE,
    headers,
    method,
    messages,
    network,
    rawType,
    restUrl,
    testContent,
    testResults,
    webRtc,
    webRtcUrl,
    ws,
    wsUrl,
  } = request;

  const dispatch = useAppDispatch();
  const setSidebarTab = (tabName: string) => dispatch(setSidebarActiveTab(tabName));
  const setNewRequestSSE = (bool: boolean) => dispatch(newRequestSSESet(bool));

  const addHistoryToNewRequest = () => {

    let requestFieldObj = {};
    if (network === 'rest') {
      requestFieldObj = {
        ...newRequestFields,
        isSSE: request.isSSE,
        method: request.method,
        protocol: content.protocol,
        url: url,
        restUrl: request.restUrl,
        graphQL: content.graphQL,
        gRPC: content.gRPC,
        webrtc: content.webrtc,
        network: request.network,
        testContent: content.request.testContent,
      };
    }
    if (network === 'openApi') {
      requestFieldObj = {
        ...newRequestFields,
        ...newRequestsOpenAPI,
        isSSE: isSSE || false,
        method: connectContent.request.method || 'GET',
        protocol: connectContent.protocol || 'http://',
        url,
        restUrl,
        graphQL: connectContent.graphQL || false,
        gRPC: connectContent.gRPC || false,
        webrtc: content.webrtc,
        network,
      };
    }
    if (network === 'ws') {
      requestFieldObj = {
        ...newRequestFields,
        method: request.method || 'GET',
        protocol: protocol || 'http://',
        url: content.url,
        wsUrl,
        graphQL: graphql || false,
        gRPC: gRPC || false,
        webrtc: webrtc || false,
        network,
      };
    }
    if (network === 'graphQL') {
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url: content.url,
        gqlUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        webrtc: content.webrtc || false,
        network,
      };
    }
    if (network === 'webRtc') {
      requestFieldObj = {
        ...newRequestFields,
        method: content.request.method || 'GET',
        protocol: content.protocol || 'http://',
        url,
        webrtcUrl,
        grpcUrl,
        graphQL: content.graphQL || false,
        gRPC: content.gRPC || false,
        webrtc: content.webrtc || false,
        network,
      };
    }
    if (network === 'gRpc') {
      requestFieldObj = {
        ...newRequestFields,
        method: connectContent.request.method || 'GET',
        protocol: connectContent.protocol || 'http://',
        url,
        grpcUrl,
        graphQL: connectContent.graphQL || false,
        gRPC: connectContent.gRPC || false,
        network,
      };
    }
    let headerDeeperCopy;
    if (content?.request?.headers) {
      headerDeeperCopy = JSON.parse(JSON.stringify(content.request.headers));
      headerDeeperCopy.push({
        id: request.headers.length + 1,
        active: false,
        key: '',
        value: '',
      });
    }
    let cookieDeeperCopy;
    if (request.cookies && !/ws/.test(content.protocol)) {
      cookieDeeperCopy = JSON.parse(JSON.stringify(content.request.cookies));
      cookieDeeperCopy.push({
        id: request.cookies.length + 1,
        active: false,
        key: '',
        value: '',
      });
    }
    const requestHeadersObj = {
      headersArr: headerDeeperCopy || [],
      count: headerDeeperCopy ? headerDeeperCopy.length : 1,
    };
    const requestCookiesObj = {
      cookiesArr: cookieDeeperCopy || [],
      count: cookieDeeperCopy ? cookieDeeperCopy.length : 1,
    };
    const requestBodyObj = {
      bodyType: request.bodyType,
      bodyContent: request.body,
      bodyVariables: request.bodyVariables,
      rawType: rawType,
      JSONFormatted: request.JSONFormatted,
      bodyIsNew: false,
    };
    //call newRequestFieldsByProtocol to update protocol field to match history item selected before populating request
    //newRequestFieldsByProtocol(state, action)
    fieldsReplaced(requestFieldObj);
    newRequestHeadersSet(requestHeadersObj);
    newRequestCookiesSet(requestCookiesObj);
    newRequestBodySet(requestBodyObj);
    setNewRequestSSE(isSSE);
    // for gRPC
    if (content && gRPC) {
      const streamsDeepCopy = JSON.parse(JSON.stringify(streamsArr));
      const contentsDeepCopy = JSON.parse(JSON.stringify(streamContent));
      // construct the streams obj from passed in history content & set state in store
      const requestStreamsObj = {
        streamsArr: streamsDeepCopy,
        count: queryArr.length,
        streamContent: contentsDeepCopy,
        selectedPackage: packageName,
        selectedRequest: rpc,
        selectedService: service,
        selectedStreamingType: method,
        initialQuery,
        queryArr,
        protoPath,
        services: servicesObj,
        protoContent,
      };
      newRequestStreamsSet(requestStreamsObj);
    }
    setSidebarTab('composer');
    console.log('requestFieldObj: ',requestFieldObj)
  };

  let colorClass;

  switch (network) {
    case 'gRpc':
      colorClass = 'is-grpc-color';
      break;
    case 'rest':
      colorClass = 'is-rest-color';
      break;
    case 'graphQL':
      colorClass = 'is -graphQL-color';
      break;
    case 'ws':
      colorClass = 'is-ws-color';
      break;
    case 'openApi':;
      colorClass = 'is-openapi-color';
      break;
    case 'webRtc':
      colorClass = 'is-webrtc-color';
      break;
  }

  const deleteHistory = (event: any) => {
    dispatch(historyDeleted(content));
    historyController.deleteHistoryFromIndexedDb(event.target.id);
  };

  const urlDisplay = content.url && content.url.length > 32 ? content.url.slice(0, 32) + '...' : content.url;

  return (
    <div className="history-container is-flex is-justify-content-space-between m-3">
      <div
        className="is-clickable is-primary-link is-flex"
        onClick={() => addHistoryToNewRequest()}
      >
        <div className={`history-method mr-2 ${colorClass}`}> {content.request.method} </div>
        <div className="history-url"> {urlDisplay || '-'} </div>
      </div>
      <div className="history-delete-container">
        <div
          className="history-delete-button delete"
          onClick={(e) => deleteHistory(e)}
          id={content.id}
        />
      </div>
    </div>
  );
};

export default History;
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import { v4 as uuid } from 'uuid';
import { RootState } from '../../../toolkit-refactor/store';
// Import controllers
import historyController from '../../../controllers/historyController';

// Import local components
import NewRequestButton from '../sharedComponents/requestButtons/NewRequestButton';
import OpenAPIEntryForm from './OpenAPIEntryForm';
import OpenAPIDocumentEntryForm from './OpenAPIDocumentEntryForm';
import OpenAPIMetadata from './OpenAPIMetadata';
import OpenAPIServerForm from './OpenAPIServerForm';

// Import MUI components
import { Box } from '@mui/material';
import { $TSFixMe, ReqRes } from '../../../../types';

export default function OpenAPIComposer(props: $TSFixMe) {

  // This is a better way to import what the components needs, not the mess of prop drilling
  const newRequestsOpenAPI: $TSFixMe = useAppSelector((state: RootState) => state.newRequestOpenApi);
  
  const {
    composerFieldsReset,
    openApiRequestsReplaced,
    fieldsReplaced,
    newRequestFields,
    newRequestFields: {
      gRPC,
      webrtc,
      graphQL,
      restUrl,
      wsUrl,
      gqlUrl,
      grpcUrl,
      network,
      testContent,
    },
    newRequestBodySet,
    newRequestBody,
    newRequestBody: { rawType, bodyType },
    // newRequestHeadersSet,
    // newRequestHeaders,
    newRequestHeaders: { headersArr },
    // newRequestCookiesSet,
    currentTab,
    setWarningMessage,
    warningMessage,
    reqResItemAdded,
    setWorkspaceActiveTab,
  } = props;

  // We are only ever sending a request to one server, this one.
  // you can toggle which is the primary server in the serverEntryForm
  const [primaryServer, setPrimaryServer] = useState<string>(newRequestsOpenAPI?.openapiMetadata?.serverUrls[0] || '')

  const requestValidationCheck = () => {
    const validationMessage = {};
    //Error conditions removing the need for url for now
    return validationMessage;
  };

  const addNewRequest = () => {
    const warnings = requestValidationCheck();
    if (Object.keys(warnings).length > 0) {
      setWarningMessage(warnings);
      return;
    }

    newRequestsOpenAPI.openapiReqArray.forEach((req: $TSFixMe) => {
      const reqRes: ReqRes = {
        id: uuid(),
        createdAt: new Date(),
        host: `${primaryServer}`,
        protocol: "http://",
        url: `${primaryServer}${req.endpoint}`,
        graphQL,
        gRPC,
        webrtc,
        timeSent: null,
        timeReceived: null,
        connection: 'uninitialized',
        connectionType: null,
        checkSelected: false,
        request: {
          method: req.method,
          headers: headersArr.filter((header: $TSFixMe) => header.active && !!header.key),
          body: req.body,
          bodyType,
          rawType,
          network,
          restUrl,
          wsUrl,
          gqlUrl,
          testContent: testContent || '',
          grpcUrl,
        },
        response: {
          cookies: [],
          headers: {},
          stream: null,
          events: [],
        },
        checked: false,
        minimized: false,
        tab: currentTab,
      };
      console.log('Open_API_COmposer-> reqRes',reqRes)
      // add request to history
      /** @todo Fix TS type error */
      historyController.addHistoryToIndexedDb(reqRes);
      reqResItemAdded(reqRes);

      //reset for next request
      composerFieldsReset();

      newRequestBodySet({
        ...newRequestBody,
        bodyType: '',
        rawType: '',
      });

      fieldsReplaced({
        ...newRequestFields,
        url: `${primaryServer}${req.endpoint}`,
        restUrl,
      });
    });

    setWorkspaceActiveTab('workspace');
  };

  return (
    <Box
      className="is-flex-grow-3 add-vertical-scroll"
      sx={{
        height: '100%',
        px: 1,
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}
      id="composer-openapi"
    >
      <div
        className="is-flex-grow-3 add-vertical-scroll container-margin"
        style={{ overflowX: 'hidden' }}
      >
        {/* * @todo fix TS type error */}
        <OpenAPIEntryForm
          primaryServer={primaryServer}
          newRequestsOpenAPI={newRequestsOpenAPI}
          warningMessage={warningMessage}
        />

        <OpenAPIDocumentEntryForm/>
        <OpenAPIMetadata 
        newRequestsOpenAPI={newRequestsOpenAPI} 
        />
        <OpenAPIServerForm
          setPrimaryServer={setPrimaryServer}
          newRequestsOpenAPI={newRequestsOpenAPI}
          openApiRequestsReplaced={openApiRequestsReplaced}
        />
      </div>
      <div className="is-3rem-footer is-clickable is-margin-top-auto">
        <NewRequestButton onClick={addNewRequest} />
      </div>
    </Box>
  );
}

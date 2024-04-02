import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../toolkit-refactor/store';
import openApiController from '../../../controllers/openApiController';

// this component is working as intened

const OpenAPIDocumentEntryForm: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.ui.isDark);

  const importDoc = (): void => {
    openApiController.sendDocument();
    openApiController.importDocument();
  }

  return (
    <div className="mt-3">
      <div className="is-flex is-justify-content-flex-end is-align-content-center">
        <button
          className={`${
            isDark ? 'is-dark-300' : ''
          } button is-small is-primary mr-1`}
          onClick={() => importDoc()}
        >
          Load Document
        </button>
      </div>
    </div>
  );
};

export default OpenAPIDocumentEntryForm;

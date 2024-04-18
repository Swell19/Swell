import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../toolkit-refactor/hooks';
import EmptyState from './EmptyState';

interface Props {
  currentResponse: {
    response: {
      headers: Record<string, string>;
    };
  };
}

function HeadersContainer({ currentResponse }: Props) {
  const isDark = useAppSelector(
    (state: { ui: { isDark: boolean } }) => state.ui.isDark
  );

  if (
    !currentResponse.response ||
    !currentResponse.response.headers ||
    Object.entries(currentResponse.response.headers).length === 0
  ) {
    return <EmptyState />;
  }

  let responseHeaders;

  if (currentResponse.trpc) {
    responseHeaders = currentResponse.response.headers.map((req, reqMethod) => {
      const typeHeader = reqMethod === 0 ? 'QUERY HEADER' : 'MUTATE HEADER';
      if (!(Object.keys(req).length === 0)) {
        return (
          <tbody key={typeHeader} className="is-size-7">
            <tr>
              <td style={{ color: 'white', backgroundColor: 'rgb(72,84,108)' }}>
                {typeHeader}
              </td>
            </tr>
            {Object.entries(req).map(([key, value], index) => {
              return (
                <tr key={index}>
                  <td>{key}</td>
                  <td className="table-value">{value}</td>
                </tr>
              );
            })}
          </tbody>
        );
      }
    });
  } else {
    responseHeaders = (
      <tbody>
        {Object.entries(currentResponse.response.headers).map(
          ([key, value], index) => {
            return (
              <tr key={index}>
                <td>{key}</td>
                <td className="table-value">{value}</td>
              </tr>
            );
          }
        )}
      </tbody>
    );
  }
  return (
    <div>
      <div>
        <div className="table-container mx-3 extended">
          <table className={`${isDark ? 'is-dark-200' : ''} table mx-3`}>
            <thead className="is-size-7">
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            {responseHeaders}
          </table>
        </div>
      </div>
    </div>
  );
}

export default HeadersContainer;

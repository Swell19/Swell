import React from 'react';
import TextCodeArea from '../sharedComponents/TextCodeArea';
import { useSelector } from 'react-redux';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
//TODO: implicit and literal any used in this file
export default function TRPCVariableForm(props) {
  // input for for user to attach argument with their procedures
  const isDark = useSelector((store: any) => store.ui.isDark);
  const onChangeHandler = (string: string) => {
    // this function dispatch action to the main reducer function inside of trpc composer
    props.proceduresDipatch({
      type: 'VARIABLE',
      payload: { index: props.index, value: string },
    });
  };
  return (
    <div>
      <div id="gql-var-entry">
        <TextCodeArea
          mode="application/json"
          placeholder="Variable/s for this procedure(objects must be passed in as json format)"
          height="50px"
          value={props.procedureData.variable}
          onChange={onChangeHandler}
        />
      </div>
    </div>
  );
}


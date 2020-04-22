import React from 'react';
import './App.css';
import WorkspaceList from './WorkspaceList';

interface AppProps {
  cheDomain: string;
}

function App(props: AppProps) {
  return (
    <div className="App">
      <WorkspaceList cheDomain={props.cheDomain} />
    </div>
  );
}

export default App;

import { chameleon } from '@chameleon/engine';

import './App.css';

console.log(chameleon());

function App() {
  return <div>{chameleon().engine.key}</div>;
}

export default App;

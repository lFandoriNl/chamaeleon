import { chameleon } from '@chameleon/engine';

import './app.css';

console.log(chameleon());

export function App() {
  return (
    <div className="h-screen bg-white">
      <h1 className="text-3xl font-bold">Hello world!</h1>
    </div>
  );
}

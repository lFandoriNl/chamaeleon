import { observer } from 'mobx-react-lite';

import { useEngine } from '@chameleon/react-engine';

export const Sidebar = observer(() => {
  const engine = useEngine();

  return (
    <div className="bg-gray-800 text-white h-screen w-1/5 p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">My Sidebar</h1>
      </div>

      {!engine.rootPageBlock && <button>Add root block</button>}

      {/* <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block hover:text-blue-500">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-500">
              About
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-500">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-500">
              Contact
            </a>
          </li>
        </ul>
      </nav> */}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

import { observer } from 'mobx-react-lite';

import { useEngine } from '@chameleon/react-engine';
import { clm } from '@chameleon/component-library-manager';

import { Row } from '@chameleon/component-library-manager/library/row/row';
import { Text } from '@chameleon/component-library-manager/library/text/text';

clm.addComponent('row', {
  natural: Row,
  editorLoader: () =>
    import('@chameleon/component-library-manager/library/row/editor-row').then(
      (mod) => mod.EditorRow,
    ),
  paletteLoader: () =>
    import('@chameleon/component-library-manager/library/row/palette-row').then(
      (mod) => mod.PaletteRow,
    ),
});

clm.addComponent('text', {
  natural: Text,
  editorLoader: () =>
    import(
      '@chameleon/component-library-manager/library/text/editor-text'
    ).then((mod) => mod.EditorText),
  paletteLoader: () =>
    import(
      '@chameleon/component-library-manager/library/text/palette-text'
    ).then((mod) => mod.PaletteText),
});

Promise.all([clm.loadComponents('editor'), clm.loadComponents('palette')]);

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

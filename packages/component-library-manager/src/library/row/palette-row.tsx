import React from 'react';
import { observer } from 'mobx-react-lite';

type PaletteRowProps = object;

export const PaletteRow = observer<PaletteRowProps>(() => {
  return <div>Row</div>;
});

PaletteRow.displayName = 'PaletteRow';

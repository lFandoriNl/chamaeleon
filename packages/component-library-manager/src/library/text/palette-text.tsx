import React from 'react';
import { observer } from 'mobx-react-lite';

type PaletteTextProps = object;

export const PaletteText = observer<PaletteTextProps>(() => {
  return <div>Typography</div>;
});

PaletteText.displayName = 'PaletteText';

import React from 'react';

import { BlockId, Block } from '@chameleon/engine';

import { PaletteLoading } from './palette-loading';

type Component = React.FunctionComponent<{
  blockId: BlockId;
}>;

type ComponentPack = {
  editor: Component;
  palette: Component;
  paletteLoader?: () => Promise<Component>;
};

class ComponentLibraryManager {
  private components: Partial<Record<Block['type'], ComponentPack>> = {};

  addComponent(name: Block['type'], pack: Omit<ComponentPack, 'palette'>) {
    if (this.components[name]) {
      throw new Error(`Component "${name}" already exists.`);
    }

    this.components[name] = {
      ...pack,
      palette: PaletteLoading,
    };
  }

  getEditorComponent(name: Block['type']) {
    if (!this.components[name])
      throw new Error(`Component "${name}" dost not exist.`);

    return this.components[name].editor;
  }

  getPaletteComponent(name: Block['type']) {
    return this.components[name].palette;
  }

  removeComponent(name: Block['type']) {
    delete this.components[name];
  }

  async loadPaletteComponents() {
    const paletteComponents = await Promise.all(
      Object.keys(this.components)
        .filter((name) => Boolean(this.components[name].paletteLoader))
        .map(async (name) => {
          const palette = await this.components[name].paletteLoader();

          return {
            name,
            palette,
          };
        }),
    );

    paletteComponents.forEach(({ name, palette }) => {
      this.components[name].palette = palette;
    });
  }
}

export const clm = new ComponentLibraryManager();

// @ts-expect-error
window.clm = clm;

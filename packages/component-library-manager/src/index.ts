import React from 'react';

import { BlockId, Block } from '@chameleon/engine';

import { PaletteLoading } from './palette-loading';

type Component = React.FunctionComponent<{
  blockId: BlockId;
}>;

type ComponentPack = {
  natural: Component;
  editor: Component;
  editorLoader?: () => Promise<Component>;
  palette: Component;
  paletteLoader?: () => Promise<Component>;
};

class ComponentLibraryManager {
  private components: Partial<Record<Block['type'], ComponentPack>> = {};

  addComponent(
    name: Block['type'],
    pack: Omit<ComponentPack, 'editor' | 'palette'>,
  ) {
    if (this.components[name]) {
      throw new Error(`Component "${name}" already exists.`);
    }

    this.components[name] = {
      ...pack,
      editor: () => null,
      palette: PaletteLoading,
    };
  }

  getNaturalComponent(name: Block['type']) {
    if (!this.components[name])
      throw new Error(`Component "${name}" dost not exist.`);

    return this.components[name].natural;
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

  async loadComponents(type: 'editor' | 'palette') {
    const loadedComponents = await Promise.all(
      Object.keys(this.components)
        .filter((name) => Boolean(this.components[name][`${type}Loader`]))
        .map(async (name) => {
          const component = await this.components[name][`${type}Loader`]();

          return {
            name,
            component,
          };
        }),
    );

    loadedComponents.forEach(({ name, component }) => {
      this.components[name][type] = component;
    });
  }
}

export const clm = new ComponentLibraryManager();

// @ts-expect-error
window.clm = clm;

import React from 'react';

import { BlockId, Block } from '@chameleon/engine';

import { PaletteLoading } from './palette-loading';

type Component = React.FunctionComponent<{
  blockId: BlockId;
}>;

type ComponentPack = {
  Natural: Component;
  Editor: Component;
  editorLoader?: () => Promise<Component>;
  Palette: Component;
  paletteLoader?: () => Promise<Component>;
};

class ComponentLibraryManager {
  private components: Partial<Record<Block['type'], ComponentPack>> = {};

  addComponent(
    name: Block['type'],
    pack: Omit<ComponentPack, 'Editor' | 'Palette'>,
  ) {
    if (this.components[name]) {
      throw new Error(`Component "${name}" already exists.`);
    }

    this.components[name] = {
      ...pack,
      Editor: () => null,
      Palette: PaletteLoading,
    };
  }

  getNaturalComponent(name: Block['type']) {
    if (!this.components[name])
      throw new Error(`Component "${name}" dost not exist.`);

    return this.components[name].Natural;
  }

  getEditorComponent(name: Block['type']) {
    if (!this.components[name])
      throw new Error(`Component "${name}" dost not exist.`);

    return this.components[name].Editor;
  }

  getPaletteComponent(name: Block['type']) {
    return this.components[name].Palette;
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

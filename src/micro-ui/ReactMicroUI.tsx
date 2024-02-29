import React, { ComponentType } from 'react';
import MicroUI, { MountArgs } from './MicroUI';
import { createRoot } from 'react-dom/client';
import { unmountComponentAtNode } from 'react-dom';

interface Props<T> {
  componentId: string;
  component: ComponentType<T>
}

class ReactMicroUI<T> extends MicroUI {
  private _elem: HTMLElement | null = null;
  private readonly _component: ComponentType<T>;

  constructor({ component, componentId }: Props<T>) {
    super(componentId);
    this._component = component;
  }

  mount(args: MountArgs) {
    const { elem, props = {} } = args;
    this._elem = elem;
    const Component = this._component;
    const root = createRoot(this._elem);
    root.render(<Component {...props} />);
  }

  unmount(): void {
    if(this._elem) {
      unmountComponentAtNode(this._elem);
    }
  }
}

export default ReactMicroUI;

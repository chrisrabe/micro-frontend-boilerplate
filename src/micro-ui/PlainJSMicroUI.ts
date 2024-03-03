import MicroUI, { MountArgs } from './MicroUI';

export type PlainJSComponent<T> = (props: T) => HTMLElement;

interface PlainJSProps<T> {
  componentId: string;
  component: PlainJSComponent<T>;
}

class PlainJSMicroUI<T> extends MicroUI {
  private _elems: HTMLElement[] = [];
  private readonly _component: PlainJSComponent<T>;
  
  constructor({ component, componentId }: PlainJSProps<T>) {
    super(componentId);
    this._component = component;
  }

  mount(args: MountArgs): void {
    const { elem, props } = args;
    this._elems.push(elem);
    elem.appendChild(this._component(props));
  }

  unmount(): void {
    for (const elem of this._elems) {
      let child = elem.lastElementChild;
      while(child) {
        elem.removeChild(child);
        child = elem.lastElementChild;
      }
    }
  }
}

export default PlainJSMicroUI;

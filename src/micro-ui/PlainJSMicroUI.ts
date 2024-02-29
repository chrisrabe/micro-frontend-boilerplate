import MicroUI, { MountArgs } from './MicroUI';

export type PlainJSComponent<T> = (props: T) => HTMLElement;

interface PlainJSProps<T> {
  componentId: string;
  component: PlainJSComponent<T>;
}

class PlainJSMicroUI<T> extends MicroUI {
  private _elem: HTMLElement | null = null;
  private readonly _component: PlainJSComponent<T>;
  
  constructor({ component, componentId }: PlainJSProps<T>) {
    super(componentId);
    this._component = component;
  }

  mount(args: MountArgs): void {
    const { elem, props } = args;
    this._elem = elem;
    elem.appendChild(this._component(props));
  }

  unmount(): void {
    if(this._elem) {
      let child = this._elem.lastElementChild;
      while(child) {
        this._elem.removeChild(child);
        child = this._elem.lastElementChild;
      }
    }
  }
}

export default PlainJSMicroUI;

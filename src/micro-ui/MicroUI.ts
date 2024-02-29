export interface MountArgs {
  elem: HTMLElement;
  props?: any;
}

abstract class MicroUI {
  protected constructor(componentId: string) {
    // Emits MicroFrontendLoaded event as soon as document is ready
    const readyStateCheckInterval = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(readyStateCheckInterval);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore mount this script into window object
        window[componentId] = this;
        document.dispatchEvent(new CustomEvent('MicroFrontendLoaded', { detail: componentId }));
      }
    });
  }

  abstract mount(args: MountArgs): void;
  abstract unmount(): void;
}

export default MicroUI;

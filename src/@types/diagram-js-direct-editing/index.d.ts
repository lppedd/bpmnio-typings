declare module 'diagram-js-direct-editing' {
  import { DJSModule } from 'diagram-js';
  import { Base } from 'diagram-js/lib/model';

  const directEditingModule: DJSModule;
  export default directEditingModule;

  export interface DirectEditingProvider {
    activate(element: Base): BoundContext | undefined;
    update(
      element: any,
      newLabel: string | null,
      activeContextText: string | null,
      bounds: Bounds
    ): void;
  }

  export interface BoundContext {
    text: string;
    bounds: Bounds;
    style?: Style;
  }

  export interface Bounds {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
  }

  export interface Style {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: null;
    paddingTop: string;
    paddingBottom: string;
  }
}

declare module 'diagram-js-direct-editing/lib/DirectEditing' {
  import { DirectEditingProvider } from 'diagram-js-direct-editing';
  import Canvas from 'diagram-js/lib/core/Canvas';
  import EventBus from 'diagram-js/lib/core/EventBus';
  import { Base } from 'diagram-js/lib/model';

  export default class DirectEditing {
    constructor(eventBus: EventBus, canvas: Canvas);

    registerProvider(provider: DirectEditingProvider): void;
    isActive(): boolean;
    cancel(): void;
    complete(): void;
    getValue(): string;
    activate(element: Base): boolean;
  }
}

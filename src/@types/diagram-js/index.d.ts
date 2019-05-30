declare module 'diagram-js' {
  import { Service, ServiceName, ViewerOptions } from 'bpmn-js';

  export default class Diagram {
    constructor(options?: ViewerOptions, injector?: any);

    get<T extends ServiceName | string>(service: T): Service<T>;

    invoke(fn: (...v: any[]) => void | any[]): void;

    /**
     * Destroys the diagram.
     */
    destroy(): void;

    /**
     * Clear the diagram, removing all contents.
     */
    clear(): void;
  }
}

declare module 'diagram-js/lib/core/EventBus' {
  import { Event, Shape } from 'bpmn-js';

  export default class EventBus {
    /**
     * Register an event listener for events with the given name.
     *
     * The callback will be invoked with `event, ...additionalArguments`
     * that have been passed to {@link EventBus#fire}.
     *
     * Returning false from a listener will prevent the events default action
     * (if any is specified). To stop an event from being processed further in
     * other listeners execute {@link Event#stopPropagation}.
     *
     * Returning anything but `undefined` from a listener will stop the listener propagation.
     *
     * @param events The events to listen to
     * @param priority The priority in which this listener is called, larger is higher
     */
    on(
      events: string | string[],
      priority: number,
      callback: EventCallback,
      that?: object
    ): void;

    /** @see EventBus#on */
    on(events: string | string[], callback: EventCallback, that?: object): void;

    /**
     * Register an event listener that is executed only once.
     *
     * @param event The event to listen to
     * @param priority The priority in which this listener is called, larger is higher
     */
    once(event: string, priority: number, callback: EventCallback): void;

    /** @see EventBus#once */
    once(event: string, callback: EventCallback): void;

    /**
     * Removes event listeners by event and callback.
     *
     * If no callback is given, all listeners for a given event name are being removed.
     */
    off(events: string | string[], callback?: EventCallback): void;

    /**
     * Create an EventBus event.
     */
    createEvent(data?: any): InternalEvent;

    /**
     * Fires a named event.
     *
     * @example
     *
     * // fire event by name
     * events.fire('foo');
     *
     * // fire event object with nested type
     * var event = { type: 'foo' };
     * events.fire(event);
     *
     * // fire event with explicit type
     * var event = { x: 10, y: 20 };
     * events.fire('element.moved', event);
     *
     * // pass additional arguments to the event
     * events.on('foo', function(event, bar) {
     *   alert(bar);
     * });
     *
     * events.fire({ type: 'foo' }, 'I am bar!');
     *
     * @param name The event name
     * @param event The event object
     * @param data Additional arguments to be passed to the callback functions
     *
     * @return the events return value, if specified or false if the
     *         default action was prevented by listeners
     */
    fire(
      name: string | { type: string },
      event: InternalEvent | any,
      ...data: any[]
    ): any;

    handleError(error: any): boolean;
  }

  export type EventCallback = (event: InternalEvent, data: object[]) => any | void;

  export interface InternalEvent {
    element: Shape;
    gfx: SVGElement;
    originalEvent: MouseEvent;
    type?: string;

    [field: string]: any;

    init(data: any): void;

    stopPropagation(): void;

    preventDefault(): void;
  }
}

declare module 'diagram-js/lib/core/ElementRegistry' {
  import { Base } from 'bpmn-js';
  import EventBus from 'diagram-js/lib/core/EventBus';

  export default class ElementRegistry {
    constructor(eventBus: EventBus);

    /**
     * Register a pair of (element, gfx, (secondaryGfx)).
     */
    add(element: Base, gfx: SVGElement, secondaryGfx?: SVGElement): void;

    /**
     * Removes an element from the registry.
     */
    remove(element: string | Base): void;

    /**
     * Update the id of an element
     */
    updateId(element: string | Base, newId: string): void;

    /**
     * Return the model element for a given id or graphics.
     *
     * @example
     * elementRegistry.get('SomeElementId_1');
     * elementRegistry.get(gfx);
     *
     * @param filter The filter for selecting the element
     */
    get(filter: string | SVGElement): Base;

    /**
     * Return all elements that match a given filter function.
     */
    filter(fn: (element: Base, gfx: SVGElement) => boolean): Base[];

    /**
     * Return all rendered model elements.
     */
    getAll(): Base[];

    /**
     * Iterate over all diagram elements.
     */
    forEach(fn: (element: Base, gfx: SVGElement) => any): void;

    /**
     * Return the graphical representation of an element or its id.
     *
     * @example
     * elementRegistry.getGraphics('SomeElementId_1');
     * elementRegistry.getGraphics(rootElement); // <g ...>
     *
     * elementRegistry.getGraphics(rootElement, true); // <svg ...>
     *
     *
     * @param filter The filter to use
     * @param secondary Whether to return the secondary connected element
     */
    getGraphics(filter: string | Base, secondary?: boolean): SVGElement;
  }
}

declare module 'diagram-js/lib/core/ElementFactory' {
  import { Base, Connection, Label, Point, Root, Shape } from 'bpmn-js';

  /**
   * A factory for diagram-js shapes.
   */
  export default class ElementFactory {
    createRoot(attrs?: Attributes): Root;

    createLabel(attrs?: Attributes): Label;

    createShape(attrs?: Attributes): Shape;

    createConnection(attrs?: Attributes): Connection;

    create(type: string, attrs?: Attributes): Base;
  }

  export interface Attributes {
    id?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    collapsed?: boolean;
    hidden?: boolean;
    resizable?: boolean | 'maybe' | 'always';
    ignoreResize?: boolean;
    waypoints?: Point[];
    source?: Shape;
    target?: Shape;
    host?: Shape;
    alwaysTopLevel?: boolean;
    level?: number;
    labelTarget?: Base;
  }
}

declare module 'diagram-js/lib/core/Canvas' {
  import { ViewerOptions } from 'bpmn-js';
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
  import EventBus from 'diagram-js/lib/core/EventBus';
  import GraphicsFactory from 'diagram-js/lib/core/GraphicsFactory';

  export default class Canvas {
    constructor(
      config: ViewerOptions | null,
      eventBus: EventBus,
      graphicsFactory: GraphicsFactory,
      elementRegistry: ElementRegistry
    );
  }
}

declare module 'diagram-js/lib/core/GraphicsFactory' {
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
  import EventBus from 'diagram-js/lib/core/EventBus';

  export default class GraphicsFactory {
    constructor(eventBus: EventBus, elementRegistry: ElementRegistry);
  }
}

declare module 'diagram-js/lib/i18n/translate' {
  import t from 'diagram-js/lib/i18n/translate/translate';

  const exp: {
    translate: ['value', typeof t];
  };

  export default exp;
}

declare module 'diagram-js/lib/i18n/translate/translate' {
  // noinspection JSFunctionExpressionToArrowFunction
  export default function translate(
    template: string,
    replacements?: { [id: string]: string }
  ): string;
}

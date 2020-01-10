/**
 * Typings for the bpmn-js-cli project.
 *
 * @author Edoardo Luppi
 */
declare module 'bpmn-js-cli' {
  import cliModule from 'bpmn-js-cli/lib';

  export default cliModule;
}

declare module 'bpmn-js-cli/lib' {
  import { DJSModule } from 'diagram-js';

  export interface Point {
    x: number;
    y: number;
  }

  const cliModule: DJSModule;
  export default cliModule;
}

declare module 'bpmn-js-cli/lib/Initializer' {
  import Cli from 'bpmn-js-cli/lib/Cli';

  /**
   * The default CLI initializer that sets up available parsers and commands.
   *
   * @param cli The Cli object to initialize
   */
  export default class Initializer {
    constructor(cli: Cli);
  }
}

declare module 'bpmn-js-cli/lib/Cli' {
  import { Point } from 'bpmn-js-cli/lib';
  import { Connection, Shape } from 'diagram-js/lib/model';
  import { Injector } from 'didi';

  export default class Cli {
    constructor(config: any, injector: Injector);

    append(source: string | Shape, type: string, delta: string | Point): string;

    connect(
      sourceId: string | Shape,
      target: string | Shape,
      type: string,
      parent?: string | Shape
    ): string;

    create(
      type: string,
      position: Point,
      parent: string | Shape,
      isAttach?: boolean
    ): string;

    elements(): string[];

    move(
      shapes: (string | Shape)[],
      delta: Point,
      newParent?: string | Shape,
      isAttach?: boolean
    ): Shape[];

    removeConnection(element: string | Connection): Connection;

    removeShape(shape: string | Shape): Shape;

    setLabel(element: string | Shape, label: string): void;

    undo(): void;

    redo(): void;

    save(format: 'svg' | 'bpmn'): void;
  }
}

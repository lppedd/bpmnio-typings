/**
 * Typings for the bpmn-js project.
 *
 * @author Edoardo Luppi
 */
declare module 'bpmn-js' {
  import Diagram from 'diagram-js';
  import Canvas from 'diagram-js/lib/core/Canvas';
  import ElementFactory from 'diagram-js/lib/core/ElementFactory';
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
  import EventBus from 'diagram-js/lib/core/EventBus';
  import translate from 'diagram-js/lib/i18n/translate/translate';
  import { Descriptor } from 'moddle/lib/descriptor-builder';
  import Moddle from 'moddle/lib/moddle';

  export default class Viewer extends Diagram {
    constructor(options?: ViewerOptions);

    get<T extends ServiceName | string>(service: T): Service<T>;

    invoke(fn: (...v: any[]) => void | any[]): void;

    /**
     * Parse and render a BPMN 2.0 diagram.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During import the viewer will fire life-cycle events:
     *
     *   * import.parse.start (about to read model from xml)
     *   * import.parse.complete (model read; may have worked or not)
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *   * import.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param xml The BPMN 2.0 xml
     * @param bpmnDiagram BPMN diagram or ID of diagram to render
     *                    (if not provided, the first one will be rendered)
     * @param done The completion callback
     */
    importXML(
      xml: string,
      bpmnDiagram: BpmnDiDiagram | string,
      done?: DoneCallback
    ): void;
    importXML(xml: string, done: DoneCallback): void;

    /**
     * Open diagram of previously imported XML.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During switch the viewer will fire life-cycle events:
     *
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param diagram ID or the diagram to open
     * @param done The completion callback
     */
    open(diagram: BpmnDiDiagram | string, done?: DoneCallback);
    open(done: DoneCallback): void;

    /**
     * Export the currently displayed BPMN 2.0 diagram as
     * a BPMN 2.0 XML document.
     *
     * ## Life-Cycle Events
     *
     * During XML saving the viewer will fire life-cycle events:
     *
     *   * saveXML.start (before serialization)
     *   * saveXML.serialized (after xml generation)
     *   * saveXML.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @param options Output formatted XML or/and preamble
     * @param done The completion callback
     */
    saveXML(options: WriterOptions, done: DoneCallback): void;
    saveXML(done: DoneCallback): void;

    /**
     * Export the currently displayed BPMN 2.0 diagram as
     * an SVG image.
     *
     * ## Life-Cycle Events
     *
     * During SVG saving the viewer will fire life-cycle events:
     *
     *   * saveSVG.start (before serialization)
     *   * saveSVG.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     */
    saveSVG(options: WriterOptions, done: DoneCallback): void;
    saveSVG(done: DoneCallback): void;

    /**
     * Remove all drawn elements from the viewer.
     *
     * After calling this method the viewer can still
     * be reused for opening another diagram.
     */
    clear(): void;

    /**
     * Destroy the viewer instance and remove all its
     * remainders from the document tree.
     */
    destroy(): void;

    /**
     * Register an event listener.
     *
     * Remove a previously added listener via {@link #off(event, callback)}.
     */
    on<T extends Event>(event: T, priority: number, callback: Callback<T>): void;
    on<T extends Event>(event: T, callback: Callback<T>): void;

    /**
     * De-register an event listener.
     */
    off(events: Event | Event[], callback: Callback<Event>): void;

    attachTo(parentNode: string | Element): void;

    detach(): void;
  }

  export interface ViewerOptions {
    container?: string | Element;
    width?: string | number;
    height?: string | number;
    position?: string;
    deferUpdate?: boolean;
    modules?: any[];
    additionalModules?: any[];
    moddleExtensions?: { [k: string]: any };
    propertiesPanel?: {
      parent: string | Element;
    };

    [field: string]: any;
  }

  export interface WriterOptions {
    format?: boolean;
    preamble?: boolean;
  }

  export type DoneCallback = (err: any, warn: any[]) => void;

  /* Events types */

  export type GenericEvent = 'attach' | 'detach';
  export type DiagramEvent = 'diagram.init' | 'diagram.destroy' | 'diagram.clear';
  export type ImportEvent =
    | 'import.done'
    | 'import.parse.start' // (about to read model from xml)
    | 'import.parse.complete' // (model read; may have worked or not)
    | 'import.render.start' // (graphical import start)
    | 'import.render.complete' // (graphical import finished)
    | 'import.done'; // (everything done)
  export type SaveEvent =
    | 'saveXML.start' // (before serialization)
    | 'saveXML.serialized' // (after xml generation)
    | 'saveXML.done'; // (everything done)
  export type SvgEvent =
    | 'saveSVG.start' // (before serialization)
    | 'saveSVG.done'; // (everything done)
  export type ElementEvent =
    | 'element.changed'
    | 'element.hover'
    | 'element.out'
    | 'element.click'
    | 'element.dblclick'
    | 'element.mousedown'
    | 'element.mouseup';
  export type Event =
    | GenericEvent
    | DiagramEvent
    | ElementEvent
    | ImportEvent
    | SaveEvent
    | SvgEvent;

  export interface ElementObject {
    element: Root;
    gfx: SVGElement;
    originalEvent: Event;
    type: ElementEvent;
  }

  export interface Base {
    id: string;
    type: string;

    /**
     * Actual element that gets imported from BPMN 2.0 XML
     * and serialized during export.
     */
    businessObject: BpmnBaseElement;
    label: Label;
    parent: Shape;
    labels: Label[];
    outgoingRefs: Connection[];
    incomingRefs: Connection[];
  }

  export interface Point {
    x: number;
    y: number;
    original?: Point;
  }

  export interface Connection extends Base {
    source: Base;
    target: Base;
    waypoints?: Point[];
  }

  export interface Shape extends Base {
    children: Base[];
    host: Shape;
    attachers: Shape[];
    collapsed?: boolean;
    hidden?: boolean;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
  }

  export interface Root extends Shape {
  }

  export interface Label extends Shape {
    labelTarget: Base;
  }

  // prettier-ignore
  export type CallbackObject<T extends Event> =
    T extends ElementEvent | SaveEvent ? ElementObject : any;

  export type ServiceName =
    | 'eventBus'
    | 'elementFactory'
    | 'elementRegistry'
    | 'canvas'
    | 'moddle'
    | 'translate';

  export type Service<T extends string> = ServiceMap extends Record<T, infer E> ? E : any;

  interface ServiceMap {
    eventBus: EventBus;
    elementRegistry: ElementRegistry;
    elementFactory: ElementFactory;
    canvas: Canvas;
    moddle: Moddle;
    translate: typeof translate;
  }

  export type Callback<T extends Event> = (e: CallbackObject<T>) => void;

  /////// BPMN ///////

  export enum BpmnRelationshipDirection {
    None = 'None',
    Forward = 'Forward',
    Backward = 'Backward',
    Both = 'Both'
  }

  export interface BpmnExtension {
    mustUnderstand: boolean;
    definition?: BpmnExtensionDefinition;
  }

  export interface BpmnImport {
    importType: string;
    location?: string;
    namespace: string;
  }

  export interface BpmnExtensionDefinition {
    name: string;
    extensionAttributeDefinitions?: BpmnExtensionAttributeDefinition[];
  }

  export interface BpmnExtensionAttributeDefinition {
    name: string;
    type: string;
    isReference?: boolean;
  }

  export abstract class ModdleBase {
    $model: Moddle;
    $descriptor: Descriptor;
    $instanceOf: (element: ModdleElement, type?: string) => boolean;

    get(name: string): any;

    set(name: string, value: any): void;
  }

  export abstract class ModdleElement extends ModdleBase {
    static $model: Moddle;
    static $descriptor: Descriptor;

    readonly $type: string;
    $attrs: any;
    $parent: ModdleElement;

    [field: string]: any;

    static hasType(element: ModdleElement, type?: string): boolean;
  }

  export abstract class BpmnBaseElement extends ModdleElement {
    id: string;
    documentation?: BpmnDocumentation;
    extensionDefinitions?: BpmnExtensionDefinition[];
    extensionElements?: BpmnExtensionElements;
  }

  export class BpmnExtensionElements extends ModdleElement {
    readonly $type: 'bpmn:ExtensionElements';
    values?: ModdleElement[];
    valueRef?: Element;
    extensionAttributeDefinition?: BpmnExtensionAttributeDefinition;
  }

  export class BpmnDocumentation extends BpmnBaseElement {
    readonly $type: 'bpmn:Documentation';
    text: string;
    textFormat: string;
  }

  export class BpmnStartEvent extends BpmnBaseElement {
    readonly $type: 'bpmn:StartEvent';
  }

  export class RootElement extends BpmnBaseElement {
  }

  export class BpmnRelationship extends BpmnBaseElement {
    readonly $type: 'bpmn:Relationship';
    type?: string;
    direction?: BpmnRelationshipDirection;
    source?: Element[];
    target?: Element[];
  }

  export class BpmnDefinitions extends BpmnBaseElement {
    readonly $type: 'bpmn:Definitions';
    name: string;
    targetNamespace: string;
    expressionLanguage?: string;
    typeLanguage: string;
    rootElements?: RootElement[];
    diagrams?: BpmnDiDiagram[];
    imports?: BpmnImport[];
    extensions?: BpmnExtension[];
    relationships?: BpmnRelationship[];
    exporter?: string;
    exporterVersion?: string;
  }

  /////// DI ///////

  export interface DiDiagram {
    id: string;
    rootElement: DiDiagramElement;
    name: string;
    documentation: string;
    resolution: number;
    ownedStyle: DiStyle[];
  }

  export interface DiDiagramElement {
    id: string;
    extension: DiExtension;
    owningDiagram: DiDiagram;
    owningElement: DiDiagramElement;
    modelElement: Element;
    style: DiStyle;
    ownedElement: DiDiagramElement;
  }

  export interface DiNode extends DiDiagramElement {
  }

  export interface DiPlane extends DiNode {
    planeElement: DiDiagramElement[];
  }

  export interface DiExtension {
    values: Element[];
  }

  export interface DiStyle {
    id: string;
  }

  export interface DiEdge extends DiDiagramElement {
    source?: DiDiagramElement;
    target?: DiDiagramElement;
    waypoint?: DcPoint[];
  }

  export interface DiShape extends DiNode {
    bounds: DcBounds;
  }

  export interface DiLabeledEdge extends DiEdge {
    ownedLabel?: DiLabel;
  }

  export interface DiLabeledShape extends DiShape {
    ownedLabel?: DiLabel;
  }

  export interface DiLabel extends DiNode {
    bounds: DcBounds;
  }

  /////// BPMNDI ///////

  export interface BpmnDiDiagram extends DiDiagram, ModdleElement {
    $type: 'bpmndi:BPMNDiagram';
    plane: BpmnDiPlane;
    labelStyle: BpmnDiLabelStyle[];
  }

  export interface BpmnDiEdge extends DiLabeledEdge, ModdleElement {
    $type: 'bpmndi:BPMNEdge';
    bpmnElement: BpmnBaseElement;
  }

  export interface BpmnDiPlane extends DiPlane, ModdleElement {
    $type: 'bpmndi:BPMNPlane';
    bpmnElement: BpmnBaseElement;
  }

  export interface BpmnDiShape extends DiLabeledShape, ModdleElement {
    $type: 'bpmndi:BPMNShape';
    bpmnElement: BpmnBaseElement;
    isHorizontal?: boolean;
    isExpanded?: boolean;
    isMarkerVisible?: boolean;
    label: BpmnDiLabel;
    isMessageVisible?: boolean;
    participantBandKind?: BpmnDiParticipantBandKind;
    choreographyActivityShape: BpmnDiShape;
  }

  export interface BpmnDiLabel extends DiLabel, ModdleElement {
    $type: 'bpmndi:BPMNLabel';
    labelStyle?: BpmnDiLabelStyle;
  }

  export interface BpmnDiLabelStyle extends DiStyle {
    font: DcFont;
  }

  export enum BpmnDiParticipantBandKind {
    TopInitiating = 'top_initiating',
    MiddleInitiating = 'middle_initiating',
    BottomInitiating = 'bottom_initiating',
    TopNonInitiating = 'top_non_initiating',
    MiddleNonInitiating = 'middle_non_initiating',
    BottomNonInitiating = 'bottom_non_initiating'
  }

  /////// DC ///////

  export interface DcBounds {
    x: number;
    y: number;
    width?: number;
    height?: number;
  }

  export interface DcFont {
    name?: string;
    size?: number;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isStrikeThrough?: boolean;
  }

  export interface DcPoint {
    x: number;
    y: number;
  }
}

declare module 'bpmn-js/lib/Modeler' {
  import Viewer, { DoneCallback, ViewerOptions } from 'bpmn-js';

  export default class Modeler extends Viewer {
    constructor(options?: ViewerOptions);

    /**
     * Create a new diagram to start modeling.
     */
    createDiagram(done: DoneCallback): void;
  }
}

declare module 'bpmn-js/lib/util/ModelUtil' {
  import { Base, ModdleElement } from 'bpmn-js';

  /**
   * Is an element of the given BPMN type?
   */
  export function is(element: Base | ModdleElement, type: string): boolean;

  /**
   * Return the business object for a given element.
   */
  export function getBusinessObject(element: Base | ModdleElement): ModdleElement;
}

declare module 'bpmn-js/lib/features/modeling/BpmnFactory' {
  import {
    BpmnBaseElement,
    BpmnDiEdge,
    BpmnDiLabel,
    BpmnDiPlane,
    BpmnDiShape,
    DcBounds,
    DcPoint,
    ModdleElement
  } from 'bpmn-js';
  import { Attributes } from 'diagram-js/lib/core/ElementFactory';

  export default class BpmnFactory {
    constructor(moddle: any);

    create(type: string | object, attrs: Attributes): ModdleElement;

    createDiLabel(): BpmnDiLabel;

    createDiShape(
      semantic: BpmnBaseElement,
      bounds: object,
      attrs: Attributes
    ): BpmnDiShape;

    createDiBounds(bounds: object): DcBounds;

    createDiWaypoints(waypoints: DcPoint[]): DcPoint[];

    createDiWaypoint(point: DcPoint): DcPoint;

    createDiEdge(
      semantic: BpmnBaseElement,
      waypoints: DcPoint[],
      attrs: Attributes
    ): BpmnDiEdge;

    createDiPlane(semantic: BpmnBaseElement): BpmnDiPlane;
  }
}

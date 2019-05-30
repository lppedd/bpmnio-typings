declare module 'moddle' {
  export { default } from 'moddle/lib/moddle';
}

declare module 'moddle/lib/moddle' {
  import {
    BpmnDefinitions,
    BpmnDocumentation,
    BpmnExtensionElements,
    BpmnRelationship,
    BpmnStartEvent,
    ModdleElement
  } from 'bpmn-js';
  import { Attributes } from 'diagram-js/lib/core/ElementFactory';
  import { Descriptor } from 'moddle/lib/descriptor-builder';

  export default class Moddle {
    constructor(packages: { [ns: string]: Package });

    create<T extends BpmnElementType | string>(
      descriptor: T | Descriptor,
      attrs?: Attributes
    ): BpmnElement<T>;

    getType<T extends BpmnElementType | string>(
      descriptor: T | Descriptor
    ): ModdleElementCtor<T>;
  }

  export interface Package {
    associations: any[];
    enumerations?: any[];
    name: string;
    prefix: string;
    uri: string;
    types: Type[];
    xml?: any;
  }

  export interface Type {
    name: string;
    // TODO
  }

  export type BpmnElementType =
    | 'bpmn:ExtensionElements'
    | 'bpmn:Documentation'
    | 'bpmn:Definitions'
    | 'bpmn:Relationship'
    | 'bpmn:StartEvent';

  type BpmnElement<T extends string> = BpmnElementMap extends Record<T, infer E>
    ? E
    : ModdleElement;

  type ModdleElementCtor<T extends string> = new (attrs?: Attributes) => BpmnElement<T>;

  interface BpmnElementMap {
    'bpmn:ExtensionElements': BpmnExtensionElements;
    'bpmn:Documentation': BpmnDocumentation;
    'bpmn:Definitions': BpmnDefinitions;
    'bpmn:Relationship': BpmnRelationship;
    'bpmn:StartEvent': BpmnStartEvent;
  }
}

declare module 'moddle/lib/ns' {
  export interface NsName {
    name: string;
    prefix: string;
    localName: string;
  }
}

declare module 'moddle/lib/descriptor-builder' {
  import { NsName } from 'moddle/lib/ns';

  export default class DescriptorBuilder {
    constructor(nameNs: NsName);

    build(): Descriptor;

    // TODO
  }

  export interface Descriptor {
    ns: NsName;
    name: string;
    allTypes: any[];
    allTypesByName: object;
    properties: any;
    propertiesByName: object;
    bodyProperty?: any;
    idProperty?: any;
  }
}

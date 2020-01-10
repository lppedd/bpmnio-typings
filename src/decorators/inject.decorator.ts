export type InjectableComponent =
  | 'eventBus'
  | 'create'
  | 'elementFactory'
  | 'elementRegistry'
  | 'lassoTool'
  | 'palette'
  | 'styles'
  | 'pathMap'
  | 'canvas'
  | 'defaultRenderer'
  | 'textRenderer'
  | 'connect'
  | 'contextPad'
  | 'modeling'
  | 'directEditing'
  | 'resizeHandles'
  | 'commandStack'
  | 'config.textRenderer'
  | string;

export function Inject(injection: InjectableComponent, ...others: InjectableComponent[]) {
  return <T extends new (...args: any[]) => T>(ctor: T) => {
    // @ts-ignore
    ctor.$inject = [injection, ...others];
  };
}

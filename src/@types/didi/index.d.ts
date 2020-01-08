declare module 'didi' {
  export class Injector {
    get(name: string, strict: boolean): any;
  }

  export interface DidiModule {
    [id: string]: ['type' | 'factory' | 'value', any];
  }
}

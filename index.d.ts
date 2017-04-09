export interface IOptions {
    debug?: boolean;
}
export declare function sinergia(iterable: Iterable<any>, task: (accumulator: any, item: any) => any, initialValue: any, options?: IOptions): IterableIterator<Promise<{}> | {
    value: any;
}>;

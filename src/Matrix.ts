export default class Matrix<T> {
    private _list: T[] = [];
    constructor(private _cols: number, private _rows: number) {}
    getValue(x: number, y: number): T {
        return this._list[x * this._cols + y];
    }
    setValue(x: number, y: number, val: T): void {
        this._list[x * this._cols + y] = val;
    }
};
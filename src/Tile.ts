export class Tile {
    public isBomb = false;
    public checked = false;
    private textNumBombs?: string = undefined;

    constructor(private _xPos: number, private _yPos: number) {}
    setIsBomb(isBomb: boolean): void {
        this.isBomb = isBomb;
    }
    getPosition(): { x: number, y: number} {
        return {
            x: this._xPos,
            y: this._yPos
        }
    }
    setText(text: string): void {
        this.textNumBombs = text;
    }
    hasText(): boolean {
        return this.textNumBombs !== undefined;
    }
    getText(): string {
        return this.textNumBombs!;
    }
}
export const tileScale = 40;
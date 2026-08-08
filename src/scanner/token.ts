import { TokenType } from "./tokentype";

export type LiteralValue =
    | string
    | number
    | boolean
    | null;

export class Token {

    constructor(
        public readonly type: TokenType,
        public readonly lexeme: string,
        public readonly literal: LiteralValue,
        public readonly line: number
    ) {}

    toString(): string {
        return `${TokenType[this.type]} ${this.lexeme} ${this.literal}`;
    }
}
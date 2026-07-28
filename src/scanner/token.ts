import { TokenType } from "./tokentype";

export type Literal =
    | string
    | number
    | boolean
    | null;

export class Token {

    constructor(
        public readonly type: TokenType,
        public readonly lexeme: string,
        public readonly literal: Literal,
        public readonly line: number
    ) {}

    toString(): string {
        return `${TokenType[this.type]} ${this.lexeme} ${this.literal}`;
    }
}
import { Expr } from "../ast/expr";
import { Token } from "../scanner/token";
import { TokenType } from "../scanner/tokentype";

export class Parser{
    private readonly tokens : Token[];
    private current : number = 0;

    constructor(tokens : Token[]){
        this.tokens = tokens;
    }

    parse() : Expr | null{
        return this.expression();
    }

    private expression() : Expr | null{
        //return this.equality();
        return null;
    }

    /**
     * It moves the pointer forward.
     * @returns the token just consumed
     */
    private advance(): Token {
        if (!this.isAtEnd()){
            this.current++;
        }
        return this.previous();
    }

    /**
     * 
     * @returns Current token without consuming it
     */
    private peek() : Token {
        return this.tokens[this.current];
    }

    /**
     * 
     * @returns gives the token just consumed
     */
    private previous() : Token {
        return this.tokens[this.current - 1];
    }

    /**
     * 
     * @param type 
     * @returns true for current token type is equal to the given type, false otherwise
     */
    private check (type: TokenType) : boolean {
        if(this.isAtEnd()){
         return false;   
        }
        return this.peek().type === type;
    }

    /**
     * 
     * @returns Validates whether it is at the end or not
     */
    private isAtEnd() : boolean {
        return this.peek().type === TokenType.EOF;
    }

    /**
     * checks whether it's PLUS or MINUS
     * consumes it
     * @param types 
     * @returns 
     */
    private match(...types: TokenType[]): boolean {
        for (const type of types){
            if (this.check(type)){
                this.advance();
                return true;
            }
        }
        return false;
    }

    /**
     * Used when a token is expected.
     * Ex if we are expecting a closing parenthesis but it is not found then we throw an error.
     * @param type 
     * @param message 
     * @returns 
     */
    private consume(type: TokenType, message: string): Token{
        if(this.check(type)){
            return this.advance();
        }

        throw this.error(this.peek(), message);
    }

    /**
     * Error Handler for parser 
     * @param token 
     * @param message 
     * @returns 
     */
    private error(token: Token, message: string) : ParseError{
                console.error(
            `[line ${token.line}] Error at '${token.lexeme}': ${message}`
        );

        return new ParseError();
    }
}

class ParseError extends Error {

}
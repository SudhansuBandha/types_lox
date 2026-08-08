import { Binary, Expr, Grouping, Literal, Unary } from "../ast/expr";
import { Token } from "../scanner/token";
import { TokenType } from "../scanner/tokentype";

export class Parser{
    private readonly tokens : Token[];
    private current : number = 0;

    constructor(tokens : Token[]){
        this.tokens = tokens;
    }

    parse() : Expr | null{
        try {
            return this.expression();
        } catch (error) {
        if (error instanceof ParseError) {
            return null;
        }

        throw error;
        }
    }

    private expression() : Expr | null{
        return this.equality();
        //return null;
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
    private error(token: Token, message: string) : ParseError {
        if (token.type === TokenType.EOF) {
            console.error(
                `[line ${token.line}] Error at end: ${message}`
            );
        } else {
            console.error(
                `[line ${token.line}] Error at '${token.lexeme}': ${message}`
            );
        }
        return new ParseError();
    }

    private equality() : Expr {
       let expr = this.comparison();

        while (
            this.match(
                TokenType.BANG_EQUAL,
                TokenType.EQUAL_EQUAL
            )
        ) {
            const operator = this.previous();
            const right = this.comparison();

            expr = new Binary(expr, operator, right);
        }

    return expr;
}

   private comparison() : Expr{
        let expr = this.term();
        
        while(
            this.match(
                TokenType.GREATER,
                TokenType.LESS,
                TokenType.GREATER_EQUAL,
                TokenType.LESS_EQUAL
            )
        ){
            const operator = this.previous();
            const right = this.term();

            expr = new Binary(expr, operator , right);
        }

        return expr;
    }

    private term(): Expr {
        let expr = this.factor();

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator = this.previous();
            const right = this.factor();

            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private factor() : Expr {
        let expr = this.unary();

        while(this.match(TokenType.SLASH, TokenType.STAR)){
            const operator = this.previous();
            const right = this.unary();

            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    private unary() : Expr {
        if(this.match(TokenType.BANG, TokenType.MINUS)){
            const operator = this.previous();
            const right = this.unary();

            return new Unary(operator, right);
        }
        return this.primary();
    }


    private primary() : Expr {

        if (this.match(TokenType.FALSE)){
            return new Literal(false);
        }
        
        if (this.match(TokenType.TRUE)){
            return new Literal(true);
        }

        if (this.match(TokenType.NIL)){
            return new Literal(null);
        }

        if (this.match(TokenType.NUMBER, TokenType.STRING)){
            return new Literal(this.previous().literal);
        }

        if (this.match(TokenType.LEFT_PAREN)){
            const expr = this.expression();

            this.consume(
                TokenType.RIGHT_PAREN,
                "Expect ')' after expression."
            );

            return new Grouping(new Literal("1"));
        }

        throw this.error(
            this.peek(),
            "Expect expression."
        )

    }
    
}

class ParseError extends Error {
     constructor() {
        super();
        this.name = "ParseError";
    }
}
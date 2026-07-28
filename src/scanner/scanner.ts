import { Literal, Token } from "./token";
import { TokenType } from "./tokentype";
import { Lox } from "../lox";

export class Scanner {

    private readonly tokens: Token[] = [];

    private start = 0;
    private current = 0;
    private line = 1;

    private static readonly keywords = new Map<string, TokenType>([
    ["and", TokenType.AND],
    ["class", TokenType.CLASS],
    ["else", TokenType.ELSE],
    ["false", TokenType.FALSE],
    ["for", TokenType.FOR],
    ["fun", TokenType.FUN],
    ["if", TokenType.IF],
    ["nil", TokenType.NIL],
    ["or", TokenType.OR],
    ["print", TokenType.PRINT],
    ["return", TokenType.RETURN],
    ["super", TokenType.SUPER],
    ["this", TokenType.THIS],
    ["true", TokenType.TRUE],
    ["var", TokenType.VAR],
    ["while", TokenType.WHILE]
 ]);


    constructor(
        private readonly source: string
    ) {}
    /*Scan all the tokens*/
    scanTokens(): Token[] {

        while(!this.isAtEnd()){
            // We are at the beginning
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(
            new Token(
                TokenType.EOF,
                "",
                null,
                this.line
            )
        );

        return this.tokens;
    }

    /*Validate whether it is at end*/
    private isAtEnd(): boolean {
        return this.current>=this.source.length;
    }

    /*Move one character ahead as well return existing char*/
    private advance(): string {
        return this.source[this.current++];
    }
    
    /*Add corresponding Token Type for a character*/
    private scanToken(): void {
        const c = this.advance();
        switch(c){
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case '*': this.addToken(TokenType.STAR); break;
            case '!':
              this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
              break;
            case '=':
              this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
             break;
            case '<':
             this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
             break;
            case '>':
            this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
            break;
            case '/':
                if(this.match('/')){
                    // A comment goes until the end of the line.
                    while(this.peek() !== '\n' && !this.isAtEnd()){
                        this.advance();
                    }
                }
                else{
                    this.addToken(TokenType.SLASH);
                }
                break;
            case'"':
            this.string();
            break;    
            default: 
            if (this.isDigit(c)) {
                //Handle Number
                this.number();
            }
            else if (this.isAlpha(c)) {
                //Handle Reserve Keywords
                this.identifier();
            }
             else {
                Lox.error(this.line, "Unexpected character.");
            } 
            break;
        }
    }
    
    /*Create array of tokens*/
    private addToken(
        type: TokenType, 
        value : Literal = null
    ): void {
        const text
            = this.source.substring(this.start, this.current);

        this.tokens.push(
            new Token(
                type,
                text,
                value,
                this.line
            )
        );
    }

    /*Validate whether token is equal to special character or not*/
    private match(expected: string): boolean {
        if(this.isAtEnd()) return false;
        if(this.source[this.current] !== expected) return false;

        this.current++;
        return true;
    }
    
    /*Return latest charachter without advancing*/
    private peek(): string {
        if(this.isAtEnd()) return '\0';
        return this.source[this.current];
    }

    /*Evaluate String*/
    private string(): void {
        while(this.peek() !== '"' && !this.isAtEnd()){
            if (this.peek() == '\n') this.line++;
            this.advance();
        }

        if(this.isAtEnd()){
            // Incomplete string error handling
            Lox.error(this.line, "Unterminated string .");
            return;
        }

        // The closing "
        this.advance();

        //Trim the sorrounding quotes
        let value = this.source.substring(this.start+1, this.current-1);
        this.addToken(TokenType.STRING, value);        
    } 

    /**
     * 
     * @returns next character in source 
     */
    private peekNext(): string {

    if (this.current + 1 >= this.source.length) {
        return '\0';
    }

    return this.source[this.current + 1];
    }

    /**
     * 
     * @param c : character
     * @returns true | false and check whether it is digit or not
     */
    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }

    /**
     * Evaluate Number literal
     */
    private number(): void {

    // Consume the integer part.
    while (this.isDigit(this.peek())) {
        this.advance();
    }

    // Look for a fractional part.
    if (
        this.peek() === '.' &&
        this.isDigit(this.peekNext())
    ) {
        // Consume '.'
        this.advance();

        while (this.isDigit(this.peek())) {
            this.advance();
        }
    }

    const value = Number(
        this.source.substring(
            this.start,
            this.current
        )
    );

    this.tokens.push(
        new Token(
            TokenType.NUMBER,
            this.source.substring(
                this.start,
                this.current
            ),
            value,
            this.line
        )
    );
  }

  /**
   * Evaluate Reserve Keyword
   */
  private identifier(): void {

    while (this.isAlphaNumeric(this.peek())) {
        this.advance();
    }

    const text = this.source.substring(
        this.start,
        this.current
    );

    const type =
        Scanner.keywords.get(text) ??
        TokenType.IDENTIFIER;

    this.addToken(type);
 }

 /**
  * 
  * @param c 
  * @returns true | false for alphabet character
  */
 private isAlpha(c: string): boolean {

    return (
        (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c === '_'
    );
 }

 /**
  * 
  * @param c 
  * @returns return true | false for alpha numeric evaluation
  */
 private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
 }


}
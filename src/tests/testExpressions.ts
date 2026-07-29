import { Binary, Expr, Grouping, Literal, Unary } from "../ast/expr";
import { Token } from "../scanner/token";
import { TokenType } from "../scanner/tokentype";
import { AstPrinter } from "../visitors/astPrinter";
import { NodeCounter } from "../visitors/nodeCounter";
import { TestVisitor } from "../visitors/testVisitor";

/**
 * We will create (-123) * (45.67)
 */
function createFirstExpression (): Expr {
    const literal123 = new Literal(123);
    const literal4567 = new Literal(45.67);

    const minusToken = new Token(
        TokenType.MINUS,
        "-",
        null,
        1
    );

    const starToken = new Token(
        TokenType.STAR,
        "*",
        null,
        1
    );

    const unary = new Unary(
        minusToken,
        literal123
    );

    const grouping = new Grouping(
        literal4567
    );

    const expression = new Binary(
        unary,
        starToken,
        grouping
    );

    return expression;

}

/**
 * Validate visitor
 */
function testVisitor (){
    let expression = createFirstExpression();
    const visitor = new TestVisitor();
    expression.accept(visitor);
}

/**
 * Calculate total nodes present in an expression
 */
function countNodes(){
    let expression = createFirstExpression();
    const counter = new NodeCounter();
    const count = expression.accept(counter);

    console.log("Count -", count);
}

/**
 * Print Nodes 
 */
function printNodes(){
    let expression = createFirstExpression();
    const print = new AstPrinter();

    let value = expression.accept(print);
    console.log(value);
}

testVisitor();
countNodes();
printNodes();
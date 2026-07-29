import { Visitor, Binary, Grouping, Literal, Unary } from "../ast/expr";

/**
 * Visits the expression class
 */
export class TestVisitor implements Visitor<void> {

    visitBinaryExpr(expr: Binary): void {
        console.log("Visited Binary");
    }

    visitGroupingExpr(expr: Grouping): void {
        console.log("Visited Grouping");
    }

    visitLiteralExpr(expr: Literal): void {
        console.log("Visited Literal");
    }

    visitUnaryExpr(expr: Unary): void {
        console.log("Visited Unary");
    }
}



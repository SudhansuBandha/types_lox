import {
    Visitor,
    Binary,
    Grouping,
    Literal,
    Unary
} from "../ast/expr";

export class NodeCounter implements Visitor<number> {
   
    visitLiteralExpr(expr: Literal): number {
        return 1;
    }

    visitGroupingExpr(expr: Grouping): number {
        return 1 + expr.expression.accept(this);
    }

    visitUnaryExpr(expr: Unary): number {
        return 1 + expr.right.accept(this);
    }

    visitBinaryExpr(expr: Binary): number {
        return (
            1 +
            expr.left.accept(this) +
            expr.right.accept(this)
        );
    }
}
import {
    Visitor,
    Binary,
    Grouping,
    Literal,
    Unary,
    Expr
} from "../ast/expr";

export class AstPrinter implements Visitor<string> {

    visitBinaryExpr(expr: Binary): string {
        return this.parenthesize(
            expr.operator.lexeme,
            expr.left,
            expr.right
        );
    }

    visitGroupingExpr(expr: Grouping): string {
        return this.parenthesize(
            "group",
            expr.expression
        );
    }

    visitLiteralExpr(expr: Literal): string {

        if (expr.value === null)
            return "nil";

        return String(expr.value);
    }

    visitUnaryExpr(expr: Unary): string {
        return this.parenthesize(
            expr.operator.lexeme,
            expr.right
        );
    }

    print(expr: Expr){
        return expr.accept(this);
    }

    private parenthesize(
        name: string,
        ...expressions: Expr[]
    ): string {

        let builder = `(${name}`;

        for (const expression of expressions) {
            builder += ` ${expression.accept(this)}`;
        }

        builder += ")";

        return builder;
    }
}
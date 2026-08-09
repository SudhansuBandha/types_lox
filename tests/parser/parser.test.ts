import assert from "node:assert/strict";
import test from "node:test";

import { Parser } from "../../src/parser/parser";
import { Scanner } from "../../src/scanner/scanner";
import { AstPrinter } from "../../src/visitors/astPrinter";

function parse(source : string): string | null{
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    const parser = new Parser(tokens);
    const expression = parser.parse();

    assert.notEqual(expression, null);

    const printer = new AstPrinter();

    return printer.print(expression);
}

function parseOrNull(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    const parser = new Parser(tokens);

    return parser.parse();
}

test("parses number literal", () => {
    assert.equal(
        parse("123"),
        "123"
    );
});

test("parses string literal", () => {
    assert.equal(
        parse('"hello"'),
        "hello"
    );
});

test("parses true", () => {
    assert.equal(
        parse("true"),
        "true"
    );
});

test("parses false", () => {
    assert.equal(
        parse("false"),
        "false"
    );
});

test("parses nil", () => {
    assert.equal(
        parse("nil"),
        "nil"
    );
});

test("parses unary minus", () => {
    assert.equal(
        parse("-123"),
        "(- 123)"
    );
});

test("parses unary bang", () => {
    assert.equal(
        parse("!true"),
        "(! true)"
    );
});

test("parses nested unary expressions", () => {
    assert.equal(
        parse("!!true"),
        "(! (! true))"
    );
});

test("parses multiplication", () => {
    assert.equal(
        parse("1 * 2"),
        "(* 1 2)"
    );
});

test("parses division", () => {
    assert.equal(
        parse("4 / 2"),
        "(/ 4 2)"
    );
});

test("parses addition", () => {
    assert.equal(
        parse("1 + 2"),
        "(+ 1 2)"
    );
});

test("parses subtraction", () => {
    assert.equal(
        parse("4 - 3"),
        "(- 4 3)"
    );
});

test("multiplication has higher precedence than addition", () => {
    assert.equal(
        parse("1 + 2 * 3"),
        "(+ 1 (* 2 3))"
    );
});

test("multiplication has higher precedence than subtraction", () => {
    assert.equal(
        parse("1 - 2 * 3"),
        "(- 1 (* 2 3))"
    );
});

test("addition is evaluated before lower precedence comparison", () => {
    assert.equal(
        parse("1 + 2 < 4"),
        "(< (+ 1 2) 4)"
    );
});

test("complex precedence", () => {
    assert.equal(
        parse("1 + 2 * 3 < 10 == true"),
        "(== (< (+ 1 (* 2 3)) 10) true)"
    );
});

test("grouping overrides precedence", () => {
    assert.equal(
        parse("(1 + 2) * 3"),
        "(* (group (+ 1 2)) 3)"
    );
});

test("parses greater than", () => {
    assert.equal(
        parse("1 > 2"),
        "(> 1 2)"
    );
});

test("parses greater than or equal", () => {
    assert.equal(
        parse("1 >= 2"),
        "(>= 1 2)"
    );
});

test("parses less than", () => {
    assert.equal(
        parse("1 < 2"),
        "(< 1 2)"
    );
});

test("parses less than or equal", () => {
    assert.equal(
        parse("1 <= 2"),
        "(<= 1 2)"
    );
});

test("parses equality", () => {
    assert.equal(
        parse("1 == 2"),
        "(== 1 2)"
    );
});

test("parses inequality", () => {
    assert.equal(
        parse("1 != 2"),
        "(!= 1 2)"
    );
});

test("rejects missing expression", () => {
    assert.equal(
        parseOrNull("1 + ;"),
        null
    );
});

test("rejects missing closing parenthesis", () => {
    assert.equal(
        parseOrNull("(1 + 2"),
        null
    );
});
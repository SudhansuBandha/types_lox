import { Lox } from "./lox";
import { Parser } from "./parser/parser";
import { Scanner } from "./scanner/scanner";
import { AstPrinter } from "./visitors/astPrinter";

// const args = process.argv.slice(2);

// if (args.length > 1){
//     process.exit(64);
// }

// if(args.length === 1){
//     Lox.runFile(args[0]);
// } else {
//     Lox.runPrompt();
// }

//const source = "1*2*-3>4";
//const source = "1 + 2 * 3 < 10 == true";
//const source = "1 == 2 == 3";
const source = "1 + ;";
const scanner = new Scanner(source);
const tokens = scanner.scanTokens();

console.log("Tokens:");

for (const token of tokens){
    console.log(token);
}

const parser = new Parser(tokens);
const expression = parser.parse();

if(expression!== null){
    const printer = new AstPrinter();
    console.log("AST:", printer.print(expression));
}

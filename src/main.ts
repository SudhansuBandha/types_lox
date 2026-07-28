import { Lox } from "./lox";

const args = process.argv.slice(2);

if (args.length > 1){
    process.exit(64);
}

if(args.length === 1){
    Lox.runFile(args[0]);
} else {
    Lox.runPrompt();
}

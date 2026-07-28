//import { readFileSync } from "node:fs";
import { createReadStream } from "node:fs";
import * as readline from "node:readline"
import { Scanner } from "./scanner/scanner";

export class Lox {
    private static hadError = false;
    static runFile(path: string): void {
        console.log(`Running file: ${path}`);
        //const source = readFileSync(path, "utf-8");
        let source = '';
        const stream = createReadStream(path, {
            encoding:"utf8"
        });

        stream.on('data', (chunk)=>{
            source+=chunk;
        });
        
        stream.on('end', ()=>{
            this.run(source);
        });

        stream.on("error", ()=>{
            console.error("Error occured");
        });
        
        if (this.hadError) {
            process.exit(65);
        }
    }

    static runPrompt(): void {
        const r1 = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '    
        })

        r1.prompt();

        r1.on('line', (line)=>{
            this.run(line);
            r1.prompt();
            this.hadError = false;
        });

        r1.on('close', ()=>{
            console.log('Exiting..')
        })
    }

    // private static run(source: string): void{
    //     console.log(source);
    // }

    private static run(source: string): void {

        const scanner = new Scanner(source);

        const tokens = scanner.scanTokens();

        for (const token of tokens) {
            console.log(token.toString());
        }
    }

    
    static error(line: number, message:string): void{
        this.report(line, "", message);
    }

    private static report(
        line: number,
        where: string,
        message: string
    ): void{
        console.error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }
    
}
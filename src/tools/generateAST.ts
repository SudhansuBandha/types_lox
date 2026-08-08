import fs from "node:fs";
import path from "node:path";

const directory = path.resolve(__dirname, "../ast");

interface Field{
    type: string,
    name: string
};

interface AstDefinition{
    className: string,
    fields: Field[]
};

/**
 * 
 * @param input Classname : Field1, Field2, Field3
 * @returns AstDefinition object 
 */
function createAstRules(input: string): AstDefinition{

    if(input.indexOf(":")===-1){
        console.error("Please provide desired input format")
        process.exit(1);
    }
    let inputArr = input.split(":");

    let definition = {
        className: inputArr[0].trim(),
        fields: inputArr[1].trim().split(",").map((fl: string): Field=>{
        let data = fl.trim().split(/\s+/); 
        return {
            type: data[0],
            name: data[1]
         };   
        }),
    };

    return definition;
}

/**
 * 
 * @param field 
 * @returns contents of class in a string
 */
function generateFields(fields: Field[]): string {
    let output = "    ";
    output += fields
        .map(field => `${field.name}: ${field.type}`)
        .join(";\n    ");

    return output;
}

/**
 * Generates a constructor for an AST class.
 *
 * @param fields List of fields in the AST node.
 * @returns Constructor source code.
 */
function generateConstructor(fields: Field[]): string {
    const parameters = fields
        .map(field => `${field.name}: ${field.type}`)
        .join(",\n        ");

    const assignments = fields
        .map(field => `        this.${field.name} = ${field.name};`)
        .join("\n");

    return `
    constructor(
        ${parameters}
    ) {
        super();

${assignments}
    }
`;
}

/**
 * Generates the Visitor interface.
 *
 * Example:
 * export interface Visitor<R> {
 *     visitBinaryExpr(expr: Binary): R;
 *     visitGroupingExpr(expr: Grouping): R;
 *     ...
 * }
 */
function generateVisitor(rules: AstDefinition[]): string {
    if(!rules) return "";
    const methods = rules
        .map(
            rule =>
                `    visit${rule.className}Expr(expr: ${rule.className}): R;`
        )
        .join("\n");

    return `
export interface Visitor<R> {
${methods}
}
`;
}

/**
 * 
 * @param className 
 * @returns acceptor method line for classes
 */
function generateAcceptMethod(className: string): string {
    return `    accept<R>(visitor: Visitor<R>): R {
        return visitor.visit${className}Expr(this);
    }
`;
}


/**
 * Generates the required contents for classes
 * @param rule 
 * @returns contents of class
 */
function generateClass(rules: AstDefinition): string{
        return `
export class ${rules.className} extends Expr {
${generateFields(rules.fields)}
${generateConstructor(rules.fields)}
${generateAcceptMethod(rules.className)}
}
`;}

//Create Abstract Syntax Tree
try{
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
} catch (err){
    console.error(err);
}

const definitions = [
   "Binary : Expr left, Token operator, Expr right",
   "Grouping : Expr expression",
   "Literal : LiteralValue value",
   "Unary : Token operator, Expr right"
];

//Create Respective Tree Classes
try{
    let content = `// This file is generated.
// Do not edit manually.

import { Token, LiteralValue } from "../scanner/token";
`;
 

    let rules = definitions.map((str: string) : AstDefinition => createAstRules(str));
    
    content += generateVisitor(rules);
    content += "\n";   
    content += `export abstract class Expr {
    abstract accept<R>(visitor: Visitor<R>): R;
}\n\n`;

    for(let rule of rules)
    content += generateClass(rule);

    fs.writeFileSync(`${path.join(directory, 'expr.ts')}`, content);

} catch(err){
    console.log(err);
}
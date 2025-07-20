import { type CodeLineData } from "../../components/code-block";

const keyWords = ["let","const","var","new"];
const classes = ["console"];
const objects = ["Array","Set","String","nSet"];
const actions = ["return","continue","break"];

const keyWordExpression = new RegExp(keyWords.map(e=>{return "("+e+")\\b"}).join("|"),"g");
const classExpression = new RegExp(classes.map(e=>{return "("+e+")\\b"}).join("|"),"g");
const objectsExpression = new RegExp(objects.map(e=>{return "\\b("+e+")\\b"}).join("|"),"g");
const actionsExpression = new RegExp(actions.map(e=>{return "\\b("+e+")\\b"}).join("|"),"g");
const functionExpression = /\.(\w*?)\(/g;

export function formatCodeLine(line : CodeLineData) {
    let text = line.text;
    text = text.replaceAll(keyWordExpression,"<span class='text-code-keyword'>$&</span>")
    .replaceAll(classExpression,"<span class='text-code-class'>$&</span>")
    .replaceAll(objectsExpression,"<span class='text-code-object'>$&</span>")
    .replaceAll(actionsExpression,"<span class='text-code-action'>$1</span>")
    .replaceAll(functionExpression,".<span class='text-code-function'>$1</span>(")
    // eslint-disable-next-line no-useless-escape
    .replaceAll(/[\(\)\[\]\{\}]/g,"<span class='text-code-closures'>$&</span>")
    .replaceAll(/\d+\.?\d*/g,"<span class='text-accent'>$&</span>")
    .replaceAll(/\/\/.*/g,"<span class='*:text-code-comment text-code-comment'>$&</span>")

    return text+"<br>";
}

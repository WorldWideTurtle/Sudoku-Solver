import { formatCodeLine } from "../lib/util/codeFormater";
import {ReactComponent as CopyIcon} from "./icons/copy.svg"
import './code-block.css';

export type CodeLineData = {
    text: string,
    indentation?: number
}

export function CodeBlock({language, lines, output} : {language: string, lines: CodeLineData[], output?: string}) {
    function CopyCode() {
        if (navigator.clipboard) {
            let code = "";
            for (const line of lines) {
                if (line.indentation) {
                    code += "\t".repeat(line.indentation);
                }
                code += line.text + "\n";
            }
            navigator.clipboard.writeText(code);
        }
    }

    return (
        <div className="bg-muted p-4 rounded-md shadow-sm shadow-foreground dark:shadow-none mt-2 mb-2">
            <div className="flex items-center justify-between">
                <h4 className="text-sm text-accent font-bold">{language}</h4>
                <button onClick={CopyCode} title="Copy code to clipboard"><CopyIcon className="fill-foreground hover:fill-accent" /></button>
            </div>
            <div className="mt-2 code">
                {lines.map((e,i)=>(
                    <div key={i} style={{marginLeft: (e.indentation || 0) + "rem"}}><span dangerouslySetInnerHTML={{__html: formatCodeLine(e)}}></span></div>
                ))}
                {output ? <><hr className="mt-2 mb-2 border-foreground/40" /><div>{"> "}<span dangerouslySetInnerHTML={{__html: formatCodeLine({text:output})}}></span></div></> : ""}
            </div>
        </div>
    )
}
import { useState } from "react";
import {ReactComponent as ChevronRightIcon} from '../icons/chevron-right.svg'
import classNames from "classnames";

export function List({children, className} : {children?: React.ReactNode, className?: string}) {
    return (
        <ul className={classNames("w-full p-2 flex flex-col gap-1",className)}>
            {children}
        </ul>
    );
}

export function ListItem({children, className} : {children?: React.ReactNode, className?: string}) {
    return (
        <li className={classNames("w-full hover:bg-accent/30 rounded-md",className)}>
            {children}
        </li>
    );
}

export function ListGroup({children, label, className} : {children?: React.ReactNode, label:string, className?: string}) {
    const [toggled, setToggled] = useState(false);

    return (
        <div className="w-full flex flex-col gap-1">
            <button className={classNames("flex gap-1 w-full",className)} onClick={()=>setToggled((prev)=>!prev)}>
                <ChevronRightIcon className="scale-75 transition-[rotate] fill-foreground" width={20} style={{
                    rotate: toggled ? '90deg' : '0deg'
                }} />
                {label}
            </button>
            <div className="ml-4 flex flex-col gap-1">
                {toggled ? children : ''}
            </div>
        </div>
    );
}
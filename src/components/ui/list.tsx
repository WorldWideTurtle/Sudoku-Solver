import { useState } from "react";
import {ReactComponent as ChevronRightIcon} from '../icons/chevron-right.svg'
import classNames from "classnames";

export function List({children, className} : {children?: React.ReactNode, className?: string}) {
    return (
        <ul className={classNames("w-full p-2",className)}>
            {children}
        </ul>
    );
}

export function ListItem({children, className} : {children?: React.ReactNode, className?: string}) {
    return (
        <li className={classNames("w-full font-bold",className)}>
            {children}
        </li>
    );
}

export function ListGroup({children, label, className} : {children?: React.ReactNode, label:string, className?: string}) {
    const [toggled, setToggled] = useState(false);

    return (
        <div className="w-full">
            <button className={classNames("flex gap-1 w-full font-bold",className)} onClick={()=>setToggled((prev)=>!prev)}>
                <ChevronRightIcon className="scale-75 transition-[rotate]" width={20} style={{
                    rotate: toggled ? '90deg' : '0deg'
                }} />
                {label}
            </button>
            <div className="pl-4">
                {toggled ? children : ''}
            </div>
        </div>
    );
}
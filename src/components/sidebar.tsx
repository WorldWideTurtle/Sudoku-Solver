import { useState } from 'react';
import {ReactComponent as ChevronRightIcon} from './icons/chevron-right.svg'
import { MatrixBackground } from './matrix-background';
import { Link } from 'react-router-dom';
import { List, ListGroup, ListItem } from './ui/list';

export function Sidebar() {
    const [isOpen, toggleOpen] = useState(false);

    return (
        <aside className="fixed bg-popover left-0 top-0 h-full w-fit flex flex-col z-50 contain-layout shadow-md shadow-foreground dark:shadow-none dark:border-r-foreground/50 dark:border-solid dark:border-r-1 transition-[transform] ease-in-out duration-100" style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}>
            <button 
                title="Toggle sidebar" 
                className='bg-popover rounded-br-md size-12 p-1 absolute right-0 top-0 translate-x-[100%] flex justify-center items-center group hover:brightness-75 dark:border-solid dark:border-foreground/50 dark:border-1 !border-t-0 !border-l-0' 
                onClick={()=>toggleOpen((prev)=>!prev)}>
                    <ChevronRightIcon className="w-full h-full scale-75 transition-[rotate] duration-75 fill-foreground" width={20} style={{
                        rotate: isOpen ? '90deg' : '0deg'
                    }} />
            </button>
            <SideBarHeading isOpen={isOpen} />
            <SideBarLinks />
        </aside>
    );
}

function SideBarHeading({isOpen} : {isOpen: boolean}) {
    return (
        <div className='grid grid-cols-1 grid-rows-1'>
            <div className='col-start-1 row-start-1'>
                {isOpen ? <MatrixBackground /> : ''}
            </div>
            <div className='col-start-1 row-start-1 p-2'>
                <h1 className='text-3xl font-bold'>Sudoku Solver</h1>
                <h2 className='text-xl -mt-2 opacity-70'>Binary Edition</h2>
            </div>
        </div>
    )
}

const LINKS = [
    ["/","Solver"],
    ["/rules","Sudoku-Rules"],
    [
        ["/libraries","Implementation"],
        ["/nGrid","nGrid"],
        ["/nSet","nSet"],
        ["/nArray","nArray"]
    ]
] as const;

function SideBarLinks() {
    const loc = window.location.pathname;
    return (
        <List>
            {LINKS.map(e=>(typeof e[1] === 'string') ? 
                <ListItem key={e[0]}><Link to={e[0]} className='w-full h-full inline-block p-1 font-bold'>{e[1]}</Link></ListItem> :
                <ListGroup key={e[0][0]} label={e[0][1]}>
                    {e.slice(1).map(inner=><ListItem key={e[0][0] + inner[0]}><Link to={e[0][0] + inner[0]} className='w-full h-full inline-block p-1 font-bold'>{inner[1]}</Link></ListItem>)}
                </ListGroup>
            )}
        </List>
    )
}
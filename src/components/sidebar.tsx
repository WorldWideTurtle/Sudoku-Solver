import { useEffect, useRef, useState } from 'react';
import {ReactComponent as ChevronRightIcon} from './icons/chevron-right.svg'
import { MatrixBackground } from './matrix-background';
import { Link } from 'react-router-dom';
import { List, ListGroup, ListItem } from './ui/list';
import { LINKS } from '../App';

export function Sidebar() {
    const [isOpen, setOpen] = useState(false);

    const elementRef = useRef<HTMLElement>(null);

    function toggleOpen() {
        setOpen((prev)=>!prev)
    }

    useEffect(()=>{
        function onClick(event: MouseEvent) {
            if (!elementRef.current || !isOpen) return;
            
            const bounds = elementRef.current.getBoundingClientRect();
            if (bounds.right > 0 && bounds.right < event.clientX) {
                setOpen(false)
            }
        }

        document.addEventListener("click",onClick);

        return () => document.removeEventListener("click",onClick);
    }, [isOpen])

    return (
        <aside ref={elementRef} className="fixed bg-popover left-0 top-0 h-full w-fit flex flex-col z-30 contain-layout shadow-md shadow-foreground dark:shadow-none dark:border-r-foreground/50 dark:border-solid dark:border-r-1 transition-[transform] ease-in-out duration-100 mr-16" style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}>
            <button 
                title="Toggle sidebar" 
                className='bg-popover rounded-br-md size-12 p-1 absolute right-0 top-0 translate-x-[100%] flex justify-center items-center group hover:brightness-75 dark:border-solid dark:border-foreground/50 dark:border-1 !border-t-0 !border-l-0' 
                onClick={toggleOpen}>
                    <ChevronRightIcon className="w-full h-full scale-75 transition-[rotate] duration-75 fill-foreground" width={20} style={{
                        rotate: isOpen ? '180deg' : '0deg'
                    }} />
            </button>
            <SideBarHeading isOpen={isOpen} />
            <SideBarLinks />
        </aside>
    );
}

function SideBarHeading({isOpen} : {isOpen: boolean}) {
    return (
        <div className='grid grid-cols-1 grid-rows-1 overflow-hidden'>
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

function SideBarLinks() {
    const [path, setPath] = useState(window.location.pathname)

    return (
        <List>
            {LINKS.map(e=>(typeof e[1] === 'string') ? 
                <ListItem isActive={path === e[0]} key={e[0]}><Link onClick={()=>setPath(e[0])} to={e[0]} className='w-full h-full inline-block p-1 font-bold'>{e[1]}</Link></ListItem> :
                <ListGroup key={e[0][0]} label={e[0][1]}>
                    {e.slice(1).map(inner=><ListItem isActive={path === e[0][0] + inner[0]} key={e[0][0] + inner[0]}><Link onClick={()=>setPath(e[0][0] + inner[0])} to={e[0][0] + inner[0]} className='w-full h-full inline-block p-1 font-bold'>{inner[1]}</Link></ListItem>)}
                </ListGroup>
            )}
        </List>
    )
}
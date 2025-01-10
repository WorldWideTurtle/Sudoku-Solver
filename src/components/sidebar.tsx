import { useState } from 'react';
import {ReactComponent as MenuIcon} from './icons/menu.svg';
import { MatrixBackground } from './matrix-background';
import { Link } from 'react-router-dom';
import { List, ListGroup, ListItem } from './ui/list';

export function Sidebar() {
    const [isOpen, toggleOpen] = useState(false);

    return (
        <aside className="fixed bg-popover left-0 top-0 h-full w-fit flex flex-col z-50 contain-layout" style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}>
            <button title="Toggle sidebar" className='bg-popover rounded-br-md size-12 p-1 absolute right-0 top-0 translate-x-[100%] flex justify-center items-center' onClick={()=>toggleOpen((prev)=>!prev)}><MenuIcon className='fill-primary w-full h-full'/></button>
            <SideBarHeading isOpen />
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

function SideBarLinks() {
    return (
        <List>
            <ListItem>Test</ListItem>
            <ListItem>Test2</ListItem>
            <ListGroup label='TestGroup'>
                <ListItem>Test3</ListItem>
                <ListItem>Test4</ListItem>
            </ListGroup>
        </List>
    )
}
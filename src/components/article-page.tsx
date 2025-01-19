import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./article-page.css"

export function ArticlePage({children} : {children?: ReactNode}) {
    return (
        <article className="max-w-[800px] h-fit mx-auto pl-8 pr-8 pb-6 mt-20 w-[95vw] overflow-y-auto *:font-normal">
            <h2 className="text-4xl font-bold">Sudoku Solving</h2>
            <h3 className="text-xl -mt-2 font-bold opacity-70">Binary Style</h3> 
            <hr className="border-popover mt-2 mb-2" />
            
            {children}
        </article>
    )
}

export function ArticleHeading({children} : {children: ReactNode}) {
    return <h3 className="text-2xl md:text-3xl lg:text-4xl mb-2 mt-6">{children}</h3>
}

export function ArticleLink({children, href} : {children: ReactNode, href: string}) {
    return <Link className="underline text-accent" to={href}>{children}</Link>
}
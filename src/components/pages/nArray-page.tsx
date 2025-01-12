import { ArticleHeading, ArticleLink, ArticlePage } from "../artice-page";

export function NArrayPage() {
    return (
        <ArticlePage>
            <ArticleHeading>nArray</ArticleHeading>
            <p>This utility is like an <ArticleLink href="/libraries/nSet">nSet</ArticleLink>, only that each value uses 4 bits of a number. It was meant to replace the state of the board by storing the placed numbers in it.</p>
            <p>However, JS only performs bit operations on 32 bit numbers, whereas 36 are needed to store nine 4-bit numbers. It is for this reason that the library was not used.</p>
        </ArticlePage>
    )
}
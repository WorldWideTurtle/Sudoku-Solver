import { ArticleHeading, ArticleLink, ArticlePage } from "../article-page";

export function NGridPage() {
    return (
        <ArticlePage>
            <ArticleHeading>nGrid</ArticleHeading>
            <p>The nGrid class contains all the implementation of the sudoku solver, like </p>
            <ul>
                <li>Storing the current State</li>
                <li>Keeping track of previous moves</li>
                <li>Calculating possible numbers</li>
                <li>...</li>
            </ul>
            <p>In total, the solver knows five methods of figuring out numbers, although only three of them are active. The others have shown no performance gain. The active ones, in order of execution priority, are:</p>
            <ol>
                <li>Obvious singles</li>
                <li>Hidden singles</li>
                <li>Guess and backtrack</li>
            </ol>
            <ArticleHeading>Obvious singles</ArticleHeading>
            <p>An obvious single is a cell that, by the rules, only has one remaining option. These are very easy to calculate as we are just looking for any cell where the combination of the row, column and subgrid <ArticleLink href="/libraries/nSet">nSet</ArticleLink> result in a single missing number.</p>
            <ArticleHeading>Hidden singles</ArticleHeading>
            <p>A hidden single can have many options, but one correct one. If along either row, column, or subgrid, it is the only cell to contain a certain option, that option is certain to be in that cell.</p>
            <p>Since I am already using numbers to save the state of all groups, it wouldn't have felt right to keep track of encountered options in a dictionary, Array or Set, so I used two <ArticleLink href="/libraries/nSet">nSet</ArticleLink> numbers for each direction. The first being used to store potential hidden options, and the latter storing any hidden options that were found more than once.</p>
            <ArticleHeading>Guess and backtrack</ArticleHeading>
            <p>Similar to looking for obvious singles, the solver looks for the cell with the least options. If it spots a cell with two, it regards it as such and stops searching. If none is found, guess the lowest.</p>
            <p>There is no heuristic to what number should be guessed, it simply always uses the first option.</p>
            <p>To keep state, I transform every move into a number, using the first 21 bits to store row, column, the other options, and the guessed number. When backtracking, these numbers get extracted and undone.</p>
            <p>Another way could have been to save the entire state of the board, one 81 element array for the cells and three 9 element arrays for the <ArticleLink href="/libraries/nSet">nSet</ArticleLink> numbers, and then overwrite the current state when backtracking. This was not done as it is likely that a guess is often invalid after less than twenty moves. If it is invalid after a mere five moves, this way would still need to store the entire 108 numbers. And due to there only being at most 64 unsolved cells, any guess is at most invalidated after 62 moves.</p>
        </ArticlePage>
    )
}
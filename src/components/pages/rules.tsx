import { ArticleHeading, ArticleLink, ArticlePage } from "../article-page";
import { CodeBlock } from "../code-block";

export function RulesPage() {
    return (
        <ArticlePage>
                <ArticleHeading>Base game</ArticleHeading>
                <p>Sudoku is played on a 9x9 grid filled with numbers ranging from 1 to 9 with a few rules dictating what numbers fit where.</p>
                <ul>
                    <li>No number in a single row may be the same as another of the same row</li>
                    <li>No number of a single column my be the same as another of the same column</li>
                    <li>No number within a 3x3 subgrid may be the same as another of the same 3x3 subgrid</li>
                </ul>
                <p>Simple, right? Sudoku has no rules other than the previously stated ones.</p>

                <ArticleHeading>First insights</ArticleHeading>
                <p>JavaScript can represent a list on unique numbers as a Set. Think of them as a list of true false values, each representing whether or not a number exists in the Set.</p>
                <CodeBlock 
                    language="JavaScript" 
                    lines={[
                        {text: "const exampleSet = new Set([1,3,4,6,6]);"},
                        {text: "console.log(exampleSet);"}
                    ]} 
                    output="Set(4) {1,3,4,6}"
                />
                <p>As can be seen above, adding a second 6 in the initializer will not keep said 6 in the final set. Using a set, we can represent all the numbers in a given row, column, and subgrid, without needing to check for repetition.</p>
                <p>Since the start of this project, sets have gained in function and have become a lot better at handling this kind of problem. Before, to get the elements in common in two sets you had to do the following:</p>
                <CodeBlock 
                    language="JavaScript" 
                    lines={[
                        {text: "const setOne = new Set([1,3,4,6]);"},
                        {text: "const setTwo = new Set([4,8,7,1]);"},
                        {text: "let newSet = new Set();"},
                        {text: "[...setOne].forEach(number => {"},
                        {text: "if(!setTwo.has(number)) return;", indentation:1},
                        {text: "newSet.add(number);", indentation:1},
                        {text: "});"},
                        {text: "console.log(newSet);"}
                    ]} 
                    output="Set(2) {1,4}"
                />
                <p>Loop through one set and check for the existence of the number in the other set, amazing. Amazingly inefficient that is.</p>
                <p>Today, sets behave a bit more Array-like by having a "forEach" function implemented. There is also a direct "intersection" method to retrieve the common set of two sets.</p>
                <CodeBlock 
                    language="JavaScript" 
                    lines={[
                        {text: "const setOne = new Set([1,3,4,6]);"},
                        {text: "const setTwo = new Set([4,8,7,1]);"},
                        {text: "let newSet = setOne.intersection(setTwo);"},
                        {text: "console.log(newSet);"}
                    ]} 
                    output="Set(2) {1,4}"
                />
                <p>Still however, there is a major concern when using Sets for this project. They are objects: When performing Set operations like above, we create a new Set object every time. This can be a major performance problem when we often need to perform multiple set operations for up to 81 cells</p>
                <p>Sudoku has a total of 81 cells. We would need to loop through each row-, column-, and subgrid- set in order to see the options available to us. Of course, for sudoku, you don't really want the numbers in common, but rather those that are missing. A difference operation.</p>
                <p>What we need is a non object data-type that can easily store multiple states at once and have operations performed on it to view its relation to others of its kind.</p>
                <ArticleHeading>Enter, the bitset.</ArticleHeading>
                <p>A bitset is a number whose binary representation is used to store 1s and 0s at desired places within the number. How these values are read is up to the implementation.</p>
                <p>Example: A single 32-bit number is enough to store monthly work-days. By assigning each day to a different bit position within the number, where 1 is a workday and 0 a vacation day, we can store 32 days, 1 more than the maximum a month can have.</p>
                <p>The bitset implementation written for this project is called <ArticleLink href="/libraries/nSet">nSet</ArticleLink> (numeric Set) and can be found within implementation.</p>
                <p>To show what benefits this has, lets review the earlier example of getting the common numbers of two sets:</p>
                <CodeBlock 
                    language="JavaScript" 
                    lines={[
                        {text: "const setOne = nSet.new([1,3,4,6]); // 101101"},
                        {text: "const setTwo = nSet.new([4,8,7,1]); // 11001001"},
                        {text: "let newSet = nSet.intersect(setOne,setTwo);"},
                        {text: "console.log(newSet);"}
                        ]} 
                    output={"9 // 1001"}
                />
                <p>At this point it should be clear how using basic numbers to represent the state of the board has some benefits over js Sets. They are not objects, are loved by our CPUs, and have minimal memory impact compared to Sets.</p>
                <p>This is as far as this article goes. To learn more about the solving process, look at the <ArticleLink href="/libraries/nGrid">nGrid</ArticleLink>, <ArticleLink href="/libraries/nSet">nSet</ArticleLink> or <ArticleLink href="/libraries/nArray">nArray</ArticleLink> implementation. (<ArticleLink href="/libraries/nArray">nArray</ArticleLink> is deprecated and not used in the project for reasons listed within its article)</p>
            </ArticlePage>
    )
}
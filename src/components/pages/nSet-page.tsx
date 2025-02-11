import { ArticleHeading, ArticlePage } from "../article-page";
import { CodeBlock } from "../code-block";

export function NSetPage() {
    return (
        <ArticlePage>
            <ArticleHeading>nSet</ArticleHeading>
            <p>nSet is a library written for this project. It is a JS-Set like implementation using the bits of a number to store the existence of up to 31 numbers in a single number.</p>
            <CodeBlock
                language="Javascript"
                lines={[
                    {text: "let mySet = nSet.new([1,2,5,8]);"},
                    {text: "mySet = nSet.add(mySet,3);"},
                    {text: "mySet = nSet.add(mySet,8);"},
                    {text: "mySet = nSet.delete(mySet,1);"},
                    {text: "console.log(nSet.toArray(mySet))"},
                ]}
                output="[2,3,5,8]"
            />
            <p>Like JS Sets, nSet behaves similar to an Array, only a bit more since you can access elements by index. For example, it implements a shift() function that removes the first element in the set, in this case the lowest number.</p>
            <p>Every function within nSet, besides creation and toArray, works in both constant time and space without branching.</p>
            <p>Functions like union, difference and intersect, along with utilities like has, isSingle and size, can be found in the source.</p>
        </ArticlePage>
    )
}
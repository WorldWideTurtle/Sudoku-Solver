import { Route, Routes } from 'react-router';
import { Solver } from './components/pages/solver';
import { RulesPage } from './components/pages/rules';
import { NGridPage } from './components/pages/nGrid-page';
import { NSetPage } from './components/pages/nSet-page';
import { NArrayPage } from './components/pages/nArray-page';

export const LINKS = [
  ["/","Solver"],
  ["/rules","Sudoku-Rules"],
  [
      ["/libraries","Implementation"],
      ["/nGrid","nGrid"],
      ["/nSet","nSet"],
      ["/nArray","nArray"]
  ]
] as const;

function App() {
  return (
    <>
      <Routes>
         <Route path='/' element={<Solver/>} />
         <Route path='/rules' element={<RulesPage/>} />
         <Route path='/libraries/nGrid' element={<NGridPage/>} />
         <Route path='/libraries/nSet' element={<NSetPage/>} />
         <Route path='/libraries/nArray' element={<NArrayPage/>} />
       </Routes>
    </>
  );
}

export default App;

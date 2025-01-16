import { MathUtils } from "../util/MathUtils";

type CallBackType = (event: any, progress: number, partialCount: number) => void

type Solver = {
    threads: number
    workerPool: Worker[]
    activeWorkers: Worker[]
    solvedID: number
    toSolve: number
    solved: number
    assigned: number
    chunkSize: number
    activeCallback: CallBackType
    remaining: string[][]
    initWorker: () => void
    onWorkerDone: (event: any, id: number, partial: number) => void
    solve: (list: string[], callback? : CallBackType) => void
    getChunk: () => string[] | undefined
    solveMulti: (list: string[], threads: number, chunkSize: number, callBack? : CallBackType) => void
    cancel: () => void
}


export const solver : Solver = {
    threads: navigator.hardwareConcurrency,
    workerPool: [],
    activeWorkers: [],
    solvedID: 0,
    toSolve: 0,
    solved: 0,
    assigned: 0,
    chunkSize: 500,
    activeCallback: ()=>{},
    remaining: [],

    async initWorker() {
        for (let i = 0; i < this.threads; i++) {
            let newWorker = new Worker(new URL("./worker.ts", import.meta.url), {type:"module"});
            newWorker.addEventListener("message",(event)=>{this.onWorkerDone(event,i,this.solvedID++)})
            this.workerPool.push(newWorker)
        }
    },

    onWorkerDone(event,id,partial) {
        this.solved = Math.min(this.solved + this.chunkSize, this.toSolve);
        this.activeCallback(event,this.solved / this.toSolve,partial);
        if (this.remaining.length === 0) return;
        
        this.workerPool[id].postMessage({grids:this.getChunk()})
    },

    async solve(list,callBack = ()=>{}) {
        if (this.activeWorkers.length === 0) {
            await this.initWorker()
        }

        this.solvedID = 0;
        this.activeCallback = callBack;
        this.workerPool[0].postMessage({grids:list,partial:true});
    },

    getChunk() {
        return this.remaining.pop();
    },

    async solveMulti(list,threads,chunkSize,callBack = ()=>{}) {
        if (this.activeWorkers.length === 0) {
            await this.initWorker()
        }
        
        this.chunkSize = chunkSize;
        threads = MathUtils.clamp(threads,1,this.threads);
        this.toSolve = list.length;
        this.solved = 0;
        this.solvedID = 0;
        this.activeCallback = callBack;
        let chunks = Math.ceil(this.toSolve / this.chunkSize);
        let maxThreads = Math.min(chunks,threads)
        for (let i = 0; i < maxThreads; i++) {
            this.workerPool[i].postMessage({grids:list.slice(i*this.chunkSize,Math.min((i+1)*this.chunkSize,this.toSolve))})
        }
        if (chunks - threads <= 0) return;
        this.remaining = new Array(chunks - threads);
        for (let i = 0; i < chunks - threads; i++) {
            this.remaining[i] = list.slice((i+threads)*this.chunkSize,Math.min((i+1+threads)*this.chunkSize,this.toSolve))
        }
    },

    cancel() {
        this.toSolve = 0;
        this.solved = 0;
        this.solvedID = 0;
        this.activeCallback = ()=>{};
        this.remaining = [];
    }
}
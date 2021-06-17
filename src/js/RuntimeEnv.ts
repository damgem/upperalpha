import * as DOM from "./DOMManipulators";
import {stackProxyHandler, memoryProxyHandler} from "./ProxyHandlers";

export default abstract class RuntimeEnv {

    private static _isDead: boolean = false;
    private static _accumulator: number = 0;
    private static _instructionCounter: number = 0;
    private static instructionCounterManuallySet = false;

    private static _stack: number[] = [];
    private static _memory: {[address: string] : number} = {};

    protected static stack = new Proxy(RuntimeEnv._stack, stackProxyHandler);
    protected static memory = new Proxy(RuntimeEnv._memory, memoryProxyHandler);
        
    protected static get isDead(): boolean {return this._isDead;};
    protected static set isDead(value: boolean) {console.log("Program dead = " + value); this._isDead = value;};

    protected static labels: {[label: string] : number};

    protected static get accumulator(): number {return this._accumulator;}
    protected static set accumulator(value: number) {this._accumulator = value;}

    protected static get instructionCounter(): number {return this._instructionCounter;}
    protected static set instructionCounter(value: number) {
        this._instructionCounter = value;
        this.instructionCounterManuallySet = true;
    }

    // returns the instruction counter only if it was not manually changed
    // this is done so the programm can check if the last code line has been executed
    // and therefore halt the programm
    protected static finishCodeLineExecution(): number {
        if(this.instructionCounterManuallySet){
          this.instructionCounterManuallySet = false;
          return -1;
        }

        return ++this._instructionCounter;
    }

    protected static throwError(msg: string) {
        console.warn(msg);
    }

    public static reset() {
        this._accumulator = 0;
        this._instructionCounter = 0;
        this.instructionCounterManuallySet = false;
        this._stack.length = 0;
        for (let reg in this._memory) {
            if (this._memory.hasOwnProperty(reg)) {
                delete this._memory[reg];
            }
        }
        this.isDead = false; 
        this.labels = {};
    }
};
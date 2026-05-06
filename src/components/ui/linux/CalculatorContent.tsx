'use client';

import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';

export const CalculatorContent: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setHistory('');
    setPrevValue(null);
    setOperator(null);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (nextOperator === '=') {
      if (operator && prevValue !== null) {
        let result = 0;
        switch (operator) {
          case '+': result = prevValue + inputValue; break;
          case '-': result = prevValue - inputValue; break;
          case '*': result = prevValue * inputValue; break;
          case '/': result = prevValue / inputValue; break;
          case 'mod': result = prevValue % inputValue; break;
        }
        setHistory(`${prevValue} ${operator} ${inputValue} =`);
        setDisplay(result.toString());
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(true);
      }
      return;
    }

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      let result = prevValue;
      switch (operator) {
        case '+': result += inputValue; break;
        case '-': result -= inputValue; break;
        case '*': result *= inputValue; break;
        case '/': result /= inputValue; break;
        case 'mod': result %= inputValue; break;
      }
      setPrevValue(result);
      setDisplay(result.toString());
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const scientific = (type: string) => {
    const val = parseFloat(display);
    switch (type) {
      case 'sqrt': setDisplay(Math.sqrt(val).toString()); break;
      case 'sqr': setDisplay((val * val).toString()); break;
      case 'pi': setDisplay(Math.PI.toString()); break;
    }
    setWaitingForOperand(true);
  };

  const btnClass = "h-14 rounded-lg text-white font-medium transition-all active:scale-95 flex items-center justify-center";
  const numBtn = `${btnClass} bg-white/10 hover:bg-white/15 text-lg`;
  const opBtn = `${btnClass} bg-white/5 hover:bg-white/10 text-white/70`;
  const eqBtn = `row-span-2 h-full rounded-lg bg-[#e95420] hover:bg-[#ff6333] text-white text-2xl transition-all active:scale-95 flex items-center justify-center font-bold`;

  return (
    <div className="h-full bg-[#2d2d2d] flex flex-col select-none overflow-hidden">
      {/* Tool bar */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-black/20 bg-[#353535]">
        <div className="flex gap-4 items-center">
          <span className="text-white/40 text-xs">↶ Undo</span>
          <div className="flex items-center gap-1 text-white text-xs font-bold cursor-pointer">
            Basic <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        <Menu className="w-4 h-4 text-white/70" />
      </div>

      {/* Display */}
      <div className="flex-1 flex flex-col justify-end p-6 gap-1 bg-[#2d2d2d]">
        <div className="text-right text-white/40 text-sm font-mono h-5 overflow-hidden">
          {history}
        </div>
        <div className="text-right text-white text-5xl font-light tracking-tight flex items-center justify-end gap-1">
          {display}
          <div className="w-0.5 h-10 bg-white/60 animate-pulse" />
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="p-4 bg-[#353535] grid grid-cols-5 gap-2">
        <button onClick={clear} className={opBtn}>C</button>
        <button className={opBtn}>(</button>
        <button className={opBtn}>)</button>
        <button onClick={() => performOperation('mod')} className={opBtn}>mod</button>
        <button onClick={() => scientific('pi')} className={opBtn}>π</button>

        <button onClick={() => inputDigit('7')} className={numBtn}>7</button>
        <button onClick={() => inputDigit('8')} className={numBtn}>8</button>
        <button onClick={() => inputDigit('9')} className={numBtn}>9</button>
        <button onClick={() => performOperation('/')} className={opBtn}>÷</button>
        <button onClick={() => scientific('sqrt')} className={opBtn}>√</button>

        <button onClick={() => inputDigit('4')} className={numBtn}>4</button>
        <button onClick={() => inputDigit('5')} className={numBtn}>5</button>
        <button onClick={() => inputDigit('6')} className={numBtn}>6</button>
        <button onClick={() => performOperation('*')} className={opBtn}>×</button>
        <button onClick={() => scientific('sqr')} className={opBtn}>x²</button>

        <button onClick={() => inputDigit('1')} className={numBtn}>1</button>
        <button onClick={() => inputDigit('2')} className={numBtn}>2</button>
        <button onClick={() => inputDigit('3')} className={numBtn}>3</button>
        <button onClick={() => performOperation('-')} className={opBtn}>−</button>
        <button onClick={() => performOperation('=')} className={eqBtn}>=</button>

        <button onClick={() => inputDigit('0')} className={numBtn}>0</button>
        <button onClick={inputDot} className={numBtn}>.</button>
        <button className={opBtn}>%</button>
        <button onClick={() => performOperation('+')} className={opBtn}>+</button>
      </div>
    </div>
  );
};

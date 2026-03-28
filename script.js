(function () {
  const display = document.getElementById('display');
  const expression = document.getElementById('expression');

  let currentInput = '0';
  let previousValue = null;
  let operator = null;
  let shouldResetInput = false;

  function updateDisplay() {
    display.textContent = currentInput;
  }

  function formatNumber(num) {
    if (!isFinite(num)) return 'Error';
    const str = String(num);
    if (str.length > 12) {
      return parseFloat(num.toPrecision(10)).toString();
    }
    return str;
  }

  function getOperatorSymbol(op) {
    const symbols = { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7', '%': '%' };
    return symbols[op] || op;
  }

  function calculate(a, op, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? Infinity : a / b;
      case '%': return a % b;
      default: return b;
    }
  }

  function inputNumber(value) {
    if (shouldResetInput) {
      currentInput = value;
      shouldResetInput = false;
    } else {
      currentInput = currentInput === '0' ? value : currentInput + value;
    }
    if (currentInput.length > 15) {
      currentInput = currentInput.slice(0, 15);
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (shouldResetInput) {
      currentInput = '0.';
      shouldResetInput = false;
      updateDisplay();
      return;
    }
    if (!currentInput.includes('.')) {
      currentInput += '.';
      updateDisplay();
    }
  }

  function inputOperator(op) {
    if (operator && !shouldResetInput) {
      var result = calculate(previousValue, operator, currentInput);
      var formatted = formatNumber(result);
      expression.textContent = formatted + ' ' + getOperatorSymbol(op);
      currentInput = formatted;
      previousValue = formatted;
      operator = op;
      shouldResetInput = true;
      updateDisplay();
      return;
    }
    previousValue = currentInput;
    operator = op;
    shouldResetInput = true;
    expression.textContent = currentInput + ' ' + getOperatorSymbol(op);
  }

  function inputEquals() {
    if (operator === null || previousValue === null) return;
    var result = calculate(previousValue, operator, currentInput);
    var formatted = formatNumber(result);
    expression.textContent = previousValue + ' ' + getOperatorSymbol(operator) + ' ' + currentInput + ' =';
    currentInput = formatted;
    previousValue = null;
    operator = null;
    shouldResetInput = true;
    updateDisplay();
  }

  function clearAll() {
    currentInput = '0';
    previousValue = null;
    operator = null;
    shouldResetInput = false;
    expression.textContent = '';
    updateDisplay();
  }

  function backspace() {
    if (shouldResetInput) return;
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput[0] === '-')) {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
  }

  // Button clicks
  document.querySelector('.buttons').addEventListener('click', function (e) {
    var btn = e.target.closest('.btn');
    if (!btn) return;
    var action = btn.dataset.action;
    var value = btn.dataset.value;

    switch (action) {
      case 'number': inputNumber(value); break;
      case 'decimal': inputDecimal(); break;
      case 'operator': inputOperator(value); break;
      case 'equals': inputEquals(); break;
      case 'clear': clearAll(); break;
      case 'backspace': backspace(); break;
    }
  });

  // Keyboard support
  document.addEventListener('keydown', function (e) {
    if (e.key >= '0' && e.key <= '9') { inputNumber(e.key); return; }
    if (e.key === '.') { inputDecimal(); return; }
    if (e.key === '+') { inputOperator('+'); return; }
    if (e.key === '-') { inputOperator('-'); return; }
    if (e.key === '*') { inputOperator('*'); return; }
    if (e.key === '/') { e.preventDefault(); inputOperator('/'); return; }
    if (e.key === '%') { inputOperator('%'); return; }
    if (e.key === 'Enter' || e.key === '=') { inputEquals(); return; }
    if (e.key === 'Escape') { clearAll(); return; }
    if (e.key === 'Backspace') { backspace(); return; }
  });

  updateDisplay();
})();

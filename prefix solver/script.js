let steps = [];
let currentStep = -1;
let interval = null;
let speed = 5000; // Default speed (1 second delay)

// Function to start the visualization
function runVisualization() {
    const inputElement = document.getElementById('prefixInput');
    const expression = inputElement.value.trim();
    steps = [];
    currentStep = -1;
    clearInterval(interval); // Stop any running interval before starting a new one
    
    if (!expression) {
        alert("Please enter a prefix expression.");
        return;
    }

    document.getElementById('expression').querySelector('.content').innerHTML = expression;
    document.getElementById('stack').querySelector('.content').innerHTML = '';
    document.getElementById('operand1').textContent = '';
    document.getElementById('operator').textContent = '';
    document.getElementById('operand2').textContent = '';
    document.getElementById('result').textContent = '';

    parsePrefix(expression.split(/\s+/).reverse()); // Process the prefix expression
    visualizeNextStep(); // Start the visualization
}

// Function to pause or resume the visualization
function pauseVisualization() {
    if (interval) {
        clearInterval(interval); // Pause
        interval = null;
    } else {
        visualizeNextStep(); // Resume
    }
}

// Function to clear the visualization
function clearVisualization() {
    if (interval) {
        clearInterval(interval);
    }
    document.getElementById('prefixInput').value = '';
    document.getElementById('expression').querySelector('.content').innerHTML = '';
    document.getElementById('stack').querySelector('.content').innerHTML = '';
    document.getElementById('operand1').textContent = '';
    document.getElementById('operator').textContent = '';
    document.getElementById('operand2').textContent = '';
    document.getElementById('result').textContent = '';
    steps = [];
    currentStep = -1;
}

// Function to parse and process the prefix expression
function parsePrefix(tokens) {
    const stack = [];
    
    tokens.forEach(token => {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
            addStep(token, stack.slice(), ""); // Add step for operand
        } else {
            const operand1 = stack.pop();
            const operand2 = stack.pop();
            const result = evaluate(operand1, operand2, token); // Calculate result
            stack.push(result);
            addStep(token, stack.slice(), `${operand1} ${token} ${operand2} = ${result}`); // Add step for operator and result
        }
    });
    
    const finalResult = stack.pop();
    addStep('', [], `Final Result: ${finalResult}`); // Final step
}

// Function to evaluate the operation
function evaluate(operand1, operand2, operator) {
    switch (operator) {
        case '+': return operand1 + operand2;
        case '-': return operand1 - operand2;
        case '*': return operand1 * operand2;
        case '/': return operand1 / operand2;
        default: throw new Error(`Unknown operator: ${operator}`);
    }
}

// Function to add a step to the steps array
function addStep(symbol, stack, operation) {
    steps.push({ symbol, stack, operation });
}

// Function to visualize the next step
function visualizeNextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        const step = steps[currentStep];
        updateVisualization(step);
        interval = setTimeout(visualizeNextStep, speed); // Move to the next step based on the speed
    } else {
        clearInterval(interval); // Stop when all steps are visualized
    }
}

// Function to update the visualization in the UI
function updateVisualization(step) {
    const stackElement = document.getElementById('stack').querySelector('.content');
    const expressionElement = document.getElementById('expression').querySelector('.content');
    
    stackElement.innerHTML = '';
    step.stack.forEach(item => {
        stackElement.innerHTML = `<div class="stack-enter">${item}</div>` + stackElement.innerHTML; // Display the stack
    });
    
    document.getElementById('operand1').textContent = step.stack[step.stack.length - 1] || '';
    document.getElementById('operator').textContent = step.symbol;
    document.getElementById('operand2').textContent = step.stack[step.stack.length - 2] || '';
    document.getElementById('result').textContent = step.operation;
}

// Undo functionality
function undo() {
    if (currentStep > 0) {
        currentStep--;
        updateVisualization(steps[currentStep]);
    }
}

// Redo functionality
function redo() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateVisualization(steps[currentStep]);
    }
}

// Speed control slider
document.getElementById('speedControl').addEventListener('input', function () {
    const sliderValue = this.value;
    speed = 5000-sliderValue; // Higher value on the right makes the animation faster
});

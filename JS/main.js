let form = document.querySelector('.valid-form'),
    btn = document.querySelector('.run'),
    size = document.querySelector('#size-input'),
    sizeVal = 0,
    speed = document.querySelector('#speed-input'),
    speedVal = 0;


form.addEventListener('keyup',(e) => {
    isDisabledClearBtn(size.value, speed.value)
});

function isDisabledClearBtn(size,speed) {
    if(size.length > 0 && speed.length>0) {
        document.querySelector('.run').removeAttribute('disabled')
    } else if(size.length === 0 || speed.length === 0) {
        document.querySelector('.run').setAttribute('disabled',true);
    }
}


btn.addEventListener('click', (e) => {
    let isValid = (num) => {
        let isInt = (+num ^ 0) !== 0;
        let isDotPresent = (num.match(/\./g)) == null;
        let isPositive = (num > 0) && (num !== 0);
        let result = isInt && isDotPresent && isPositive;
        return result;
    };
    // validation

    if (
        !(isValid(size.value) && isValid(speed.value)) ||
        (size.value > 1000) || !((speed.value >= 100 && speed.value <= 2000))) {

        e.preventDefault();
        size.classList.add('invalid');
        speed.classList.add('invalid');
        size.value = '';
        speed.value = '';
        alert('You entered not a number or fractional or less than zero');

    } else {
        e.preventDefault();
        sizeVal += size.value;
        speedVal += speed.value;
        btn.style = 'display:none';
        matrixView(spiralMatrixBuild(size.value));
        matrixRender(speedVal);
        document.querySelector('.size').innerHTML = `Matrix of ${size.value} elements`;
        document.querySelector('.speed').innerHTML = `Render speed is${speed.value} mS`;
        size.value = '';
        speed.value = '';
        document.querySelector('#size-input').setAttribute('disabled', true);
        document.querySelector('#speed-input').setAttribute('disabled', true);

        alert('View Matrix');

    }
});


let spiralMatrixBuild = (dimension) => {
    let matrix = [],
        x = y = 0,
        steps = dimension - 1; // Step


    for (let i = 0; i < dimension; i++) matrix[i] = []; // Create matrix

    //exception of digits in which there is a digit 6
    var myArray = [],
        endValue = Math.pow(dimension, 2);
    for (let i = 1; i <= endValue; i++) {
        i = i + '';
        if (i.match(/6/ig)) {
            endValue++;
            continue;
        } else {
            i = +i;
            myArray.push(i);
        }
    }

    for (let i = myArray.length - 1; i >= 0; i--) {
        matrix[y][x] = myArray[i];

        if (x === steps && y === dimension - steps - 1) steps--;
        // Move Down
        if ((y >= x && y < steps) || (x - 1 === y && x === dimension - steps - 1)) y++;
        // Move right
        else if (y <= x && y >= dimension - steps) y--;
        // Move up
        else if (x <= y && x < steps) x++;
        // Move left
        else if (x >= y && x >= dimension - steps) x--;
    }
    return matrix;
}

let matrixView = (matrix) => {
    let rows = '';

    for (let i = 0; i < matrix.length; i++) {
        let cells = '';

        for (let j = 0; j < matrix[i].length; j++) {
            cells += `<div class="cell">${matrix[i][j]}</div>`;
        }

        rows += '<div class="row">' + cells + '</div>';
    }
    document.querySelector('.matrix').insertAdjacentHTML('beforeend', rows);
    document.querySelector('.matrix').insertAdjacentHTML('beforeBegin', `<button class='refresh'> Refresh Matrix</button>`);
}

function matrixRender(speed) {
    let cell = document.querySelectorAll('.cell')
    let start = 0;
    let end = cell.length - 1;
    let a = [];

    cell.forEach((item, i) => a[i] = item);

    a.sort((a, b) => (b.textContent) - (a.textContent));

    setTimeout(function rend() {
        if (start < end) {
            setTimeout(rend, speed);
        }
        a[start].classList.add('show');
        start++;
    }, speed);
    document.querySelector('.refresh').addEventListener('click', () => {
        window.location.reload();
    });
}
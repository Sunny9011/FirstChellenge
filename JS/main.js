window.onload = () => updateURL(100);

let form = document.querySelector('.valid-form'),
    btn = document.querySelector('.run'),
    size = document.querySelector('#size-input'),
    sizeVal = 0,
    speed = document.querySelector('#speed-input'),
    speedVal = 100;


form.addEventListener('keyup', (e) => {
    isDisabledClearBtn(size.value)
});

function isDisabledClearBtn(size) {
    if (size.length > 0) {
        document.querySelector('.run').removeAttribute('disabled')
    } else if (size.length === 0) {
        document.querySelector('.run').setAttribute('disabled', true);
    }
}

function updateURL( param ) {
    if (history.pushState) {
        let baseUrl = `${window.location.protocol}//${window.location.host}${ window.location.pathname}`;
        let newUrl = baseUrl + `#animationSpeed=${param}`;
        history.pushState(null, null, newUrl);
    }

}


btn.addEventListener('click', (e) => {

    let speedVal = +( window.location.hash.split('=')[1]);
    if((speedVal < 9) || (speedVal > 2000)) {
        alert(`The entered speed does not meet the requirements ${speedVal}`);
        window.location.reload();
    };

    let isValid = (num) => {
        let isInt = (+num ^ 0) !== 0;
        let isDotPresent = (num.match(/\./g)) == null;
        let isPositive = (num > 0) && (num !== 0);
        return isInt && isDotPresent && isPositive;
    };

    if (!(isValid(size.value)) || (size.value > 1000)) {

        e.preventDefault();
        size.classList.add('invalid');
        size.value = '';
        alert('You entered not a number or fractional or less than zero');

    } else {
        e.preventDefault();
        sizeVal += size.value;
        btn.style = 'display:none';
        updateURL(speedVal);

        matrixView(spiralMatrixBuild(size.value));
        matrixRender(speedVal);
        document.querySelector('.size').innerHTML = `Matrix of ${size.value} elements`;


        size.value = '';
        document.querySelector('#size-input').setAttribute('disabled', true);
    }
});

//Build matrix
let spiralMatrixBuild = (dimension) => {
    let matrix = [],
        x = y = 0,
        steps = dimension - 1; // Step


    for (let i = 0; i < dimension; i++) matrix[i] = []; // Create matrix

    //exception of digits in which there is a digit 6
    let myArray = [],
        endValue = Math.pow(dimension, 2);
    for (var i = 1; i <= endValue; i++) {
        i = i + '';
        if (i.match(/6/ig)) {
            endValue++;
            continue;
        } else {
            i = +i;
            myArray.push(i);
        }
    }

    for (var i = myArray.length - 1; i >= 0; i--) {
        matrix[y][x] = myArray[i]; // Set value

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
// Add Hidden Matrix
let matrixView = (matrix) => {
    var rows = '';

    for (var i = 0; i < matrix.length; i++) {
        var cells = '';

        for (var j = 0; j < matrix[i].length; j++) {
            cells += `<div class="cell">${matrix[i][j]}</div>`;
        }

        rows += '<div class="row">' + cells + '</div>';
    }

    document.querySelector('.matrix').insertAdjacentHTML('beforeend', rows);
    document.querySelector('.matrix').insertAdjacentHTML('beforebegin', `<button class='refresh'> Refresh Matrix</button>`);


    let cellsArr = document.querySelectorAll('.cell');
    let matrixContent = document.querySelector('.matrix');

    for (var i = 0; i < cellsArr.length; i++) {
        if (matrix.length > 20 && matrix.length <= 40) {
            cellsArr[i].classList.add('sm')
        }
        if (matrix.length > 40 && matrix.length <= 59) {
            cellsArr[i].classList.add('md')
        }
        if (matrix.length > 59) {
            matrixContent.classList.add('absolute');
        }
    }
}

//Render animation matrix for user
function matrixRender(speedVal) {
    var cell = document.querySelectorAll('.cell')
    var start = 0;
    var end = cell.length - 1;
    var a = [];
    var rows = document.querySelectorAll('.row');
    console.log(rows.length);

    cell.forEach((item, i) => a[i] = item);
    a.sort((a, b) => (b.textContent) - (a.textContent));

    setTimeout(function rend() {
        if (start <  end) {
            setTimeout(rend, speedVal);
        }
        a[start].classList.add('show');
        start++;
    }, speedVal);

    document.querySelector('.refresh').addEventListener('click', () => {

        window.location.reload();
    });
}
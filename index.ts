let seconds: number;
let intervalTimer: any;

// TODO:
// Победа на уровне
// Модальные окна
// Уровни сложности
// Класс таймер

interface Card {
    name: string;
    src: string;
};

const Granat: Card = {
    name: 'granat',
    src: 'granat.png'
};

const Pineapple: Card = {
    name: 'pineapple',
    src: 'pineapple.png'
};

const Coconut: Card = {
    name: 'coconut',
    src: 'coconut.png'
};

const GrapeOne: Card = {
    name: 'grapeOne',
    src: 'grapeOne.png'
};

const GrapeTwo: Card = {
    name: 'grapeTwo',
    src: 'grapeTwo.png'
};

const typeOfCard: Array<Card> = [Granat, Pineapple, Coconut, GrapeOne, GrapeTwo];

function start(): void{
    const cards: any = document.querySelector('#cards');
    const buttons: any = document.querySelector('#buttons');
    const begin: any = document.querySelector('#begin');

    cards.hidden = false;
    buttons.hidden = false;
    begin.hidden = true;

    seconds = 120;

    createCards(8);
    timer();    
}

function createCards(count: number): void {
    const cards: any = document.querySelector('#cards');
    // cards.classList.toggle('row-cols-5');
    // cards.classList.toggle('row-cols-3')

    const arrayTypeOfCards: Card[] = createArrayCard(count);

    for(let i = 0; i < count; i++){
        let divScene: Element = document.createElement('div');
        divScene.className = 'scene col p-0 m-1';
        
        let divCard: any = document.createElement('div');
        divCard.className = 'card';
        divCard.style.border = '0px';
        divCard.id = `${i}`;
        
        divCard.addEventListener( 'click', function(): void {
            if (!divCard.classList.contains('is-flipped')){
                divCard.classList.toggle('is-flipped');
            }
            if (!divCard.classList.contains('checked'))
                check(arrayTypeOfCards, count, divCard.id);
        });

        let divFront:Element = createDivBlock('rounded card__face card__face--front border border-dark','<img src="picture/back.png" style="height: auto; width: 100%;">');
        let divBack:Element = createDivBlock('rounded card__face card__face--back border border-dark', `<img src="picture/${arrayTypeOfCards[i].src}" style="height: auto; width: 100%;">`);
        cards.append(divScene);
        divScene.append(divCard);
        divCard.append(divFront);
        divCard.append(divBack);
    }
}
function createDivBlock(className: string, html: string): Element {
    const divBlock: Element = document.createElement('div');
    
    divBlock.className = className;
    divBlock.innerHTML = html;

    return divBlock;
}
function createArrayCard(count: number): Array<Card>{
    let array: Card[] = [];
    for(let i: number = 0; i < count / 2; i++){
        array[i] = typeOfCard[i];
        array[(count / 2) + i] = typeOfCard[i];
    }
    shuffle(array, 4);

    return array;
}

function shuffle(array: Card[], count: number): void{
    for(let i: number = 0; i < count; i++){
        array.sort(() => Math.random() - 0.5);
    }
}
function check(types: Card[], countCards: number, CardId: number): void {
    let cardsIsFlipped: any = document.querySelectorAll('.is-flipped');
    let cardsWithoutChecked: any[] = [];
    for (let crd of cardsIsFlipped){
        if (!crd.classList.contains('checked') && crd.id != CardId){
            cardsWithoutChecked.push(crd);
        }
    }
    let LastCard: Element = document.getElementById(`${CardId}`);
    cardsWithoutChecked.push(LastCard);
    if (cardsWithoutChecked.length > 1){
        if (types[cardsWithoutChecked[0].id].name === types[cardsWithoutChecked[1].id].name){
            cardsWithoutChecked[0].classList.add('checked');
            cardsWithoutChecked[1].classList.add('checked');
            setPoint(20);

            setTimeout(() => {
                const cardsIsChecked: any = document.querySelectorAll('.checked');
                if(cardsIsChecked.length === countCards){
                    setPoint(seconds);
                    const result: boolean = confirm(`Вы прошли уровень.\nТекущее количество очков: ${getPoint()}\nИграем дальше?`);
                    if(result) 
                        restart();
                    else finish();
                }
            }, 1700);

            let visible: number = 1;
            setTimeout(() => {
                const intervalOpacity = setInterval(() => {
                    cardsWithoutChecked[0].parentNode.style.opacity = visible;
                    cardsWithoutChecked[1].parentNode.style.opacity = visible;
                    visible -= 0.01;
    
                    if (visible < -0.05)
                        clearInterval(intervalOpacity);
                }, 10);
            }, 500);

        } else {
            let timer: any = document.querySelector('#timer');
            timer.style.color = 'red';
            seconds -= 5;

            setTimeout(() => {
                cardsWithoutChecked[0].classList.remove('is-flipped');
                cardsWithoutChecked[1].classList.remove('is-flipped');
                timer.style.color = 'black';
            }, 500);
        }
    }
    
}

function timer(): void{
    let timer: any = document.querySelector('#timer');
    let min: number = Math.floor(seconds/60);
    let sec: number = seconds % 60;
    timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
    intervalTimer = setInterval(() => {
        seconds--;
        min = Math.floor(seconds/60);
        sec = seconds % 60;
        timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
        if (seconds < 1) {
            clearInterval(intervalTimer);
            finish('Время закончилось');
        }
    }, 1000);
}

function clearField(): void{
    const field: any = document.querySelector('#cards');
    field.innerHTML = ''
}

function restart(): void{
    clearField();
    createCards(10);
    seconds = 120;
}

function finish(str: string  = `Вы закончили! \nИтоговое количество очков: ${getPoint()}`): void{
    if (str)
        alert(str);

    clearField();
    const cards: any = document.querySelector('#cards');
    const buttons: any = document.querySelector('#buttons');
    const begin: any = document.querySelector('#begin');

    cards.hidden = true;
    buttons.hidden = true;
    begin.hidden = false;

    clearInterval(intervalTimer);
    let timer: any = document.querySelector('#timer');
    timer.textContent = '00:00';

    const points = document.querySelector('#point');
    points.textContent = '0';
}

function setPoint(point: number): void{
    const points = document.querySelector('#point');
    points.textContent = (parseInt(points.textContent) + point).toString();
}

function getPoint(): number{
    const points = document.querySelector('#point');
    return parseInt(points.textContent);
}
//import {level} from "./level.js";
class Game {
    constructor() {
        this._pointsCount = 0; //очки
        this._points = document.getElementById('point');
        this._field = document.getElementById('cards');
        this._startGameButton = document.getElementById('startGame');
        this._restartButton = document.getElementById('restart');
        this._endGameButton = document.getElementById('endGame');
        this._startGameButton.addEventListener('click', this._onClickStartGame.bind(this));
        this._restartButton.addEventListener('click', this._onClickRestart.bind(this));
        this._endGameButton.addEventListener('click', this._onClickEndGame.bind(this));
        this._typeOfCard = this._createTypeOfCard();
        this.countLevel = 1;
    }
    _onClickRestart() {
        this._clearField();
        this._pointsCount = 0;
        this._points.textContent = '0';
        this._level.clear();
        delete this._level;
        this.countLevel = 1;
        this._onClickStartGame();
        //createCards(10);
        //seconds = 120; //в другом классе
    }
    _onClickEndGame() {
        this._setPoint(0);
        this.countLevel = 1;
        this._clearField();
        const result = confirm(`Вы закончили.\nТекущее количество очков: ${this._getPoint()}\nИграем снова?`);
        if (result)
            game._onClickRestart();
        else {
            this._level.clear();
            delete this._level;
            this._pointsCount = 0;
            this._field.hidden = true;
            this._startGameButton.hidden = false;
            this._restartButton.hidden = true;
            this._endGameButton.hidden = true;
        }
    }
    _clearField() {
        this._field.innerHTML = '';
    }
    _onClickStartGame() {
        this._field.hidden = false;
        this._startGameButton.hidden = true;
        this._restartButton.hidden = false;
        this._endGameButton.hidden = false;
        this._clearField();
        this._level = new level(this.countLevel + 1, this._typeOfCard, 5, this);
        // seconds = 120;
        // createCards(10);
        // timer();    
    }
    _createTypeOfCard() {
        const Granat = { name: 'granat', src: 'granat.png' };
        const Pineapple = { name: 'pineapple', src: 'pineapple.png' };
        const Coconut = { name: 'coconut', src: 'coconut.png' };
        const GrapeOne = { name: 'grapeOne', src: 'grapeOne.png' };
        const GrapeTwo = { name: 'grapeTwo', src: 'grapeTwo.png' };
        const Melon = { name: 'Melon', src: 'melon.png' };
        const MelonTwo = { name: 'MelonTwo', src: 'melonTwo.png' };
        const Pear = { name: 'Pear', src: 'pear.png' };
        return [Pear, Melon, MelonTwo, Granat, Pineapple, Coconut, GrapeOne, GrapeTwo];
    }
    _setPoint(point) {
        this._pointsCount += point;
        this._points.textContent = this._pointsCount.toString();
    }
    _getPoint() {
        return this._pointsCount;
    }
    levelPlus() {
        this.countLevel = this.countLevel + 1;
    }
    getLevel() {
        return this.countLevel;
    }
}
;
const game = new Game();
class level {
    constructor(countPairs, typeOfCards, seconds, game) {
        console.log(countPairs);
        this._game = game;
        this._timer = document.getElementById('timer');
        this._field = document.getElementById('cards');
        this._field.style.width = `${140 * countPairs}px`;
        this._cards = this._createArrayCards(countPairs, this._shuffle(typeOfCards, typeOfCards.length));
        this._createElementsCards();
        this._seconds = seconds;
        this._timerInterval();
    }
    _createElementsCards() {
        for (let i = 0; i < this._cards.length; i++) {
            const divScene = this._createDivBlock('scene col p-0 m-1');
            const divCard = this._createDivBlock('card');
            divCard.style.border = '0px';
            divCard.id = `${i}`;
            divCard.addEventListener('click', this._onClickCard.bind(this));
            let divFront = this._createDivBlock('rounded card__face card__face--front border border-dark', '<img src="picture/back.png" style="height: auto; width: 100%;">');
            let divBack = this._createDivBlock('rounded card__face card__face--back border border-dark', `<img src="picture/${this._cards[i].src}" style="height: auto; width: 100%;">`);
            this._field.append(divScene);
            divScene.append(divCard);
            divCard.append(divFront);
            divCard.append(divBack);
        }
    }
    _createDivBlock(className, html) {
        const divBlock = document.createElement('div');
        divBlock.className = className;
        divBlock.innerHTML = html ? html : '';
        return divBlock;
    }
    _createArrayCards(count, typeOfCards) {
        let array = [];
        for (let i = 0; i < count; i++) {
            array[i] = typeOfCards[i];
            array[count + i] = typeOfCards[i];
        }
        return this._shuffle(array, 4);
    }
    _shuffle(array, count) {
        for (let i = 0; i < count; i++) {
            array.sort(() => Math.random() - 0.5);
            return array;
        }
    }
    _onClickCard(e) {
        if (!e.currentTarget.classList.contains('is-flipped')) {
            e.currentTarget.classList.toggle('is-flipped');
        }
        if (e.currentTarget.classList.contains('checked'))
            return;
        let cardsIsFlipped = document.querySelectorAll('.is-flipped');
        let cardsWithoutChecked = [];
        for (let crd of cardsIsFlipped) {
            if (!crd.classList.contains('checked') && crd.id != e.target.id) {
                cardsWithoutChecked.push(crd);
            }
        }
        let LastCard = document.getElementById(`${e.target.id}`);
        cardsWithoutChecked.push(LastCard);
        if (cardsWithoutChecked.length > 1) {
            if (this._cards[cardsWithoutChecked[0].id].name === this._cards[cardsWithoutChecked[1].id].name) {
                cardsWithoutChecked[0].classList.add('checked');
                cardsWithoutChecked[1].classList.add('checked');
                this._game._setPoint(20);
                setTimeout(() => {
                    const cardsIsChecked = document.querySelectorAll('.checked');
                    if (cardsIsChecked.length === this._cards.length) {
                        this._game._setPoint(this._seconds);
                        if (this._game.getLevel() === 7) {
                            this._game._onClickEndGame();
                        }
                        else {
                            const result = confirm(`Вы прошли уровень.\nТекущее количество очков: ${this._game._getPoint()}\nИграем дальше?`);
                            if (result) {
                                this._game.levelPlus();
                                this._game._clearField();
                                this._game._onClickStartGame();
                            }
                            else
                                this._game.onClickEndGame();
                        }
                        clearInterval(this._interval);
                    }
                }, 1700);
                let visible = 1;
                setTimeout(() => {
                    const intervalOpacity = setInterval(() => {
                        cardsWithoutChecked[0].parentNode.style.opacity = visible;
                        cardsWithoutChecked[1].parentNode.style.opacity = visible;
                        visible -= 0.01;
                        if (visible < -0.05)
                            clearInterval(intervalOpacity);
                    }, 10);
                }, 500);
            }
            else {
                this._timer.style.color = 'red';
                this._seconds -= 5;
                setTimeout(() => {
                    cardsWithoutChecked[0].classList.remove('is-flipped');
                    cardsWithoutChecked[1].classList.remove('is-flipped');
                    this._timer.style.color = 'black';
                }, 500);
            }
        }
    }
    _timerInterval() {
        let min = Math.floor(this._seconds / 60);
        let sec = this._seconds % 60;
        this._timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
        this._interval = setInterval(() => {
            this._seconds--;
            min = Math.floor(this._seconds / 60);
            sec = this._seconds % 60;
            this._timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
            if (this._seconds < 1) {
                alert('Время закончилось');
                this._game._onClickEndGame();
                clearInterval(this._interval);
            }
        }, 1000);
    }
    clear() {
        clearInterval(this._interval);
        this._timer.textContent = '00:00';
    }
    getSeconds() {
        return this._seconds;
    }
}
;

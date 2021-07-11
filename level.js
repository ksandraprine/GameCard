export class level {
    constructor(countPairs, typeOfCards, seconds, game) {
        this._game = game;
        this._timer = document.getElementById('timer');
        this._field = document.getElementById('cards');
        this._cards = this._createArrayCards(countPairs, typeOfCards);
        this._createElementsCards();
        this._seconds = seconds;
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
                        const result = confirm(`Вы прошли уровень.\nТекущее количество очков: ${this._game._getPoint()}\nИграем дальше?`);
                        if (result)
                            this._game._onClickRestart();
                        else
                            this._game._onClickEndGame();
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
                clearInterval(this._interval);
                // finish('Время закончилось');
            }
        }, 1000);
    }
}
;

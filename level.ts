export class level{
   protected _timer: HTMLElement;
   protected _cards: Array<Card>;
   protected _field: HTMLElement; //поле с карточками
   protected _seconds: number;
   public _interval: number;
   protected _game;
   
constructor(countPairs:number, typeOfCards: Array<Card>, seconds: number, game){
    this._game = game;
    this._timer = document.getElementById('timer');
    this._field = document.getElementById('cards');
    this._cards = this._createArrayCards(countPairs, typeOfCards);
    this._createElementsCards();
    this._seconds = seconds;
}
    protected _createElementsCards(){
        for(let i = 0; i < this._cards.length; i++){
            const divScene: HTMLElement = this._createDivBlock('scene col p-0 m-1');
            
            const divCard: HTMLElement = this._createDivBlock('card');
            divCard.style.border = '0px';
            divCard.id = `${i}`;
            
            divCard.addEventListener( 'click', this._onClickCard.bind(this));
    
            let divFront: HTMLElement = this._createDivBlock('rounded card__face card__face--front border border-dark','<img src="picture/back.png" style="height: auto; width: 100%;">');
            let divBack: HTMLElement = this._createDivBlock('rounded card__face card__face--back border border-dark', `<img src="picture/${this._cards[i].src}" style="height: auto; width: 100%;">`);
            this._field.append(divScene);
            divScene.append(divCard);
            divCard.append(divFront);
            divCard.append(divBack);
        }


    }
    protected _createDivBlock(className: string, html?: string): HTMLElement {
        const divBlock: HTMLElement = document.createElement('div');
        
        divBlock.className = className;
        divBlock.innerHTML = html ? html : '';
    
        return divBlock;
    }
    protected _createArrayCards(count: number, typeOfCards:Array<Card>): Array<Card>{
        let array: Card[] = [];
        for(let i: number = 0; i < count; i++){
            array[i] = typeOfCards[i];
            array[count  + i] = typeOfCards[i];
        }
    
        return this._shuffle(array, 4);
    }
    
    protected _shuffle(array: Card[], count: number): Array<Card>{
        for(let i: number = 0; i < count; i++){
            array.sort(() => Math.random() - 0.5);
            return array;
        } 
    }
    protected _onClickCard(e: any  ): void{
        
            if (!e.currentTarget.classList.contains('is-flipped')){
                e.currentTarget.classList.toggle('is-flipped');
            }
            if (e.currentTarget.classList.contains('checked'))
                return;
        
            let cardsIsFlipped: any = document.querySelectorAll('.is-flipped');
            let cardsWithoutChecked: any[] = [];
            for (let crd of cardsIsFlipped){
                if (!crd.classList.contains('checked') && crd.id != e.target.id){
                    cardsWithoutChecked.push(crd);
                }
            }
            let LastCard: Element = document.getElementById(`${e.target.id}`);
            cardsWithoutChecked.push(LastCard);
            if (cardsWithoutChecked.length > 1){
                if (this._cards[cardsWithoutChecked[0].id].name === this._cards[cardsWithoutChecked[1].id].name){
                    cardsWithoutChecked[0].classList.add('checked');
                    cardsWithoutChecked[1].classList.add('checked');
                    this._game._setPoint(20);

                    setTimeout(() => {
                        const cardsIsChecked: any = document.querySelectorAll('.checked');
                        if(cardsIsChecked.length === this._cards.length){
                            this._game._setPoint(this._seconds);
                             const result: boolean = confirm(`Вы прошли уровень.\nТекущее количество очков: ${this._game._getPoint()}\nИграем дальше?`);
                            if(result) 
                               this._game._onClickRestart();
                            else this._game._onClickEndGame();
                        clearInterval(this._interval);
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
            protected _timerInterval(): void{
                let min: number = Math.floor(this._seconds/60);
                let sec: number = this._seconds % 60;
                this._timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
                this._interval = setInterval(() => {
                    this._seconds--;
                    min = Math.floor(this._seconds/60);
                    sec = this._seconds % 60;
                    this._timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
                    if (this._seconds < 1) {
                        clearInterval(this._interval);
                       // finish('Время закончилось');
                    }
                }, 1000);
            }
           
}
interface Card {
    name: string;
    src: string;
};
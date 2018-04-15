class ElevenTable {
    constructor(number) {
        this.number = this.numString(number);
        this.numArray = [];
        this.splitNumber();
    }

    splitNumber() {
        let stringArray = this.number.split('');
        let splittedNums = stringArray.map(n => this.stringToNum(n));
        this.numArray = [0, ...splittedNums, 0];
    }

    numString(num = this.number) {
        return String(num);
    }
    stringToNum(num = this.number) {
        return Number(num)
    }
    sum() {
        let result = '';
        for (let i = 0; i < this.numArray.length - 1; i++) {
            result += String(Number(this.numArray[i] + Number(this.numArray[i+1])))
        }
        return result;
    }
}

let eleven = new ElevenTable(12);

console.log(eleven.sum()) // 132


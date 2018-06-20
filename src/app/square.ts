export class Square {
    curr: any;
    data: any = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    origin: any = {
        x: 0,
        y: 0
    };
    dir: number = 0;
    SQUARES: any = {
        // 口口
        // 口口
        0: [
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        // 口口口口
        1: [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        //    口
        //  口口口
        2: [
            [
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [1, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        //   口口
        // 口口
        3: [
            [
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        //  口口
        //    口口
        4: [
            [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        //  口
        //  口口口
        5: [
            [
                [1, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [1, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        //      口
        //  口口口
        6: [
            [
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ], [
                [1, 1, 1, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ], [
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ]
        ]
    }

    constructor (index: number = 0) {
        this.curr = this.SQUARES[index];
    }

    isValid (pos: any, data: any, stageArray: any) {
        for (let i = 0, len = data.length; i < len; i++) {
            for (let j = 0, lenj = data[i].length; j < lenj; j++) {
                if (data[i][j] != 0) {
                    if (!this.checkPoint(pos, i, j, stageArray)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    checkPoint (pos: any, x: number, y: number, data: any) {
        return (
            pos.x + x < 0
            || pos.x + x >= data.length
            || pos.y + y < 0
            || pos.y + y >= data[0].length
            || data[pos.x + x][pos.y + y] === 2
        ) ? false : true;
    }

    canRotate (stageArray: any) {
        let len: number = this.curr.length;
        let index: number = this.dir % len;
        let test: any = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                test[i][j] = this.curr[index][i][j];
            }
        }
        return this.isValid(this.origin, test, stageArray);
    }

    rotate (num: number = 1) {
        let len: number = this.curr.length;
        this.dir = (this.dir + num) % len;
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                this.data[i][j] = this.curr[this.dir][i][j];
            }
        }
    }

    canLeft (stageArray: any) {
        let test: any = {};
        test.x = this.origin.x;
        test.y = this.origin.y - 1;
        return this.isValid(test, this.data, stageArray);
    }

    left () {
        this.origin.y = this.origin.y - 1;
    }

    canRight (stageArray: any) {
        let test: any = {};
        test.x = this.origin.x;
        test.y = this.origin.y + 1;
        return this.isValid(test, this.data, stageArray);
    }

    right () {
        this.origin.y = this.origin.y + 1;
    }

    canDown (stageArray: any) {
        let test: any = {};
        test.x = this.origin.x + 1;
        test.y = this.origin.y;
        return this.isValid(test, this.data, stageArray);
    }

    down () {
        this.origin.x = this.origin.x + 1;
    }
}

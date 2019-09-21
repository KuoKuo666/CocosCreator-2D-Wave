cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Mask
    },

    onLoad () {
        // 水面高度
        this.h = 200;
        this.n = 20;                 // 细分数
        this.nodeArray = [];         // 装载水面上的点
        this.nodeEnergy = [];        // 每个点的能量
        // 赋予初始值
        for (let i = 0; i < this.n; i++) {
            this.nodeEnergy[i] = 0;
        }
    },

    start () {
        // 创建水面上点
        for (let i = 0; i < this.n; i++) {
            let node = {x: 0, y: 0};
            node.y = this.h;
            node.x = -360 + (i + 1) * 720 / this.n;
            this.nodeArray[i] = node;
        }
        // 最右侧点缓动
        let obj = this.nodeArray[this.n-1];
        let time = 0.5;
        cc.tween(obj)
            .repeatForever(
                cc.tween()
                .to(time, { y: 40 + this.h}, { easing: 'sineOut'})
                .to(time, { y: 0 + this.h}, { easing: 'sineIn'})
                .to(time, { y: -40 + this.h}, { easing: 'sineOut'})
                .to(time, { y: 0 + this.h}, { easing: 'sineIn'})
            )
        .start();
    },

    // 利用遮罩原理，把下方显示
    showWater () {
        let draw = this.mask._graphics;
        draw.clear();
        draw.lineWidth = 1;
        draw.strokeColor = cc.color(255,0,0);
        draw.fillColor = cc.color(0,255,0);
        draw.moveTo(-360, this.h);
        for (let i = 0; i < this.n; i+=2) {
            // 贝塞尔
            draw.quadraticCurveTo(this.nodeArray[i].x, this.nodeArray[i].y, this.nodeArray[i+1].x, this.nodeArray[i+1].y);
        }
        // 封闭区域
        draw.lineTo(360, -640);
        draw.lineTo(-360, -640);
        draw.lineTo(-360, this.h);
        draw.fill();
        draw.stroke();
    },

    update (dt) {
        // 左右点互相影响 2 次, 决定波的传播快慢
        for (let k = 0; k < 2; k++) {
            for (let i = 0; i < this.n; i++) {
                if (i > 0) {
                    // 0.02 的传播损失
                    // 向左传
                    this.nodeEnergy[i-1] += 0.98 * (this.nodeArray[i].y - this.nodeArray[i-1].y);
                }
                if (i < this.n - 1) {
                    // 向右传
                    this.nodeEnergy[i+1] += 0.98 * (this.nodeArray[i].y - this.nodeArray[i+1].y);
                }
            }
        }  
        // 最右侧的跳过
        for (let i = 0; i < this.n - 1; i++) {
            // 0.02 速度损失
            this.nodeEnergy[i] *= 0.98;
            // 改变位置
            this.nodeArray[i].y += this.nodeEnergy[i] * dt;
        }
        this.showWater();
    },
});

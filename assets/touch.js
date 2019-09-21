var Wave = require('wave');

cc.Class({
    extends: cc.Component,

    properties: {
       wave: Wave
    },

    start () {
        this.node.on('touchend', (e) => {
            let index = Math.floor(e.getLocation().x / 720 * this.wave.n);
            this.wave.nodeEnergy[index] += 800;
        })
    }

});

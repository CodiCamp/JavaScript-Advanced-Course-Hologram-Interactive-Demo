
var Resize = {

    onRender: function() {
        this.updateScreenParams();
    },

    updateScreenParams: function () {
        this.screen.width = window.innerWidth ;
        this.screen.height = window.innerHeight ;
        this.projectionAreaSize = Math.min(this.screen.width, this.screen.height);
        this.projectionAreaPositionX = (this.screen.width / 2) - (this.projectionAreaSize / 2);
        this.projectionAreaPositionY = 0;

        this.sizeProjectionArea();
    },

    sizeProjectionArea: function () {
        //size
        this.elements.projectionArea.style.width = this.projectionAreaSize + 'px';
        this.elements.projectionArea.style.height = this.projectionAreaSize + 'px';

        //position
        this.elements.projectionArea.style.top = this.projectionAreaPositionY + 'px';
        this.elements.projectionArea.style.left = this.projectionAreaPositionX + 'px';
    }
}

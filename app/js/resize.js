(function ResizeModule() {

    var Resize = {

        screen: {
            width: 0,
            height: 0
        },

        elements: {
            projectionArea: null
        },

        onRender: function() {
            this.getElements();
            this.updateScreenParams();
        },

        getElements: function () {
            //Projection elements
            this.elements.projectionArea = document.getElementById('projection');
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

    Resize.onRender();
})();
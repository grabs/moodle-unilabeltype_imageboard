/**
 * Unilabel type imageboard
 *
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const init = () => {
    // Store some data about the selected image that is moved.
    var selectedImage = [];
    selectedImage.number = null;
    // ItemToMove is the div that the selected image is inside. We do NOT move the image we move the div.
    selectedImage.itemToMove = null;
    // ToDo: Add documentation about xoffset?
    selectedImage.eventlayerX = 0;
    selectedImage.eventlayerY = 0;
    selectedImage.width = null;
    selectedImage.height = null;

    // Store the data about the canvas/background.
    var canvas = null;
    var canvaswidth = 950;
    var canvasheight = 400;

    registerDnDListener();

    /**
     *
     */
    function registerDnDListener() {
        setTimeout(function() {
            canvas = document.getElementById("unilabel-imageboard-background-area");
            canvas.addEventListener("dragstart", dragStart, false);
            canvas.addEventListener("drag", drag, false);
            canvas.addEventListener("dragend", dragEnd, false);
        }, 1000);
    }

    /**
     *
     * @param {event} event
     */
    function dragStart(event) {
        if (event && event.target && event.target.classList.contains('image')) {
            // Image was selected so we have to store the information about this image.
            // ToDo: height auto needs different code
            selectedImage.number = event.target.getAttribute('id').split('unilabel-imageboard-imageid_')[1];
            selectedImage.width = event.target.style.width.split('px')[0];
            selectedImage.height = event.target.style.height.split('px')[0];
            selectedImage.itemToMove = document.getElementById('unilabel_imageboard_imagediv_' + selectedImage.number);
            selectedImage.eventlayerX = event.layerX;
            selectedImage.eventlayerY = event.layerY;
            // Clone the selected image and use it as dragimage.
            let clonedImage = event.target.cloneNode(false);
            clonedImage.setAttribute('id', 'iamdragged');
            setTimeout(function() {
                event.dataTransfer.setDragImage(clonedImage, event.layerX, event.layerY);
            }, 0);
        }
    }

    /**
     *
     * @param {event} event
     */
    function drag(event) {
        console.log("drag", event);
        // Maybe we can do something during dragging but at the moment I do not have access to the upper left
        // corner of the dragged image.
    }

    /**
     *
     * @param {event} event
     */
    function dragEnd(event) {
        if (selectedImage.number !== null ) {
            var xposition = calculateXposition(event);
            var yposition = calculateYposition(event);
            selectedImage.itemToMove.style.left = xposition + "px";
            selectedImage.itemToMove.style.top = yposition + "px";
            // Change the inputfield
            const inputPositionX = document.getElementById('id_unilabeltype_imageboard_xposition_' + (selectedImage.number));
            const inputPositionY = document.getElementById('id_unilabeltype_imageboard_yposition_' + (selectedImage.number));
            inputPositionX.value = xposition;
            inputPositionY.value = yposition;
            // Reset saved image data
            selectedImage.number = null;
        }
    }

    /**
     *
     * @param {event} event
     * @returns {number}
     */
    function calculateXposition(event) {
        var canvasboundings = canvas.getBoundingClientRect();
        var xposition = event.clientX - canvasboundings.left - selectedImage.eventlayerX - 1;
        if (xposition < 0) {
            xposition = 0;
        }
        if (xposition >= canvaswidth - selectedImage.width) {
            xposition = canvaswidth - selectedImage.width;
        }
        return Math.round(xposition);
    }

    /**
     *
     * @param {event} event
     * @returns {number}
     */
    function calculateYposition(event) {
        var canvasboundings = canvas.getBoundingClientRect();
        var yposition = event.clientY - canvasboundings.top - selectedImage.eventlayerY - 1;
        if (yposition < 0) {
            yposition = 0;
        }
        if (yposition >= canvasheight - selectedImage.height) {
            yposition = canvasheight - selectedImage.height;
        }
        return Math.round(yposition);
    }
};

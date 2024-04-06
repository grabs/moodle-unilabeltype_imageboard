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
    selectedImage.src = '';
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
    var img = new Image();

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
     * ToDo: height auto needs different code
     * @param {event} event
     */
    function dragStart(event) {
        console.log("dragStart", event);
        if (event && event.target && event.target.classList.contains('image')) {
            // Image was selected so we have to store the information about this image.
            selectedImage.src = event.target.src;
            selectedImage.number = event.target.getAttribute('id').split('unilabel-imageboard-imageid_')[1];
            selectedImage.width = event.target.style.width.split('px')[0];
            selectedImage.height = event.target.style.height.split('px')[0];
            selectedImage.itemToMove = document.getElementById('unilabel_imageboard_imagediv_' + selectedImage.number);
            selectedImage.eventlayerX = event.layerX;
            selectedImage.eventlayerY = event.layerY;

            console.log('selectedImage', selectedImage);

            // Now we create a div and place the image that has to be moved in order to add it to he event
            // by using event.dataTransfer.setDragImage
            var div = document.createElement("div");
            div.id = "iamdragged";
            div.style.width = selectedImage.width + "px";
            div.style.height = selectedImage.height + "px";
            document.body.appendChild(div);

            img.src = selectedImage.src;
            img.style.border = "10px solid #ff0000";
            img.width = selectedImage.width;
            img.height = selectedImage.height;

            document.getElementById('iamdragged').appendChild(img);
            event.dataTransfer.setDragImage(div, event.layerX + 0, event.layerY + 0);
        }
    }

    /**
     *
     */
    function drag() {
        // console.log("drag", event);
        // Maybe we can do something during dragging but at the moment I do not have access to the upper left
        // corner of the dragged image.
    }

    /**
     *
     * @param {event} event
     */
    function dragEnd(event) {
        console.log("dragEnd", event);
        if (selectedImage.number !== null ) {
            var xposition = calculateXposition(event);
            console.log("xposition", xposition);
            var yposition = calculateYposition(event);
            console.log("yposition", yposition);
            selectedImage.itemToMove.style.left = xposition + "px";
            selectedImage.itemToMove.style.top = yposition + "px";
            // Change the inputfield
            const inputPositionX = document.getElementById('id_unilabeltype_imageboard_xposition_' + (selectedImage.number));
            const inputPositionY = document.getElementById('id_unilabeltype_imageboard_yposition_' + (selectedImage.number));
            inputPositionX.value = xposition;
            inputPositionY.value = yposition;
            // Reset saved image data
            selectedImage.number = null;
            document.getElementById('iamdragged').remove();
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

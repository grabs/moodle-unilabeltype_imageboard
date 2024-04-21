/**
 * Unilabel type imageboard
 *
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//import Templates from 'core/templates';;

export const init = () => {
    // Create an array selectedImage to be able to store some data about the selected image that is moved.
    var selectedImage = [];
    selectedImage.number = null;
    selectedImage.number = null;
    selectedImage.src = '';
    // ItemToMove is the div that the selected image is inside AND the title. We do NOT move the image we move the itemtomove-div.
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
     *  We need two event listeners for drag and drop. One when the dragging starts and one when it ends.
     */
    function registerDnDListener() {
        setTimeout(function() {
            canvas = document.getElementById("unilabel-imageboard-background-canvas");
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
        console.log("dragStart event", event);
        if (event && event.target && event.target.classList.contains('unilabel-imageboard-element-draggable')) {
            // Image was selected, so we have to store the information about this image.
            // 1. Get the number of the selected element.
            let number = event.target.getAttribute('id').split('unilabel-imageboard-element-')[1];
            // 2. Get imagedata of the selected element.
            let imagedata = getAllImagedataFromForm(number);
            // 3. Set the number of the selected image so this image can be updated when dragEnds.
            selectedImage.number = number;
            // 4. Collect the other information.
            selectedImage.title = imagedata['title'];
            selectedImage.fontsize = imagedata['fontsize'];
            selectedImage.width = imagedata['targetwidth'];
            selectedImage.height = imagedata['targetheight'];
            selectedImage.itemToMove = document.getElementById('unilabel-imageboard-element-' + selectedImage.number);
            // layerX and layerY is the relative position of the mouseposition inside div
            // div is the image or the title so layer depends on this according to the complete element.
            // ToDo: DragAndDrop of title
            selectedImage.eventlayerX = event.layerX;
            selectedImage.eventlayerY = event.layerY;
        }
    }

    /**
     *
     * @param {event} event
     */
    function drag(event) {
        console.log("drag event.offsetX", event.offsetX);
        console.log("drag selectedImage.itemToMove.style.left", selectedImage.itemToMove.style.left);
        console.log("event.target", event.target);
        console.log("-- event.target.style", event.target.style);
        // var xposition = calculateXposition(event);
       // console.log("xposition", xposition);
       // var yposition = calculateYposition(event);
       // console.log("yposition", yposition);
    }

    /**
     *
     * @param {event} event
     */
    function dragEnd(event) {
        console.log("dragEnd", event);
        console.log("drag event.offsetX", event.offsetX);
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
        }
    }

    /**
     * Get all data from image that is stored in the form and collects them in one array.
     *
     * @param {int} number of the image
     * @returns {*[]} Array with the collected information that are set in the form for the image.
     */
    function getAllImagedataFromForm(number) {
        //console.log("getAllImagedataFromForm number= " + number);
        let imageids = {
            title: 'id_unilabeltype_imageboard_title_' + number,
            titlecolor: 'id_unilabeltype_imageboard_titlecolor_colourpicker',
            titlebackgroundcolor: 'id_unilabeltype_imageboard_titlebackgroundcolor_colourpicker',
            fontsize: 'id_unilabeltype_imageboard_fontsize',
            xposition: 'id_unilabeltype_imageboard_xposition_' + number,
            yposition: 'id_unilabeltype_imageboard_yposition_' + number,
            targetwidth: 'id_unilabeltype_imageboard_targetwidth_' + number,
            targetheight: 'id_unilabeltype_imageboard_targetheight_' + number,
            src: '',
            border: 'id_unilabeltype_imageboard_border_' + number,
        };

        let imagedata = [];
        //console.log("document.getElementById(imageids.title)", document.getElementById(imageids.title));
        imagedata['title'] = document.getElementById(imageids.title).value;
        imagedata['titlecolor'] = document.getElementById(imageids.titlecolor).value;
        imagedata['titlebackgroundcolor'] = document.getElementById(imageids.titlebackgroundcolor).value;
        imagedata['fontsize'] = document.getElementById(imageids.fontsize).value;
        imagedata['xposition'] = document.getElementById(imageids.xposition).value;
        imagedata['yposition'] = document.getElementById(imageids.yposition).value;
        imagedata['targetwidth'] = document.getElementById(imageids.targetwidth).value;
        imagedata['targetheight'] = document.getElementById(imageids.targetheight).value;

        // Src der Draftfile ermitteln
        const element = document.getElementById('id_unilabeltype_imageboard_image_' + number + '_fieldset');
        const imagetag = element.getElementsByTagName('img');
        let src = '';
        if (imagetag.length && imagetag.length != 0) {
            src = imagetag[0].src;
            src = src.split('?')[0];
        }
        imagedata['src'] = src;
        imagedata['border'] = document.getElementById(imageids.border).value;

        return imagedata;
    }

    /**
     *
     * @param {event} event
     * @returns {number}
     */
    function calculateXposition(event) {

        console.log("------calculateXposition");
        console.log("event", event);

        var canvasboundings = canvas.getBoundingClientRect();
        console.log("canvasboundings", canvasboundings);


        var dummy = event.dataTransfer;
        console.log(" event.dataTransfer", dummy);

        console.log("event.clientX", event.clientX);
        console.log("canvasboundings.left", canvasboundings.left);
        console.log("selectedImage.eventlayerX", selectedImage.eventlayerX);

        //var xposition = event.clientX - canvasboundings.left - selectedImage.eventlayerX - 1;
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

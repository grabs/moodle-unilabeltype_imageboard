/**
 * Unilabel type imageboard
 *
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//import log from 'core/log';
//import {eventTypes} from 'core_form/events';
////import Templates from "../../../../../../lib/amd/src/templates";
import Templates from 'core/templates';

export const init = () => {
    registerAllEventlistener();
    // Timeout notwendig, damit das Bild in der Draftarea "vorhanden" ist.
    // document.querySelector('#id_unilabeltype_imageboard_backgroundimage_fieldset .filemanager-container .realpreview');
    setTimeout(refreshBackgroundImage, 1000);
    // To show all images on pageload.
    setTimeout(refreshAllImages, 1000);

    setTimeout(function() {
     //   grid(600, 400);
    }, 500);

    /**
     *
     * @param {event} event
     */
    function focusoutExecute(event) {
        console.log("focusoutExecute", event);
        var number = getNumberFromEvent(event);
        if (number >= 0) {
            refreshImage(number);
        } else {
            console.log("refreshAllImages");
            // ToDo: only refresh if titlecolor, titlebackgroundcolor, titlesize was changed
            refreshAllImages();
        }
    }

    /**
     *
     * @param {event} event
     * @returns {*}
     */
    function getNumberFromEvent(event) {
        // If there is a focusout event from one of the following input fields then evaluate
        // the number of the element that was changed.
        let imageidselectors = [
            'id_unilabeltype_imageboard_title_',
            'id_unilabeltype_imageboard_xposition_',
            'id_unilabeltype_imageboard_yposition_',
            'id_unilabeltype_imageboard_targetwidth_',
            'id_unilabeltype_imageboard_targetheight_',
            'id_unilabeltype_imageboard_border_',
        ];
        const eventid = event.target.getAttribute('id');
        for (let i = 0; i < imageidselectors.length; i++) {
            if (eventid.includes(imageidselectors[i])) {
                return eventid.split(imageidselectors[i])[1];
            }
        }
        // If focus out was NOT from one of our inputfield then return a number less than zero.
        return -1;
    }

    /**
     *
     * @param {event} event
     */
    function onclickExecute(event) {
        var targetid = event.target.getAttribute('id');
        var mform = targetid.split('button-mform1')[1];
        if (mform) {
            setTimeout(function() {
                // An element was added so we have to add a div for the image to the dom.
                let singleElements = document.querySelectorAll('[id^="fitem_id_unilabeltype_imageboard_title_"]');
                let number = singleElements.length;
                addImageToDom(number - 1);
            }, 500);
        }
    }

    /**
     *
     * @param {number} canvaswidth
     * @param {number} canvasheight
     */
  /*  function grid(canvaswidth, canvasheight) {
        // Create a 50x50px helpergrid if $capababilityforgrid.
        let helpergrids = {};
        for (let y = 0; y < canvasheight; y = y + 50) {
            for (let x = 0; x < canvaswidth; x = x + 50) {
                helpergrid = [];
                helpergrid['x'] = x;
                helpergrid['y'] = y;
                helpergrids = helpergrid;
            }
        }
    }*/

    /**
     *
     * @param {event} event
     */
    /*
    function machwas(event) {
        log.debug("Bild hochgeladen");
        log.debug(event);
    }
    */

    /**
     * Register eventlistener to the all input fields of the form to register
     * focus-out events from input fields in order to trigger a fresh of the preview.
     */
    function registerAllEventlistener() {
        var mform = document.querySelectorAll('[id^="mform"]')[0];
        // We register one listener per eventtype to the mform and use the bubble-event-feature to check out
        // the target of an event.

        // All focusout-events will be handeled by oneListenerForAllInputFocusout.
        mform.addEventListener("focusout", focusoutExecute, false);

        // All click-events will be handeled by oneListenerForAllInputClick.
        mform.addEventListener("click", onclickExecute, false);

        // All uploadCompleted-events
        //// mform.addEventListener(eventTypes.uploadCompleted, machwas, false);

        // First: When uploading a backgroundimage the backgroundimage of the backgroundimagediv must be updated.
        // ToDo: better use eventlistener
        let backgroundfileNode = document.getElementById('id_unilabeltype_imageboard_backgroundimage_fieldset');
        if (backgroundfileNode) {
            let observer = new MutationObserver(refreshBackgroundImage);
            observer.observe(backgroundfileNode, {attributes: true, childList: true, subtree: true});
        }
        // Also add listener for canvas size
        let canvasx = document.getElementById('id_unilabeltype_imageboard_canvaswidth');
        if (canvasx) {
            let observer = new MutationObserver(refreshBackgroundImage);
            observer.observe(canvasx, {attributes: true, childList: true, subtree: true});
        }
        let canvasy = document.getElementById('id_unilabeltype_imageboard_canvasheight');
        if (canvasy) {
            let observer = new MutationObserver(refreshBackgroundImage);
            observer.observe(canvasy, {attributes: true, childList: true, subtree: true});
        }
    }

    /**
     * Sets the background image of the SVG to the current image in filemanager.
     */
    function refreshBackgroundImage() {
        // previewimage vom filemanager id_unilabeltype_imageboard_backgroundimage_fieldset erhalten
        let filemanagerbackgroundimagefieldset = document.getElementById('id_unilabeltype_imageboard_backgroundimage_fieldset');
        let previewimage = filemanagerbackgroundimagefieldset.getElementsByClassName('realpreview');
        let backgrounddiv = document.getElementById('unilabel-imageboard-background-area');
        if (previewimage.length > 0) {
            let backgroundurl = previewimage[0].getAttribute('src').split('?')[0];
            // If the uploaded file reuses the filename of a previously uploaded image, they differ
            // only in the oid. So one has to append the oid to the url.
            if (previewimage[0].getAttribute('src').split('?')[1].includes('&oid=')) {
                backgroundurl += '?oid=' + previewimage[0].getAttribute('src').split('&oid=')[1];
            }
            backgrounddiv.style.background = 'red'; // just to indicate changes during development.
            backgrounddiv.style.backgroundSize = 'cover';
            backgrounddiv.style.backgroundImage = "url('" + backgroundurl + "')";

            const canvaswidthinput = document.getElementById('id_unilabeltype_imageboard_canvaswidth');
            let canvaswidthselected = canvaswidthinput.selectedOptions;
            let canvaswidth = canvaswidthselected[0].value;
            backgrounddiv.style.width = canvaswidth + "px";

            const canvasheightinput = document.getElementById('id_unilabeltype_imageboard_canvasheight');
            let canvasheightselected = canvasheightinput.selectedOptions;
            let canvasheight = canvasheightselected[0].value;
            backgrounddiv.style.height = canvasheight + "px";
        } else {
            // Image might be deleted so update the backroundidv and remove backgroundimage in preview;
            // ToDo    if (previewimage.length > 0) does not recognize when an image is deleted so we need a different condition!
            backgrounddiv.style.background = 'green'; // just to indicate changes during development.
            backgrounddiv.style.backgroundImage = "url('')";
            const canvaswidthinput = document.getElementById('id_unilabeltype_imageboard_canvaswidth');
            let canvaswidthselected = canvaswidthinput.selectedOptions;
            let canvaswidth = canvaswidthselected[0].value;
            backgrounddiv.style.width = canvaswidth + "px";

            const canvasheightinput = document.getElementById('id_unilabeltype_imageboard_canvasheight');
            let canvasheightselected = canvasheightinput.selectedOptions;
            let canvasheight = canvasheightselected[0].value;
            backgrounddiv.style.height = canvasheight + "px";
        }
    }

    /**
     * Gets the number of ALL elements in the form and then adds a div for each element to the dom if not already exists.
     * We need a timeout
     */
    function refreshAllImages() {
        console.log("refreshAllImages");
        const singleElements = document.querySelectorAll('[id^="fitem_id_unilabeltype_imageboard_image_"]');
        for (let i = 0; i < singleElements.length; i++) {
            // Todo: Skip removed elements that are still in the dom but hidden.
            let singleElement = singleElements[i].getAttribute('id');
            let number = singleElement.split('fitem_id_unilabeltype_imageboard_image_')[1];
            // Check if there exists already a div for this image.
            const imageid = document.getElementById('unilabel-imageboard-imageid-' + number);
            if (imageid === null) {
                // Div does not exist so we need do add it do dom.
                addImageToDom(number);
                // ToDo: Do we need a timeout to wait until the dic was added so that refresh can work correctly?
                // see also refreshImage ... there is already a timeout
                console.log("214");

                setTimeout(function() {
                    console.log("verzögerter refresh");
                    refreshImage(number);
                }, 1000);
            } else {
                refreshImage(number);
            }
        }
    }

    /**
     *
     * @param {int} number
     */
    function addImageToDom(number) {
        console.log("addImageToDom" + number);
        //let backgroundArea = document.getElementById('unilabel-imageboard-background-area');
       // let container = document.getElementById('container');

        const imageid = document.getElementById('unilabel-imageboard-imageid-' + number);
        if (imageid === null) {
            console.log("imageid ist null");
            renderAddedImage(number);
            console.log("renderAddedImage fertig");
            //console.log('div fehlt noch im dom ' + imageid);
            // This div does not exist so we need do add it do dom.
            //renderFromTemplate(number);
 //backgroundArea.innerHTML = backgroundArea.innerHTML + renderFromTemplate(number);
            //container.innerHTML = container.innerHTML + renderFromTemplate(number);


            // add an obverser to be aple to update if imge is uloaded
            let imagefileNode = document.getElementById('fitem_id_unilabeltype_imageboard_image_' + (number));
            console.log("renderAddedImage fertig");
            if (imagefileNode) {
                let observer = new MutationObserver(refreshImage);
                observer.observe(imagefileNode, {attributes: true, childList: true, subtree: true});
            }
            console.log("before refreshImage number");
            ////refreshImage(number);
            console.log("after refreshImage number");
        } else {
            //console.log('div existiert ' + number);
            // Div already exists so we need only to refresh the image because we only uploaded a new image
            // to an already existing div.
            refreshImage(number);
        }
    }


    /**
     *
     * @param {number} number of
     */
    function renderAddedImage(number) {
        console.log("renderAddedImage number", renderAddedImage, number);
        const context = {
            // Data to be rendered
            number: number,
            title: "hurzenschnurz"
        };
        //let backgroundArea = document.getElementById('unilabel-imageboard-background-area');
        //backgroundArea.innerHTML = backgroundArea.innerHTML + renderFromTemplate(number);

        Templates.renderForPromise('unilabeltype_imageboard/previewelement', context).then(({html, js}) => {
            // We have to get the actual content, combine it with the rendered image and replace then the actual content.
            let imageboardcontainer = document.getElementById('imageboardcontainer').innerHTML;
            console.log("imagehtml", html);
            console.log('imageboardcontainer', imageboardcontainer);
            //let combiniert = containerinnerhtml + html + "x";
            let combiniert = "<div>" + imageboardcontainer + "</div>" + html;
            console.log("imagehtmlcombiniert", combiniert);
            Templates.replaceNodeContents('#imageboardcontainer', combiniert, js);
            console.log("replaceNodeContents fertig");
            //return null;
        }).catch(() => {
            // No tiny editor present
        });
    }




    /**
     * Renders the div for the image in preview.
     *
     * @param {int} number
     * @returns {string}
     */
 /*  function renderFromTemplate(number) {
        const imagedivashtml =
            "<div id='unilabel-imageboard-element-" + number + "' style='z-index: 5; position: absolute;'>" +
            "<div id='id_elementtitle-" + number + "' class='unilabel-imageboard-title' " +
            " style='position: relative; height: 50px;'>Überschrift" +
            "</div>" +
            "<div id='imageidimage-" + number + "'>" +
            "<img draggable='true' class='image' src='' id='unilabel-imageboard-imageid-" +
            number + "' style='position: relative; background-color: #f00;'>" +
            "</div>" +
            "</div>";
        return imagedivashtml;
    }
*/

    /**
     * If an image was uploaded or inputfields in the form changed then we need to refresh
     * this image.
     * @param {int} number
     */
    function refreshImage(number) {
        // When there was an upload, then the number is NOT a number.
        // ToDo: Do not yet know the best way how I will get the number in his case.
        // For now if it is a number the normal refresh can be used and only ONE image will be refreshed.
        // In the else code ther will be a refresh of ALL images until I can refactor this.
        if (!Array.isArray(number)) {
            let imageid = document.getElementById('unilabel-imageboard-imageid-' + number);
            // Werte für das image setzen
            let imagedata = getAllImagedataFromForm(number);
            imageid.style.background = imagedata['titlebackgroundcolor'];
            imageid.src = imagedata['src'];
            const imagediv = document.getElementById('unilabel-imageboard-element-' + number);
            imagediv.style.left = parseInt(imagedata['xposition']) + "px";
            imagediv.style.top = parseInt(imagedata['yposition']) + "px";

            // Breite und Höhe
            if (imagedata['targetwidth'] != 0) {
                imageid.style.width = imagedata['targetwidth'] + "px";
            } else {
                imageid.style.width = "auto";
            }
            if (imagedata['targetheight'] != 0) {
                imageid.style.height = imagedata['targetheight'] + "px";
            } else {
                imageid.style.height = "auto";
            }
            if (imagedata['title'] != "") {
                imageid.title = imagedata['title'];
            } else {
                imageid.title = '';
            }
            if (imagedata['border'] != 0) {
                imageid.style.border = imagedata['border'] + "px solid";
                imageid.style.borderColor = imagedata['titlebackgroundcolor'];
            } else {
                imageid.style.border = "0";
            }

            // ToDo: add title if not empty
            let title = imagedata['title'];
            const elementtitle = document.getElementById('id_elementtitle-' + number);
            elementtitle.innerHTML = title;
            elementtitle.style.color = imagedata['titlecolor'];
            elementtitle.style.backgroundColor = imagedata['titlebackgroundcolor'];
            elementtitle.style.fontSize = imagedata['fontsize'] + "px";
        } else {
            //console.log("number ist ein array" , number);
            //console.log("number[0] ist ein array" , number[0]);
            //console.log("number[0].attributeName ist ein array" , number[0].attributeName);
            //////console.log("number[0].target ist ein array", number[0].target);
            setTimeout(function() {
                refreshAllImages();
            }, 600);
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
};

(function () {

    // defaults
    var width = 600;
    var height = 300;
    var lineSpacing = 0.15; // matches TextRenderer value
    var outlineWidth = 4; // matches TextRenderer value

    // canvas and context
    var canvas2D = document.createElement("canvas");
    canvas2D.width = width;
    canvas2D.height = height;
    var ctx2D = canvas2D.getContext("2d");

    // test dependencies
    var sizes = [14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70];
    var text = "ypgj\u00C8";
    var color = new WorldWind.Color(0, 0, 1, 1);
    var cssColorString = color.toCssColorString();
    var clearCssColorString = new WorldWind.Color(0, 0, 0, 1).toCssColorString();

    var reset = function () {
        var previousStyle = ctx2D.fillStyle;
        ctx2D.fillStyle = clearCssColorString;
        ctx2D.fillRect(0, 0, width, height);
        ctx2D.fillStyle = previousStyle;
    };

    var compareCanvasToColor = function (i, j) {
        var colors = ctx2D.getImageData(i, j, 1, 1);
        // check for a match to our baseline color
        var canvasColor = WorldWind.Color.colorFromByteArray(colors.data);
        return canvasColor.equals(color);
    };

    var determineTopRow = function () {
        console.log("caclulating top row...");
        // work from the top down
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                if (compareCanvasToColor(i, j)) {
                    return j;
                }
            }
        }

        return -1;
    };

    var determineBottomRow = function () {
        console.log("caclulating bottom row...");
        // work from the bottom to the top
        for (var j = height - 1; j >=0; j--) {
            for (var i = 0; i < width; i++) {
                if (compareCanvasToColor(i, j)) {
                    return j;
                }
            }
        }

        return -1;
    };

    var generateImage = function () {
        // display in browser
        var img = document.createElement("img");
        img.src = canvas2D.toDataURL("image/jpg", 0.8);
        document.getElementById("stuff").appendChild(img);
        document.getElementById("stuff").appendChild(document.createElement("br"));
        document.getElementById("stuff").appendChild(document.createElement("hr"));
        document.getElementById("stuff").appendChild(document.createElement("br"));
    };

    var writeResults = function (baseline, fontSize, delta, topOffset) {
        var sp = document.createElement("span");
        sp.innerText = "textBaseline: " + baseline + ", Size: " + fontSize + ", Measured Size: " + delta + ", Offset From Top: " + topOffset;
        document.getElementById("stuff").appendChild(sp);
    };

    ctx2D.fillStyle = cssColorString;
    ctx2D.lineWidth = outlineWidth;
    reset();

    for (var i = 0; i < sizes.length; i++) {
        console.log("Testing size: " + sizes[i]);

        var font = new WorldWind.Font(sizes[i]);
        ctx2D.font = font.fontString;
        var test = {};
        
        ctx2D.textBaseline = "top";
        ctx2D.fillText(text, 0, 0);
        ctx2D.fillText(text, 0, sizes[i] * (1 + lineSpacing) + outlineWidth / 2);
        //test.topTop = determineTopRow();
        //test.topBottom = determineBottomRow();
        //writeResults("top", sizes[i], test.topBottom - test.topTop, test.topTop);
        //generateImage();
        //reset();

        var textWidth = ctx2D.measureText(text).width;
        ctx2D.textBaseline = "bottom";
        //ctx2D.fillText(text, 0, sizes[i]);
        ctx2D.fillText(text, 1.15 * textWidth, sizes[i] * (1 + lineSpacing) + outlineWidth / 2);
        ctx2D.fillText(text, 1.15 * textWidth, 2 * sizes[i] * (1 + lineSpacing) + outlineWidth / 2);
        //test.bottomTop = determineTopRow();
        //test.bottomBottom = determineBottomRow();
        //writeResults("bottom", sizes[i], test.bottomBottom - test.bottomTop, test.bottomTop);
        generateImage();
        reset();

        // record results for console display
        // var key = "size " + sizes[i];
        // results[key] = test;
    }

    // console.log(JSON.stringify(results));
})();

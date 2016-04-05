var frequencies = ["125", "250", "500", "1000", "2000", "4000"];
var surfaces = ["front_wall", "left_wall", "ceiling", "back_wall", "right_wall", "floor"];

var surfaceArea = {
    "front_wall": null,
    "back_wall": null,
    "floor": null,
    "ceiling": null,
    "left_wall": null,
    "right_wall": null,
    "total": null,
    "volume": null
};

var map = {
    "wood": {
        "125": 0.28,
        "250": 0.22,
        "500": 0.17,
        "1000": 0.09,
        "2000": 0.10,
        "4000": 0.11
    },
    "carpet": {
        "125": 0.08,
        "250": 0.24,
        "500": 0.57,
        "1000": 0.69,
        "2000": 0.71,
        "4000": 0.73
    },
    "brick": {
        "125": 0.03,
        "250": 0.03,
        "500": 0.03,
        "1000": 0.04,
        "2000": 0.05,
        "4000": 0.07
    },
    "concrete": {
        "125": 0.10,
        "250": 0.05,
        "500": 0.06,
        "1000": 0.07,
        "2000": 0.09,
        "4000": 0.08
    },
    "sheetrock": {
        "125": 0.29,
        "250": 0.10,
        "500": 0.05,
        "1000": 0.04,
        "2000": 0.07,
        "4000": 0.09
    },
    "water": {
        "125": 0.008,
        "250": 0.008,
        "500": 0.013,
        "1000": 0.015,
        "2000": 0.02,
        "4000": 0.025
    },
    "glass": {
        "125": 0.35,
        "250": 0.25,
        "500": 0.18,
        "1000": 0.12,
        "2000": 0.07,
        "4000": 0.04
    },
    "plaster": {
        "125": 0.013,
        "250": 0.015,
        "500": 0.02,
        "1000": 0.03,
        "2000": 0.04,
        "4000": 0.05
    },
    "marble": {
        "125": 0.01,
        "250": 0.01,
        "500": 0.01,
        "1000": 0.01,
        "2000": 0.02,
        "4000": 0.02
    },
    "fiberglass": {
        "125": 0.22,
        "250": 0.82,
        "500": 0.99,
        "1000": 0.99,
        "2000": 0.99,
        "4000": 0.99
    }
};

var frequencyTotals = {
    "125": 0,
    "250": 0,
    "500": 0,
    "1000": 0,
    "2000": 0
};


$('#calculate_surface_area').click(function () {
    // fetch the values for x, y, and z that the user entered
    var x = $('#length').val();
    var y = $('#height').val();
    var z = $('#width').val();

    // calculate the surface area
    surfaceArea.front_wall = x * y;
    surfaceArea.back_wall = x * y;
    surfaceArea.floor = x * z;
    surfaceArea.ceiling = x * z;
    surfaceArea.left_wall = y * z;
    surfaceArea.right_wall = y * z;
    surfaceArea.total = (surfaceArea.front_wall + surfaceArea.floor + surfaceArea.left_wall) * 2;
    surfaceArea.volume = (x * y * z);

    // assign the things we calculated above to DOM elements
    // so that the user can see the results
    $('#surface_area_total').text(surfaceArea.total);
    $('#surface_area_front').text(surfaceArea.front_wall);
    $('#surface_area_back').text(surfaceArea.back_wall);
    $('#surface_area_ceiling').text(surfaceArea.ceiling);
    $('#surface_area_floor').text(surfaceArea.floor);
    $('#surface_area_left').text(surfaceArea.left_wall);
    $('#surface_area_right').text(surfaceArea.right_wall);
    $('#volume').text(surfaceArea.volume);
});

$('#calculate_total_absorption').click(function () {
    for (var i = 0; i < surfaces.length; i++) { // for each surface
        var currentSurface = surfaces[i];
        var selectedMaterialID = '#' + currentSurface + '_material'; // "#left_wall_material"
        var selectedMaterial = $(selectedMaterialID).val(); // fetch the material for the current surface
        for (var j = 0; j < frequencies.length; j++) {
            var currentFrequency = frequencies[j];
            var materialFrequencyCoefficient = map[selectedMaterial][currentFrequency];
            var totalAbsorption = materialFrequencyCoefficient * surfaceArea[currentSurface];

            var id = '#' + currentSurface + '_' + currentFrequency;
            $(id).text(totalAbsorption);
        }
    }

    for (var i = 0; i < frequencies.length; i++) {
        var currentFrequency = frequencies[i];
        var totalByFrequency = 0;
        for (var j = 0; j < surfaces.length; j++) {
            var currentSurface = surfaces[j];
            var frequencyForSurfaceID = '#' + currentSurface + '_' + currentFrequency;
            var cell = $(frequencyForSurfaceID);

            totalByFrequency += parseFloat(cell.text());

            var totalId = '#' + currentFrequency + '_total';
            $(totalId).text(totalByFrequency);

            frequencyTotals[currentFrequency] = totalByFrequency;
        }
    }
});

$('#final_calculation').click(function () {
    var coeficient = 0.049;
    var volume = surfaceArea.volume;

    var total = 0;

    for (var i = 0; i < frequencies.length; i++) {
        var currentFrequency = frequencies[i];
        console.log('coeficient=', coeficient);
        console.log('volume=', volume);
        console.log('frequencyTotals[currentFrequency]=', frequencyTotals[currentFrequency]);
        var calc = (coeficient * volume) / frequencyTotals[currentFrequency];

        var currentFrequencyID = '#reverb_time_' + currentFrequency;
        $(currentFrequencyID).text(calc);

        total += calc;
    }

    // Reverb Time Average

    var average = total / frequencies.length;
    $('#rt_average').text(average);

    // Schroeder
    var schroeder = Math.pow((average / volume), 0.5);
    schroeder = schroeder * 2000;

    $('#schroeder_frequency').text(schroeder);

    // Mode Analysis
    for (var i = 0; i < 4; i++) {
        var constant = 1130;
        var length = $('#length').val();
        var result = constant / (2 * length);
        result = (i + 1) * result;

        var modeId = '#mode_' + (i + 1);
        $(modeId).text(result);
    }
});
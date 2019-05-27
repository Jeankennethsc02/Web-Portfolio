$('#toggle').click(function() {
  $(this).toggleClass('active');
  $('#overlay').toggleClass('open');
});
$('.overlay-menu a').click(function() {
  $('.button_container').toggleClass('active');
  $('#overlay').toggleClass('open');
  return false;
});

//BUTTON
$("a[href^='#']").click(function(e) {
      e.preventDefault();

      var position = $($(this).attr("href")).offset().top;

      $("body, html").animate({
        scrollTop: position
      }, 1200 );
    });
//END BUTTON
// HOME

// values to keep track of the number of letters typed, which quote to use. etc. Don't change these values.
var i = 0,
    a = 0,
    isBackspacing = false,
    isParagraph = false;

// Typerwrite text content. Use a pipe to indicate the start of the second line "|".  
var textArray = [
    "Full Stack Web Developer"
  // "Transforming codes into|efficient and elegant platforms",
  // "efficient and elegant platforms." 
  // "Building intuitive user experience", 
  // "through design."
  
];

// Speed (in milliseconds) of typing.
var speedForward = 90, //Typing Speed
    speedWait = 1000, // Wait between typing and backspacing
    speedBetweenLines = 1000, //Wait between first and second lines
    speedBackspace = 25; //Backspace Speed

//Run the loop
typeWriter("output", textArray);

function typeWriter(id, ar) {
  var element = $("#" + id),
      aString = ar[a],
      eHeader = element.children("h1"), //Header element
      eParagraph = element.children("p"); //Subheader element
  
  // Determine if animation should be typing or backspacing
  if (!isBackspacing) {
    
    // If full string hasn't yet been typed out, continue typing
    if (i < aString.length) {
      
      // If character about to be typed is a pipe, switch to second line and continue.
      if (aString.charAt(i) == "|") {
        isParagraph = true;
        eHeader.removeClass("cursor");
        eParagraph.addClass("cursor");
        i++;
        setTimeout(function(){ typeWriter(id, ar); }, speedBetweenLines);
        
      // If character isn't a pipe, continue typing.
      } else {
        // Type header or subheader depending on whether pipe has been detected
        if (!isParagraph) {
          eHeader.text(eHeader.text() + aString.charAt(i));
        } else {
          eParagraph.text(eParagraph.text() + aString.charAt(i));
        }
        i++;
        setTimeout(function(){ typeWriter(id, ar); }, speedForward);
      }
      
    // If full string has been typed, switch to backspace mode.
    } else if (i == aString.length) {
      
      isBackspacing = true;
      setTimeout(function(){ typeWriter(id, ar); }, speedWait);
      
    }
    
  // If backspacing is enabled
  } else {
    
    // If either the header or the paragraph still has text, continue backspacing
    if (eHeader.text().length > 0 || eParagraph.text().length > 0) {
      
      // If paragraph still has text, continue erasing, otherwise switch to the header.
      if (eParagraph.text().length > 0) {
        eParagraph.text(eParagraph.text().substring(0, eParagraph.text().length - 1));
      } else if (eHeader.text().length > 0) {
        eParagraph.removeClass("cursor");
        eHeader.addClass("cursor");
        eHeader.text(eHeader.text().substring(0, eHeader.text().length - 1));
      }
      setTimeout(function(){ typeWriter(id, ar); }, speedBackspace);
    
    // If neither head or paragraph still has text, switch to next quote in array and start typing.
    } else { 
      
      isBackspacing = false;
      i = 0;
      isParagraph = false;
      a = (a + 1) % ar.length; //Moves to next position in array, always looping back to 0
      setTimeout(function(){ typeWriter(id, ar); }, 50);
      
    }
  }
}





// HOME

//ABOUT ME


//END OF ABOUT ME





// SKILLS
// Wait for the DOM to load everything, just to be safe
$(document).ready(function() {
  // hide table if js enabled
  $('#data-table').addClass('js');

  // Create our graph from the data table and specify a container to put the graph in
  createGraph('#data-table', '.chart');
  
  // Here be graphs
  function createGraph(data, container) {
    // Declare some common variables and container elements 
    var bars = [];
    var figureContainer = $('<div id="figure"></div>');
    var graphContainer = $('<div class="graph"></div>');
    var barContainer = $('<div class="bars"></div>');
    var data = $(data);
    var container = $(container);
    var chartData;    
    var chartYMax;
    var columnGroups;
    
    // Timer variables
    var barTimer;
    var graphTimer;
    
    // Create table data object
    var tableData = {
      // Get numerical data from table cells
      chartData: function() {
        var chartData = [];
        data.find('tbody td').each(function() {
          chartData.push($(this).text());
        });
        return chartData;
      },
      // Get heading data from table caption
      chartHeading: function() {
        var chartHeading = data.find('caption').text();
        return chartHeading;
      },
      // Get legend data from table body
      chartLegend: function() {
        var chartLegend = [];
        // Find th elements in table body - that will tell us what items go in the main legend
        data.find('tbody th').each(function() {
          chartLegend.push($(this).text());
        });
        return chartLegend;
      },
      // Get highest value for y-axis scale
      chartYMax: function() {
        var chartData = this.chartData();
        // Round off the value
        var chartYMax = Math.ceil(Math.max.apply(Math, chartData) / 100) * 100;
        return chartYMax;
      },
      // Get y-axis data from table cells
      yLegend: function() {
        var chartYMax = this.chartYMax();
        var yLegend = [];
        // Number of divisions on the y-axis
        var yAxisMarkings = 5;            
        // Add required number of y-axis markings in order from 0 - max
        for (var i = 0; i < yAxisMarkings; i++) {
          yLegend.unshift(((chartYMax * i) / (yAxisMarkings - 1)));
        }
        return yLegend;
      },
      // Get x-axis data from table header
      xLegend: function() {
        var xLegend = [];
        // Find th elements in table header - that will tell us what items go in the x-axis legend
        data.find('thead th').each(function() {
          xLegend.push($(this).text());
        });
        return xLegend;
      },
      // Sort data into groups based on number of columns
      columnGroups: function() {
        var columnGroups = [];
        // Get number of columns from first row of table body
        var columns = data.find('tbody tr:eq(0) td').length;
        for (var i = 0; i < columns; i++) {
          columnGroups[i] = [];
          data.find('tbody tr').each(function() {
            columnGroups[i].push($(this).find('td').eq(i).text());
          });
        }
        return columnGroups;
      }
    }
    
    // Useful variables for accessing table data    
    chartData = tableData.chartData();    
    chartYMax = tableData.chartYMax();
    columnGroups = tableData.columnGroups();
    
    // Construct the graph
    
    // Loop through column groups, adding bars as we go
    $.each(columnGroups, function(i) {
      // Create bar group container
      var barGroup = $('<div class="bar-group"></div>');
      // Add bars inside each column
      for (var j = 0, k = columnGroups[i].length; j < k; j++) {
        // Create bar object to store properties (label, height, code etc.) and add it to array
        // Set the height later in displayGraph() to allow for left-to-right sequential display
        var barObj = {};
        barObj.label = this[j];
        barObj.height = Math.floor(barObj.label / chartYMax * 100) + '%';
        barObj.bar = $('<div class="bar fig' + j + '"><span>' + barObj.label + '%</span></div>')
          .appendTo(barGroup);
        bars.push(barObj);
      }
      // Add bar groups to graph
      barGroup.appendTo(barContainer);      
    });
    
    // Add heading to graph
    var chartHeading = tableData.chartHeading();
    var heading = $('<h4>' + chartHeading + '</h4>');
    heading.appendTo(figureContainer);
    
    // Add legend to graph
    var chartLegend = tableData.chartLegend();
    var legendList  = $('<ul class="legend"></ul>');
    $.each(chartLegend, function(i) {     
      var listItem = $('<li><span class="icon fig' + i + '"></span>' + this + '</li>')
        .appendTo(legendList);
    });
    legendList.appendTo(figureContainer);
    
    // Add x-axis to graph
    var xLegend = tableData.xLegend();    
    var xAxisList = $('<ul class="x-axis"></ul>');
    $.each(xLegend, function(i) {     
      var listItem = $('<li><span>' + this + '</span></li>')
        .appendTo(xAxisList);
    });
    xAxisList.appendTo(graphContainer);
    
    // Add y-axis to graph  
    var yLegend = tableData.yLegend();
    var yAxisList = $('<ul class="y-axis"></ul>');
    $.each(yLegend, function(i) {     
      var listItem = $('<li><span>' + this + '%</span></li>')
        .appendTo(yAxisList);
    });
    yAxisList.appendTo(graphContainer);   
    
    // Add bars to graph
    barContainer.appendTo(graphContainer);    
    
    // Add graph to graph container   
    graphContainer.appendTo(figureContainer);
    
    // Add graph container to main container
    figureContainer.appendTo(container);
    
    // Set individual height of bars
    function displayGraph(bars, i) {    
      // Changed the way we loop because of issues with $.each not resetting properly
      if (i < bars.length) {
        // Animate height using jQuery animate() function
        $(bars[i].bar).animate({
          height: bars[i].height
        }, 800);
        // Wait the specified time then run the displayGraph() function again for the next bar
        barTimer = setTimeout(function() {
          i++;        
          displayGraph(bars, i);
        }, 100);
      }
    }
    
    // Reset graph settings and prepare for display
    function resetGraph() {
      // Stop all animations and set bar height to 0
      $.each(bars, function(i) {
        $(bars[i].bar).stop().css('height', 0);
      });
      
      // Clear timers
      clearTimeout(barTimer);
      clearTimeout(graphTimer);
      
      // Restart timer    
      graphTimer = setTimeout(function() {    
        displayGraph(bars, 0);
      }, 200);
    }
    
    // Helper functions
    
    // Call resetGraph() when button is clicked to start graph over
    $('#reset-graph-button').click(function() {
      resetGraph();
      return false;
    });
    
    // Finally, display graph via reset function
    resetGraph();
  } 
});

   


// END OF SKILLS


//BUTTON

//END BUTTON
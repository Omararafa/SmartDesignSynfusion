// Rev. 24-Oct-2021 - dom
// Render a cyclic object as a flat structure so it can be stringified.
function decycle(obj, stack = []) {
    if (!obj || typeof obj !== 'object')
        return obj;
    
    if (stack.includes(obj))
        return null;

    let s = stack.concat([obj]);

    return Array.isArray(obj)
        ? obj.map(x => decycle(x, s))
        : Object.fromEntries(
            Object.entries(obj)
                .map(([k, v]) => [k, decycle(v, s)]));
}

//Change Row Color When Selected
var SelectClick = false;
var onClick = function (args) {
    SelectClick = true;
    var Rows = grid.getRows(); //Get all rows
    var rowObj = grid.getRowObjectFromUID(ej.base.closest(args.target, '.e-row').getAttribute('data-uid')); // get selected row index
    var test = (Rows[rowObj.index].cells[1]);
    var CellButton = Rows[rowObj.index].cells[1].children[0].childNodes[0].innerText; //get cell inner text to know if it's selected or not
    
    if (CellButton == "+") { // if not selected then the button text will be changed to - and color will be changed
        Rows[rowObj.index].cells[1].children[0].childNodes[0].innerText = "-";
        var NewBackgroundColor = (Rows[rowObj.index].cells[1].parentElement).style.backgroundColor = '#c1e4a5'; //color the selected row
    }
    else { // if selected then the button text will be changed to + and color will be remain white
        Rows[rowObj.index].cells[1].children[0].childNodes[0].innerText = "+";
        var Cells = Rows[rowObj.index].cells;
        for (let i = 0; i < Cells.length; i++) {
            Rows[rowObj.index].cells[i].style.backgroundColor = '';
        }
        if (rowObj.index % 2 == 0) {            

            (Rows[rowObj.index].cells[1].parentElement).style.backgroundColor = '#FFFFFF';
            Rows[rowObj.index].cells[1].style.backgroundColor = '';
        }
        else {
            (Rows[rowObj.index].cells[1].parentElement).style.backgroundColor = '#d8dde6';
            Rows[rowObj.index].cells[1].style.backgroundColor = '';
        }
        
    }
	//Update number of selected items
    var SelectedRows = GetSelectedItems();
    var element = document.getElementById('NumberOfSelectedItems');
    element.innerText = "Number Of Selected Items = " + String(SelectedRows.length);
}

// This function handles sending an event to FileMaker
var commandClick = function(args){
	var dv = {action: "command", records: args.rowData, command: args.commandColumn.buttonOption.content};
	if(SelectClick==false){
		FileMaker.PerformScriptWithOption("ILV Interface", JSON.stringify(dv), "0");
	}
	else{
		SelectClick = false;
	}

}

// This function is called by FileMaker to request or alter data in the grid
function dsGetSelection(f,ctx,p3,p4,p5) {
	var y = [];
	function getothers(item,index) {  // build a new array with the attributes that we need
		y[index]={};
		y[index].headerText = item.headerText;
		y[index].template = item.template;
	}
	if (f == 'getselection') {
		var dv = {action: "selection", context: ctx, records: grid.getSelectedRecords()};
    	FileMaker.PerformScriptWithOption("ILV Interface", JSON.stringify(dv), "0");
	} else if (f == 'getconfig') {
		// The stringify fails to return some attributes.  This call will populate the object 'y' with them to pass back to FileMaker
		grid.properties.columns.forEach(getothers);
		var dv = {action: "config", context: ctx, columns: grid.properties.columns, ht: y};
		FileMaker.PerformScriptWithOption("ILV Interface", JSON.stringify(dv), "0");
	} else if (f == 'putconfig') {
		grid.properties.columns = JSON.parse(p3);
		grid.refreshColumns();
	}
}

// Get Selected Items By Row Color 
    function GetSelectedItems(){
      var Rows = grid.getRows();
      var SelectedRows = [];
      for (let i = 0; i < Rows.length; i++) {
          var RowCellParentStyle = (Rows[i].cells[1].parentElement).style;
          var RowColor = (Rows[i].cells[1].parentElement).style.backgroundColor;
          if (RowColor == "rgb(193, 228, 165)") {
              SelectedRows.push(Rows[i]);
          }

      }
		return SelectedRows;
    }

// Sort item number by numbers
function sortComparer(reference, comparer, referenceObj, comparerObj) {
	/*  var refC = parseInt(reference.replace(" Days Ago", ""));
        var comC = parseInt(comparer.replace(" Days Ago", ""))*/
//	if(parseFloat(reference)){
//		if(parseFloat(comparer)){
//			if (parseFloat(reference) > parseFloat(comparer)) {
//				return -1;
//			}
//			if (parseFloat(reference) < parseFloat(comparer)) {
//				return 1;
//			}
//		}
//		else{
//			return 1;
//		}
//	}
//	else{
//		return -1;
//	}
//else {
//		return 0;
//	}
	if(referenceObj.ItemNumberSort > comparerObj.ItemNumberSort) {
		return -1;
	} else if (referenceObj.ItemNumberSort < comparerObj.ItemNumberSort) {
		return 1;
	} else {
		return 0;
	}
}
//Selection Event
function rowSelected(args) {
    if (SelectClick == false) {
        var Rows = grid.getRows(); //get all rows
        //let Object = grid.getSelectedRecords();
        let number = grid.getSelectedRowIndexes();  // get the selected row indexes.
        var SelectedRow = Rows[number]; // get selected row
        var RowBackgroundColor = (SelectedRow.cells[1].parentElement).style.backgroundColor; //get selected row background
        //keep the cell green if it is selected
        if (RowBackgroundColor == "rgb(193, 228, 165)") {
            var Cells = SelectedRow.cells;
            //Return the row background without color
            for (let i = 0; i < Cells.length; i++) {
                SelectedRow.cells[i].style.backgroundColor = '';
            }
            var CellButtonValue = SelectedRow.cells[1].children[0].childNodes[0].innerText;
            (SelectedRow.cells[1]).style.backgroundColor = '#c1e4a5'; //keep the button cell green
        }
    }
    else {
        var Rows = grid.getRows(); //get all rows
        //let Object = grid.getSelectedRecords();
        let number = grid.getSelectedRowIndexes();  // get the selected row indexes.
        var SelectedRow = Rows[number]; // get selected row
        var RowBackgroundColor = (SelectedRow.cells[1].parentElement).style.backgroundColor; //get selected row background
        //keep the cell green if it is selected
        if (RowBackgroundColor == "rgb(193, 228, 165)") {
            var CellButtonValue = SelectedRow.cells[1].children[0].childNodes[0].innerText;
            var Cells = SelectedRow.cells;
            //make sure that the selected row is green
            for (let i = 0; i < Cells.length; i++) {
                SelectedRow.cells[i].style.backgroundColor = '#c1e4a5';
            }
        }

    }

}

	var grid = new ej.grids.Grid({
        dataSource: window.getData,
        allowSelection: true,
        allowFiltering: true,
        allowSorting: true,
		allowResizing: true,
		allowReordering: true,
		rowSelecting: selectingEvent,
        enableVirtualization: false,
		enableInfiniteScrolling: true,
		showColumnChooser: true,
		toolbar: [{ text: "Number Of Selected Items = 0", id: 'NumberOfSelectedItems' }, 'ColumnChooser'],
		gridLines: 'Both',
        selectionSettings: { type: "Multiple"},
        enableHover: false,
        enableHeaderFocus: true,
        height: 800,
        rowHeight: 20,
		allowGrouping: true,
        groupSettings: { columns: ['Area'] },
		commandClick:commandClick,
        columns: [
						{ headerText: '', width: 65, showInColumnChooser: false, commands: [
				{ buttonOption: { content: '✎', cssClass: 'e-flat' } },
//				{ type: ej.grids.Grid.UnboundType,  buttonOption: { contentType: "imageonly", prefixIcon:"e-icon e-edit" } }
			]},
			{ headerText: ' ', width: 45,  textAlign: 'Center', commands: [{ buttonOption: { content: '+', click: onClick } }] },
            { field: 'RecordID', visible: false, showInColumnChooser: false, headerText: 'Record ID', isPrimaryKey: true, width: '130' },
        	{ field: 'image', visible: false, template: '<div class="image"> <img src="${image}" alt="" /></div>', headerText: "Image", width: 130 },
			{
                field: 'ItemNumber',sortComparer: sortComparer, headerText: 'Item #', width: '120', clipMode: 'EllipsisWithTooltip',
                filter: { type: 'CheckBox' }
            },
            { field: 'ItemName', headerText: 'Item Name', width: '170', filter: { type: 'CheckBox' }, clipMode: 'EllipsisWithTooltip' },
            { field: 'EstimatedQuantity', headerText: 'Qty', width: '80', filter: { type: 'Menu' } },
			{ field: 'UOM', headerText: 'UOM', filter: { type: 'CheckBox', itemTemplate: '#StatusItemTemp' }, width: '90'},
            { field: 'Vendor', headerText: 'Vendor', filter: { type: 'CheckBox', itemTemplate: '#StatusItemTemp' }, width: '200'},
            { field: 'Area', headerText: 'Area', filter: { type: 'CheckBox', itemTemplate: '${ trustTemp(data)}' }, width: '200'},
            { field: 'Type', headerText: 'Type', width: '170', filter: { type: 'CheckBox' }, clipMode: 'EllipsisWithTooltip' },
            { field: 'Category', headerText: 'Category', width: '170', filter: { type: 'CheckBox' }, clipMode: 'EllipsisWithTooltip' },
            { field: 'EstimatedUnitCost', headerText: 'Unit Cost', format: "C2", filter: { type: 'Menu' }, textAlign: 'Right', width: '160' },
            { field: 'EstimatedUnitCostExtended', headerText: 'Ext Cost', format: "C2", filter: { type: 'Menu' }, textAlign: 'Right', width: '160' },
			{ field: 'Excluded', headerText: 'Exc.', width: '65',  type: 'boolean', displayAsCheckBox: true },
			
            { field: 'InvoiceNumber', visible: false, headerText: 'Invoice', width: '100',  clipMode: 'EllipsisWithTooltip' },
            { field: 'PONumber', visible: false, headerText: 'PO', width: '100', clipMode: 'EllipsisWithTooltip' },
            { field: 'PickListNumber', visible: false, headerText: 'Pick List', width: '100', clipMode: 'EllipsisWithTooltip' },
        ],
        queryCellInfo: queryCellInfo,
        dataBound: startTimer,
        actionComplete: complete,
		rowSelected: rowSelected
    });
    var dReady = false;
    var dtTime = false;
    var isDataBound = false;
    var isDataChanged = true;
    var intervalFun;
    var clrIntervalFun;
    var clrIntervalFun1;
    var clrIntervalFun2;
    var ddObj;
    var dropSlectedIndex = null;
    var stTime;
    stTime = performance.now();
    grid.appendTo('#Grid');
    grid.on('data-ready', function () {
        dReady = true;
    });
    var listObj = new ej.dropdowns.DropDownList({
        index: 0,
        placeholder: 'Select a Data Range',
        popupHeight: '240px',
        width: '220px',
        change: function () { valueChange(); }
    });
    listObj.appendTo('#ddl');

// This needs to test whether the selection was from a command column, and, if so, cancel it.
	function selectingEvent(e) { 
        if (0) {
            e.cancel = true;
        }
    }


    function complete(args) {
        if (args.requestType === "filterchoicerequest") {
            if (args.filterModel.options.field === "Trustworthiness" || args.filterModel.options.field === "Rating" || args.filterModel.options.field === "Status") {
                var span = args.filterModel.dialogObj.element.querySelectorAll('.e-selectall')[0];
                if(!ej.base.isNullOrUndefined(span)) {
                    ej.base.closest(span, '.e-ftrchk').classList.add("e-hide");
                }
            }
        }
    }
    window.trustTemp = function (e) {
        if (e.Trustworthiness === "Select All") {
            return '';
        }
        return '<img style="width: 31px; height: 24px" src="//ej2.syncfusion.com/javascript/demos/src/grid/images/' + e.Trustworthiness + '.png" /> <span id="Trusttext">' + e.Trustworthiness + '</span>';
    };
    window.ratingDetail = function (e) {
        var grid = document.querySelector(".e-grid").ej2_instances[0];
        var div = document.createElement('div');
        div.className = 'rating';
        var span;
        if (e.Rating === "Select All") {
            return '';
        }
        for (var i = 0; i < 5; i++) {
            if (i < e.Rating) {
                span = document.createElement('span');
                span.className = 'star checked';
                div.appendChild(span);
            } else {
                span = document.createElement('span');
                span.className = 'star';
                div.appendChild(span);
            }
        }
        return div.outerHTML;
    };
    window.statusDetail = function (e) {
        var grid = document.querySelector(".e-grid").ej2_instances[0];
        var div = document.createElement('div');
        var span;
        if (e.Status === "Select All") {
            return 'Select All';
        }
        span = document.createElement('span');
        if (e.Status === "Active") {
            span.className = 'statustxt e-activecolor';
            span.textContent = "Active";
            div.className = 'statustemp e-activecolor';
        }
        if (e.Status === "Inactive") {
            span = document.createElement('span');
            span.className = 'statustxt e-inactivecolor';
            span.textContent = "Inactive";
            div.className = 'statustemp e-inactivecolor';
        }
        div.appendChild(span);
        return div.outerHTML;
    };
    function queryCellInfo(args) {
        if (args.column.field === 'Employees') {
            if (args.data.EmployeeImg === 'usermale') {
                args.cell.querySelector('.e-userimg').classList.add("sf-icon-Male");
            } else {
                args.cell.querySelector('.e-userimg').classList.add("sf-icon-FeMale");
            }
        }
        if (args.column.field === 'Status') {
            if (args.cell.textContent === "Active") {
                args.cell.querySelector(".statustxt").classList.add("e-activecolor");
                args.cell.querySelector(".statustemp").classList.add("e-activecolor");
            }
            if (args.cell.textContent === "Inactive") {
                args.cell.querySelector(".statustxt").classList.add("e-inactivecolor");
                args.cell.querySelector(".statustemp").classList.add("e-inactivecolor");
            }
        }
        if (args.column.field === 'Rating') {
            if (args.column.field === 'Rating') {
                for (var i = 0; i < args.data.Rating; i++) {
                    args.cell.querySelectorAll("span")[i].classList.add("checked");
                }
            }
        }
        if (args.column.field === "Software") {
            if (args.data.Software <= 20) {
                args.data.Software = args.data.Software + 30;
            }
            args.cell.querySelector(".bar").style.width = args.data.Software + "%";
            args.cell.querySelector(".barlabel").textContent = args.data.Software + "%";           
            if (args.data.Status === "Inactive") {
                args.cell.querySelector(".bar").classList.add("progressdisable");
            }
        }
    }
    function startTimer(args) {
        clearTimeout(clrIntervalFun);
        clearInterval(intervalFun);
        dtTime = true;
    }
    function valueChange() {
        listObj.closePopup();
        grid.showSpinner();
        dropSlectedIndex = null;
        var index = listObj.value;
        clearTimeout(clrIntervalFun2);
        clrIntervalFun2 = setTimeout(function () {
            isDataChanged = true;
            stTime = null;
            var contentElement = grid.contentModule.getPanel().firstChild;
            contentElement.scrollLeft = 0;
            contentElement.scrollTop = 0;
            grid.pageSettings.currentPage = 1;
            stTime = performance.now();
            grid.dataSource = getTradeData(index);
            grid.hideSpinner();
        }, 100);
    }

    document.getElementById('Grid').addEventListener('DOMSubtreeModified', function () {
        if (dReady && stTime && isDataChanged) {
            var msgEle = document.getElementById('msg');          
            var val = (performance.now() - stTime).toFixed(0);
            stTime = null;
            dtTime = false;
            dReady = false;
            isDataChanged = false;
            msgEle.innerHTML = 'Load Time: ' + "<b>" + val + "</b>" + '<b>ms</b>';
            msgEle.classList.remove('e-hide');
        }
    });

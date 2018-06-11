# Table Layout

The table layout needs to be defined and passed to ng-simple-table. The table layout object should be bound to the *settings* variable. Some of the options are required and some are optional.
<br /><br />
## Table Layout Options
<br />
### Table Level Settings

#### displayHeaders (*boolean*)
---
*Optional* &rarr; Should the column headers be displayed or not<br />
*Default value* &rarr; true

#### tableClass (*string*)
---
*Optional* &rarr; The class on the resulting table.<br />
*Default value* &rarr; "*ng-simple-table*".

#### filterRow (*boolean*)
---
*Optional* &rarr; Should a row with filter textboxes be displayed immediately following the column header row<br />
*Default value* &rarr; true

#### bottomEditAllRow (*boolean*)
---
*Optional* &rarr; Adds a row to the bottom. Any editable column will have an editable field in the bottom row where. A change to the "All" row will change all rows in the column changed.<br />
*Default value* &rarr; false

#### changeTextDelay (*number*)
---
*Optional* &rarr; The amount of time in milliseconds the user has to have paused typing in an editable string column before a change event is triggered.<br />
*Default value* &rarr; 0

#### changeAllTextDelay (*number*)
---
*Optional* &rarr; The amount of time in milliseconds the user has to have paused typing in an editable string column in the all row before a change event is triggered.<br />
*Default value* &rarr; 0

#### emitDataChanges (*boolean*)
---
*Optional* &rarr; If data changes should be emitted through DataChangeRequest objects.<br />
*Default value* &rarr; false

### columns (&lt;array of&gt;)
---
*Required* &rarr; if no columns exist then nothing gets displayed<br />
This should be an array of all of the columns that will be displayed in the data table.<br />
See below for column definitions...
<br />
<br />
### Column Definition
Column definitions are listed in an array called *columns*. Each column has a few possible settings:

---
### name (*string*)
  + **required**
  + *name* is added to the class of the table cell for the appropriate column of each row.
  + *name* is used in the data structure to identify the appropriate column for the data.
  + An internal column identifier. It can be generic, but it is returned as part of the DataChangeRequest when change events are triggered.

---
### display (*string*)
  + **optional** &rarr; defaults to *blank string* ('')
  + This string is displayed as the text for the column header

---
### type (*string*)
  + **optional** &rarr; defaults to *string*
  + The valid values for this are
    + *string* &rarr; values in the data are treated and dipslayed as simple strings
    + *checkbox* &rarr; a checkbox is displayed for the data cells
    + *dropdown* &rarr; a dropdown is displayed for the data cells
    + *html* &rarr; the data passed in is displayed as HTML
      + *html* types are ***not*** editable

---
### edit (*boolean*)
  + **optional** &rarr; defaults to *false*
  + Should the user be able to change the values in the column
  + If *emitDataChanges* is *true* then the changed values are emitted back through the *dataChange* EventEmitter
  + Edit ***is not*** considered for *html* types &rarr; *html* types are only displayed as HTML

---
### visible (*boolean*)
  + **optional** &rarr; defaults to *true*
  + Should the column be displayed in the table &rarr; If this is set to false, the column isn't put in the DOM at all, it only exists on the input

---
### order (*number*)
  + ***NOT IMPLEMENTED***
  + *Currently columns are displayed in the order they are passed in the table format*  
  + Would allow order of columns to be defined by a number ordering<br />

---
### soratble (*boolean*)
  + **optional** &rarr; defaults to *true*
  + Should the column be able to be sorted by clicking on the column header

---
### dropdownOptions (class *Dropdown*)
  + **required** but ***ONLY used for dropdown type***

#### Dropdown option structure
  + default (*string*)
    + **optional** &rarr; defaults to "*Select an option*"
  + options &lt;array of &gt;
    + display (*string*) &rarr; string to display in dropdown list
    + value (*string*) &rarr; dropdown HTML value
      + value on HTML *option* tag under HTML *select* tag
#### Example dropdownOptions JSON
```JSON
"dropdownOptions": {
  "default": "Select 1 of 2 Options",
  "options": [{
    "display": "Option 1",
    "value": "opt-1",
  }, {
    "display": "Option 2",
    "value": "opt-2"
  }]
}
```

---
### maxWidth (*number*)
+ **optional**
  + On *html* types ***ONLY*** the default is set to 200 because no maxWidth setting causes HTML to overrun the table
+ Sets the maximum width of a column in pixels
  + This does not set the column to a specific width, only that it won't be longer than the specified number of pixels. If the data fits in a shorter area it is likely that the column will simply fit the data.

This is a FAST script that will process a CSV or TSV file and filter its contents based on a specified word.
It does this in the browser's JavaScript engine, without using any external libraries or servers.
It is faster than processing the file server-side and provides a more responsive user experience.
This script uses the FileReader API to read the contents of the file.
Recommend using Notepad++ to open the CSV or TSV file you want to process, as it is more efficient for large files.

Here's how to use this script:

Include this JavaScript in your HTML file or link it as an external script.
The script will add the following elements to your page:

-File input
-File type selector (CSV or TSV)
-Filter type selector (Include or Exclude)
-Filter word input
-Process button

To process a file:

-Select the file using the file input
-Choose the file type (CSV or TSV)
-Select whether to include or exclude lines with the filter word
-Enter the filter word (e.g., "Episode")
-Click the "Process File" button

The script will process the file according to your selections and prompt you to save the result.
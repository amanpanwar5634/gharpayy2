<!DOCTYPE html>
<html>
<head>
  <title>Display all records from Database</title>
</head>
<body>

<h2>Details</h2>

<table id="table-data" border="2">
  <tr>
    <td>Sr.No.</td>
    <td>Full Name</td>
    <td>Mail Id</td>
    <td>Phone Number</td>
    <td>Message</td>
    <td>Time</td>
  </tr>

<?php

include "./dbDetails.php"; // Using database connection file here
$records = mysqli_query($conn,"select * from queries"); // fetch data from database

while($data = mysqli_fetch_array($records))
{
?>
  <tr>
    <td><?php echo $data['id']; ?></td>
    <td><?php echo $data['name']; ?></td>
    <td><?php echo $data['email']; ?></td>
    <td><?php echo $data['phone']; ?></td>
    <td><?php echo $data['message']; ?></td>
    <td><?php echo $data['Time']; ?></td>
  </tr>	
<?php
}
?>
</table>
<?php mysqli_close($conn); // Close connection ?>

<script>
    function exportTableToExcel(tableID, filename = `data-${new Date().toLocaleDateString()}`){
                var downloadLink;
                var dataType = 'application/vnd.ms-excel';
                var tableSelect = document.getElementById(tableID);
                var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
                
                // Specify file name
                filename = filename?filename+'.xls':'excel_data.xls';
                
                // Create download link element
                downloadLink = document.createElement("a");
                
                document.body.appendChild(downloadLink);
                
                if(navigator.msSaveOrOpenBlob){
                    var blob = new Blob(['\ufeff', tableHTML], {
                        type: dataType
                    });
                    navigator.msSaveOrOpenBlob( blob, filename);
                }else{
                    // Create a link to the file
                    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
                
                    // Setting the file name
                    downloadLink.download = filename;
                    
                    //triggering the function
                    downloadLink.click();
                }
            }
</script>

    <button value="export" onclick="exportTableToExcel('table-data')" name="export">Export</button>


</body>
</html>
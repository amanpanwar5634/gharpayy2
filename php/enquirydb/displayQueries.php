<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Enquiries</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body>

<div class="container mt-5">
    <h2 class="text-center mb-4">All Enquiries</h2>
    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>Sr.No.</th>
                <th>Region</th>
                <th>Full Name</th>
                <th>Mail Id</th>
                <th>Phone Number</th>
                <th>Message</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            <?php
            include "./dbDetails.php"; // Include database connection

            $records = mysqli_query($conn, "SELECT * FROM queries"); // Fetch data from database

            while ($data = mysqli_fetch_array($records)) {
                echo "<tr>
                    <td>{$data['id']}</td>
                    <td>{$data['region']}</td>
                    <td>{$data['name']}</td>
                    <td>{$data['email']}</td>
                    <td>{$data['phone']}</td>
                    <td>{$data['message']}</td>
                    <td>{$data['Time']}</td>
                </tr>";
            }
            mysqli_close($conn); // Close connection
            ?>
        </tbody>
    </table>

    <button class="btn btn-success" onclick="exportTableToExcel('table-data')">Export to Excel</button>
</div>

<script>
    function exportTableToExcel(tableID, filename = `data-${new Date().toLocaleDateString()}`) {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.querySelector("table");
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        filename = filename ? filename + '.xls' : 'excel_data.xls';

        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
            downloadLink.download = filename;
            downloadLink.click();
        }
    }
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

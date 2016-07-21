<?php
require_once('../include_master.php');

$ds_sql = "
    SELECT
        ht.cd_tag,
        ht.ds_tag
    FROM
        htry_tag ht
    ORDER BY
        ht.ds_tag ASC;
";

$ptrResult = query($ds_sql);

while ($arrResultado = mysqli_fetch_array($ptrResult)) {
    $arrTag[] = array(
        'cd_tag' => $arrResultado['cd_tag'],
        'ds_tag' => $arrResultado['ds_tag']
    );
}

if ($arrTag != null) {
    echo json_encode(utf8_encode_all($arrTag));
    die();
}

echo "[]";
?>
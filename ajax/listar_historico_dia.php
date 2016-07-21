<?php
require_once('../include_master.php');

$ds_sql = "
    SELECT
        cd_log,
        me_descricao,
        DATE_FORMAT(dt_cadastro, '%d/%m/%Y %h:%i:%s') as dt_cadastro
    FROM
        htry_log
    WHERE
        dt_cadastro >= DATE_ADD(now(), INTERVAL -1 DAY)
    ORDER BY
        cd_log desc limit 50
";

$ptrResult = query($ds_sql);

while ($arrResultado = mysqli_fetch_array($ptrResult)) {
    $arrLog[] = array(
        'cd_log' => $arrResultado['cd_log'],
        'me_descricao' => $arrResultado['me_descricao'],
        'dt_cadastro' => $arrResultado['dt_cadastro']
    );
}

if ($arrLog != null) {
    echo json_encode(utf8_encode_all($arrLog));
    die();
}

echo "[]";
?>
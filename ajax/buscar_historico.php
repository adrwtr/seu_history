<?php
require_once('../include_master.php');

/**
 * forma de receber os dados com angular
 */
$ds_post    = file_get_contents("php://input");
$objRequest = json_decode($ds_post);

$arrTags = $objRequest->arrTags;

$ds_valores = '';

if (is_array($arrTags)) {
    $ds_valores = utf8_decode(
        implode($arrTags, ",")
    );
}

$ds_dt_inicial = date("Y-m-d", mktime(0,0,0, date("m"), date("d")-15, date("Y")));
$ds_dt_final = date("Y-m-d", mktime(0,0,0, date("m"), date("d"), date("Y")));


if ($objRequest->dt_inicial != '') {
    $ds_dt_inicial = date("Y-m-d", strtotime($objRequest->dt_inicial));
}

if ($objRequest->dt_final != '') {
    $ds_dt_final = date("Y-m-d", strtotime($objRequest->dt_final));
}


$ds_sql = "
    SELECT
        distinct log.cd_log,
        log.me_descricao,
        DATE_FORMAT(log.dt_cadastro, '%d/%m/%Y %h:%i:%s') as dt_cadastro
    FROM
        htry_log log

        LEFT JOIN htry_log_tag as lt ON (
            lt.cd_log = log.cd_log
        )

        LEFT JOIN htry_tag as tag ON (
            tag.cd_tag = lt.cd_tag
        )

    WHERE
        dt_cadastro >= '$ds_dt_inicial' and dt_cadastro <= '$ds_dt_final' "
    . ( $ds_valores != '' ? " and FIND_IN_SET(tag.ds_tag , '$ds_valores')" : '')
    . " ORDER BY
        cd_log desc limit 50
";

$ptrResult = query($ds_sql);


while ($arrResultado = mysqli_fetch_array($ptrResult)) {
    $arrHistorico[] = array(
        'cd_log' => $arrResultado['cd_log'],
        'me_descricao' => $arrResultado['me_descricao'],
        'dt_cadastro' => $arrResultado['dt_cadastro']
    );
}

if ($arrHistorico != null) {
    echo json_encode(utf8_encode_all($arrHistorico));
    die();
}


echo "[]";
die();
?>


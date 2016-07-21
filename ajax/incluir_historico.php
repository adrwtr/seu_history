<?php
require_once('../include_master.php');

/**
 * forma de receber os dados com angular
 */
$ds_post    = file_get_contents("php://input");
$objRequest = json_decode($ds_post);



$arrTags = $objRequest->arrTags;

$me_descricao = utf8_decode(
    $objRequest->me_descricao
);

$ds_sql = "
insert into htry_log (me_descricao, dt_cadastro) values (
    '$me_descricao', now()
)
";

query($ds_sql);

$cd_log = getLastInsertId();
$cd_tag = 0;

if (is_array($arrTags)) {

    foreach($arrTags as $arrTag) {

        $cd_tag = 0;

        // incluir nova tag
        if ($arrTag->type == 'new') {

            $ds_sql = "
            insert into htry_tag (ds_tag) values ('"
                .  utf8_decode($arrTag->ds_tag)
                ."');";

            query($ds_sql);

            $cd_tag = getLastInsertId();
            $arrTag->cd_tag = $cd_tag;
        }

        $ds_sql = "
            insert into htry_log_tag (cd_log, cd_tag) values (
                '$cd_log', '"
                . $arrTag->cd_tag
                ."'
            );
        ";

        query($ds_sql);
    }
}

echo "[]";
die();
?>


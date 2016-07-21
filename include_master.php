<?php
$ds_conn_ip = '127.0.0.1';
$ds_conn_user = 'backup';
$ds_conn_pass = '...';
$ds_conn_db = 'adriano';



$ptrConexao = new mysqli(
    $ds_conn_ip,
    $ds_conn_user,
    $ds_conn_pass,
    $ds_conn_db
);

/*if (!mysql_select_db($ds_conn_db, $ptrConexao)) {
    echo json_encode('Erro na conexão com o banco de dados');
    // 'Erro ao selecionar banco do MYSQL: ' . mysql_error()
    die();
};*/

if (!$ptrConexao){
    echo json_encode('Erro na conexão com o banco de dados');
    // 'Erro ao selecionar banco do MYSQL: ' . mysql_error()
    die();
}

require_once('include_funcoes.php')
?>
<?php
/**
 * Executa o sql informado
 *
 * @param  str $sql sql
 * @return result
 */
function query($sql) {
    return $GLOBALS['ptrConexao']->query($sql);
}

/**
 * Codifica array para utf8
 * @param  array
 * @return array
 */
function utf8_encode_all($array)
{
    if (is_string($array)) return utf8_encode($array);
    if (!is_array($array)) return $array;
    $arrRetorno = array();

    foreach($array as $id => $value) $arrRetorno[$id] = utf8_encode_all($value);
    return $arrRetorno;
}

/**
 * Retorna o last id
 *
 * @return int
 */
function getLastInsertId()
{
    $sql = "
        SELECT LAST_INSERT_ID() as codigo FROM dual;
    ";

    $ptrResult = query($sql);

    if ($results = mysqli_fetch_array($ptrResult)) {
        return $results['codigo'];
    }
}
?>
<?php

$hora = date('H:00');
$data = date('d-m-Y');
$file = $data . '.json';

if ( !file_exists("externos/$file") ){

    $ar = array();
    // faz as requisicoes
    $i = 1;
    while ( $i < 13 ){
        sleep(2);

        $json = file_get_contents("http://clarotv.claro.com.br/GuiaProgramacao/getProgramacoesCanais/all/all/numero_asc/$data/$i");
        
        // se for fazio...
        if ( empty($json) ) continue;
        
        // escreve por garantia
        $fp = fopen('externos/' . $i . '.json', 'w+');
        fwrite($fp, $json);
        fclose($fp);

        // formata hora e add data de update
        $json = json_decode($json);        
        foreach ($json as $key => $canal) {
            
            $canal->data = time();

            foreach ($canal->Programas as $key2 => $programa) {
                $programa->HoraInicioBr = substr($programa->HoraInicio, 0, 2) .':'. substr($programa->HoraInicio, 2);
                $programa->HoraFimBr = substr($programa->HoraFim, 0, 2) .':'. substr($programa->HoraFim, 2);
            }
        }
        /*echo '<pre>';
        var_dump($json);
        exit('ok');*/

        // adiciona ao array
        $ar = array_merge($ar, $json);

        $i++;
    }

    // escreve todo o conteudo em um unico arquivo
    $fp = fopen('externos/' . $file, 'w+');
    fwrite($fp, json_encode($ar) );
    fclose($fp);
    copy('externos/' . $file, 'externos/dados.json');
}

// pega os dados
/*echo '<pre>';
$dados = file_get_contents("externos/$file");
$dados = json_decode($dados);
var_dump($dados);*/

?>
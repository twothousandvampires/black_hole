<?php
function ya($num,$f,$s,$t){return abs($num%10)==1?$f:(in_array(abs($num%10),[2,3,4])?$s:$t);}


for($i = -50; $i < 150; $i++) {
    echo($i . 'руб' . ya($i, 'ль', 'ля', 'лей') . "<br>");
}
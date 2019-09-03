<?php
$f = $_GET['f'];
function file_get_contents_curl($url,$referer='')
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_REFERER, $referer);
    curl_setopt($ch, CURLOPT_USERAGENT, ' Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $data = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($httpcode != 200) {
        $data = $httpcode;
    }
    return $data;

}
switch ($f) {
    case 'search':
        $keyword = urlencode( $_GET['keyword']);
        $content = file_get_contents_curl("http://220.249.243.70/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&searchid=0&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&&n=5&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&w=$keyword");//c.y.qq.com
        echo $content;
        break;

    case 'music':
        $guid =$_GET['guid'];
        $mid = $_GET['mid'];
        $content = file_get_contents_curl("https://u.y.qq.com/cgi-bin/musicu.fcg?data={%22req_0%22:{%22module%22:%22vkey.GetVkeyServer%22,%22method%22:%22CgiGetVkey%22,%22param%22:{%22guid%22:%22$guid%22,%22songmid%22:[%22$mid%22],%22songtype%22:[0],%22uin%22:%220%22,%22loginflag%22:1,%22platform%22:%2220%22}}}");//
        $content = json_decode($content);
        preg_match('/vkey\=(.*)&uin/', $content->req_0->data->testfile2g,$matches, PREG_OFFSET_CAPTURE);
        $vkey = $matches[1][0];
        $url ="http://183.131.60.16/amobile.music.tc.qq.com/M500$mid.mp3?guid=$guid&vkey=$vkey&uin=0&fromtag=58";

        $lrc = file_get_contents_curl("http://220.249.243.70/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=$mid&g_tk=5381","https://y.qq.com/portal/song/$mid.html");
        $lrc = substr($lrc, 18, -1);
        $lrc = json_decode($lrc, true);
        $lrc = base64_decode($lrc['lyric']);
        $data = json_encode(array('url'=>$url,'lrc'=>$lrc));
        echo  $data;
        break;


}
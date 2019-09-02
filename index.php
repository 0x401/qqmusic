<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QQ Music</title>
  <link rel="stylesheet" href="https://cdn.bootcss.com/bulma/0.7.5/css/bulma.min.css">
  <link href="https://cdn.bootcss.com/aplayer/1.10.1/APlayer.min.css" rel="stylesheet">
  <link rel="stylesheet" href="./style.css">
</head>

<body>
  <div class="container">
    <div class="tabs is-centered">
      <ul>
        <li><a href="/">Home</a></li>
        <li class="is-active"><a>QQ Music</a></li>
      </ul>
    </div>
    <div class="field has-addons has-addons-centered">
      <p class="control">
        <input id="keyword" class="input" type="text" placeholder="输入歌手名、专辑名..." value="">
      </p>
      <p class="control">
        <a id="search" class="button is-link">搜索</a>
      </p>
    </div>

    <div id="songs" class=" has-text-centered"></div>
    <div id="aplayer"></div>
  </div>
  <script src='https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'></script>
  <script src="https://cdn.bootcss.com/aplayer/1.10.1/APlayer.min.js"></script>
  <script src="./main.js"></script>
</body>
</html>
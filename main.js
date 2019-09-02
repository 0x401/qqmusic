$(function () {
  const ap = new APlayer({
    container: document.getElementById('aplayer'),
    lrcType: 1,
    autoplay: true,
    fixed: true
  });
  const menu = '<a href class="play">播放</a><a href>添加</a><a href>下载</a>';
  function get_music(song, autoplay = false) {
    let guid = parseInt(Math.random(9000000000, 9999999999) * 10000000000);
    $.get({
      url: './data.php',
      data: 'guid=' + guid + '&mid=' + song.data('mid') + '&f=music',
      success: function (result) {
        result = JSON.parse(result);
        ap.list.add([{
          name: song.data('title'),
          artist: song.data('singer'),
          url: result.url,
          cover: song.data('cover'),
          lrc: result.lrc
          // theme: '#ebd0c2'
        }]);
        if (autoplay) ap.play();
      }
    });
  }
  function sec_to_time(s) {
    let t = '';
    if (s > -1) {
      //var hour = Math.floor(s/3600);
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      if (min < 10) { t += "0"; }
      t += min + ":";
      if (sec < 10) { t += "0"; }
      t += sec;
    }
    return t;
  }
  //工具栏
  $('#songs').on('mouseover', '.name', function () {
    $(this).children('.music-menu').removeClass('hidden');
  });
  $('#songs').on('mouseout', '.name', function () {
    $(this).children('.music-menu').addClass('hidden');
  });
  //播放
  $('#songs').on('click', '.play', function () {
    ap.list.clear();
    get_music($(this), true);
  });
  //添加
  $('#songs').on('click', '.add', function () {
    get_music($(this));
  });
  //专辑
  $('#songs').on('click', '.albummid', function () {
    console.log('a');
  });
  //
  function check() {
    $('#songs').html('<ul class="song music-header"><li class="name">歌曲</li><li class="singer">歌手</li><li class="album">专辑</li><li calss="interval">时长</li></ul>');
    let d = $('#keyword');
    if (d.val() != "") {
      $("a#search").addClass("is-loading");
      $.get({
        url: './data.php',
        data: 's=' + encodeURIComponent(d.val()) + '&f=search',
        success: function (result) {
          console.log(result);
          let list = JSON.parse(result).data.song.list;
          list.forEach(el => {
            let info = 'data-mid="' + el.mid + '" data-title="' + el.title + '" data-singer="' + el.singer[0].title + '" data-cover="https://y.gtimg.cn/music/photo_new/T002R300x300M000' + el.album.mid + '.jpg"';
            let row = '<ul class="song" ' + info + '><li class="name"><a class="music-title" href="javascript:;">' + el.title + '</a><div class="music-menu hidden"><a href="javascript:;" title="立即播放" class="play" ' + info + '></a><a href="javascript:;" title="加入播放列表" class="add" ' + info + '></a><a href="javascript:;" title="下载" class="dl"></a></div></li><li class="singer">' + el.singer[0].title + '</li><li class="album"><span class="albummid" data-albummid="' + el.album.mid + '">' + el.album.title + '</span></li><li class="interval">' + sec_to_time(el.interval) + '</li></ul>'
            $('#songs').html($('#songs').html() + row);
          });
          $("a#search").removeClass("is-loading");
          get_music($('.song').eq(1), true);

        }
      });
    }
  }
  $("a#search").on('click', function () {
    check();
  });
});

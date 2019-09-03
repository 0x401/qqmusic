$(function () {
  const ap = new APlayer({
    container: document.getElementById('aplayer'),
    lrcType: 1,
    autoplay: true,
    fixed: true
  });
  const music_header = '<ul class="song music-header"><li class="name">歌曲</li><li class="singer">歌手</li><li class="album">专辑</li><li calss="interval">时长</li></ul>';
  let music_body;
  let keyword;
  function add_music(song, autoplay = false) {
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
        if (autoplay) {
          ap.play();
        }
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
  function record(keyword) {
    $.ajax({
      url: "../record.php?service=music&tag=keyword&value=" + encodeURIComponent(keyword),
      success: function (result) {
        console.log(result);
      }
    });
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
    add_music($(this), true);
  });
  //添加
  $('#songs').on('click', '.add', function () {
    add_music($(this));
  });
  //专辑
  $('#songs').on('click', '.albummid', function () {
    console.log('a');
  });
  //分页
  function pagination(totalnum, page) {
    let pagenum = Math.ceil(totalnum / 10);
    if (pagenum > 10) pagenum = 10;
    let pages = '<nav class="pagination is-center" role="navigation" aria-label="pagination"><ul class="pagination-list">';
    for (i = 1; i < pagenum + 1; i++) {
      if (i == page) {
        pages += '<li><a class="pagination-link is-current" aria-label="Page ' + i + '" aria-current="page">' + i + '</a></li>'
      } else {
        pages += '<li><a class="pagination-link" aria-label="Goto page ' + i + '">' + i + '</a></li>';
      }
    }
    pages += '</ul ></nav >';
    return pages;
  }
  function search(keyword, page = 1) {
    $("a#search").addClass("is-loading");
    $.get({
      url: './data.php',
      data: 'keyword=' + encodeURIComponent(keyword) + '&p=' + page + '&f=search',
      success: function (result) {
        console.log(result);
        record(keyword);
        let list = JSON.parse(result).data.song.list;
        music_body = '';
        list.forEach(el => {
          let info = 'data-mid="' + el.mid + '" data-title="' + el.title + '" data-singer="' + el.singer[0].title + '" data-cover="https://y.gtimg.cn/music/photo_new/T002R300x300M000' + el.album.mid + '.jpg"';
          let row = '<ul class="song" ' + info + '><li class="name"><a class="music-title" href="javascript:;">' + el.title + '</a><div class="music-menu hidden"><a href="javascript:;" title="立即播放" class="play" ' + info + '></a><a href="javascript:;" title="加入播放列表" class="add" ' + info + '></a><a href="javascript:;" title="下载" class="dl"></a></div></li><li class="singer">' + el.singer[0].title + '</li><li class="album"><span class="albummid" data-albummid="' + el.album.mid + '">' + el.album.title + '</span></li><li class="interval">' + sec_to_time(el.interval) + '</li></ul>'
          music_body += row;
        });
        $("a#search").removeClass("is-loading");
        let pages = pagination(JSON.parse(result).data.song.totalnum, page);
        $('#songs').html(music_header + music_body + pages);
        if (page == 1) {
          add_music($('.song').eq(1), true);
        }
      }
    });
  }
  $("a#search").on('click', function () {
    if ($('#keyword').val().trim() != '') {
      keyword = $('#keyword').val();
      search(keyword);
    }
  });
  //分页
  $('#songs').on('click', '.pagination-link', function () {
    search(keyword, $(this).text());
  });
});
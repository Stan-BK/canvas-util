(function() {
  function changeBackground() {
    var canvas = document.getElementById("canvas");
    var video = document.getElementById('video')
    var ctx = canvas.getContext("2d");
    var img = document.getElementById('background')
    var btn = document.getElementById('changebtn')
    img.src = 'https://img1.baidu.com/it/u=1997330805,2252719449&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500'
    video.width = 400
    let width = canvas.width = img.width = video.width
    let height = img.height = 0
    let timer
    video.onloadeddata = function() {
      height = canvas.height = img.height = video.getBoundingClientRect().height
    }
    btn.addEventListener('click', function() {
      var input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/jpg, image/jpeg, image/pnt'
      input.click()
      input.onchange = function() {
        img.src = URL.createObjectURL(input.files[0])
      }
    })
    video.addEventListener('play', function(e) {
      timer = reduceDrawBackground()

      function reduceDrawBackground() {
        ctx.drawImage(video, 0, 0, width, height)
        replaceGreen(video)
        timer = setTimeout(() => {
          reduceDrawBackground()
        })
      }
    })
    video.addEventListener('pause', function(e) {
      const video = e.target
      ctx.drawImage(video, 0, 0, width, height)
      replaceGreen(video)
      clearTimeout(timer)
    })
    
    function replaceGreen() {
      const ImageData = ctx.getImageData(0, 0, width, height)
      const data = ImageData.data
      const k = data.length / 4
      let r, g, b
      let index
      for (var i = 0; i < k; i++) {
        index = i * 4
        r = data[index]
        g = data[index + 1]
        b = data[index + 2]
        if (r < 90 && g === 195 && b < 86) {
          data[index + 3] = 0
        }
      }
      ImageData.data = data
      ctx.putImageData(ImageData, 0, 0)
    }
  }

  window.changeBackground = changeBackground
})()
changeBackground()
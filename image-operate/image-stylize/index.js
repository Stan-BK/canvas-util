(function() {
  function Stylize() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const clipImg = document.getElementById('clipImg')
    const cpImg = clipImg.getContext('2d')
    const img = document.createElement('img')
    const btn1 = document.getElementById('getClipImgbtn')
    const btn2 = document.getElementById('changeClipImgbtn')
    let clipRect = new Path2D()
    const clipCod = Array(4)
    let dir = 0
    img.src = 'https://img1.baidu.com/it/u=2360704792,4144544632&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=616'
    img.crossOrigin = 'anonymous'
    img.onload = function() {
      canvas.width = img.width + 2
      canvas.height = img.height + 2
      ctx.strokeStyle = '#424242'
      ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1)
      initClipImg(img)
    }

    // 获取截图
    btn1.addEventListener('click', function() {
      const a = document.createElement('a')
      const image = clipImg.toDataURL()
      a.download = 'your_clip_img.jpg'
      a.href = image
      a.click()
    })
    
    // 更换图片
    btn2.addEventListener('click', function() {
      const file = document.createElement('input')
      file.type = 'file'
      // file.setAttribute('accept', 'image/jpg,image/jpeg,image/png')
      file.accept = 'image/jpg,image/jpeg,image/png'
      file.click()
      file.onchange = function() {
        console.log(file.files)
        img.src = URL.createObjectURL(file.files[0])
      }
    })

    canvas.addEventListener('mousedown', function(e) {
      let cod = []
      if (ctx.isPointInStroke(clipRect, e.offsetX, e.offsetY)) {
        let num = dir
        for (var i = dir.toString(2).padStart(4, 0).length - 1; i >= 0 ; i--) {
          if (num & 1) {
            cod.push(i)
          }
          num >>>= 1
        }
        canvas.addEventListener('mousemove', resizeClip)
        canvas.addEventListener('mouseup', endClip)
        canvas.addEventListener('mouseleave', endClip)
        canvas.removeEventListener('mousemove', changeCursor)
      }

      function resizeClip(e) {
        for (var i of cod) {
          if (i % 2 === 0) 
            clipCod[i] = e.offsetX
          else
            clipCod[i] = e.offsetY
        }
        generateClipImg()
      }

      function endClip() {
        canvas.removeEventListener('mousemove', resizeClip)
        canvas.removeEventListener('mouseup', endClip)
        canvas.removeEventListener('mouseleave', endClip)
        canvas.addEventListener('mousemove', changeCursor)
      }

      function generateClipImg() {
        const x1 = clipCod[0]
        const y1 = clipCod[1]
        const x2 = clipCod[2]
        const y2 = clipCod[3]
        changePath(x1, y1, x2, y2)
        ctx.clearRect(0, 0, canvas.width - 1, canvas.height - 1)
        ctx.drawImage(img, 1, 1)
        ctx.strokeRect(0, 0, canvas.width - 1, canvas.height - 1)        
        const imageData = ctx.getImageData(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x1 - x2), Math.abs(y1 - y2))
        clipImg.width = imageData.width
        clipImg.height = imageData.height
        cpImg.putImageData(imageData, 0, 0)
        ctx.stroke(clipRect)
      }
    })
    canvas.addEventListener('mousemove', changeCursor)

    function changeCursor(e) {
      if (ctx.isPointInStroke(clipRect, e.offsetX, e.offsetY)) {
        getDir(e.offsetX, e.offsetY)
      } else {
        canvas.style.cursor = 'auto'
      }
    }

    // 根据方向修改鼠标样式
    function getDir(x, y) {
      let num = ''
      for (var i = 0; i < 4; i++) {
        if (clipCod[i] === x || clipCod[i] === y) {
          num += 1
          continue
        }
        num += 0
      }
      switch(dir = parseInt(num, 2)) {
        case 1:
        case 4: canvas.style.cursor = 'ns-resize'; break;
        case 2:
        case 8: canvas.style.cursor = 'ew-resize'; break;
        case 3:
        case 12: {
          if (clipCod[0] < clipCod[2])
            canvas.style.cursor = 'nwse-resize';
          else
            canvas.style.cursor = 'nesw-resize';
        } break;
        case 6:
        case 9: {
          if (clipCod[0] > clipCod[2])
            canvas.style.cursor = 'nwse-resize';
          else
            canvas.style.cursor = 'nesw-resize';
        } break;
        default: canvas.style.cursor = 'auto'
      }
    }

    // 初始化截取范围
    function initClipImg() {
      const w = canvas.width
      const h = canvas.height
      const x1 = clipCod[0] = Math.floor(w * 2 / 10)
      const y1 = clipCod[1] = Math.floor(h * 2 / 10)
      const x2 = clipCod[2]= Math.floor(w * 8 / 10)
      const y2 = clipCod[3] = Math.floor(h * 8 / 10)
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 1, 1)
      changePath(x1, y1, x2, y2)
      const imageData = ctx.getImageData(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x1 - x2), Math.abs(y1 - y2))
      clipImg.width = imageData.width
      clipImg.height = imageData.height
      cpImg.putImageData(imageData, 0, 0)
      ctx.stroke(clipRect)
    }

    // 生成新的Path2D对象
    function changePath(x1, y1, x2, y2) {
      clipRect = new Path2D()
      clipRect.moveTo(x1, y1)
      clipRect.lineTo(x1, y1)
      clipRect.lineTo(x1, y2)
      clipRect.lineTo(x2, y2)
      clipRect.lineTo(x2, y1)
      clipRect.closePath()  
    }
  }
  window.Stylize = Stylize
})()
Stylize()
(function() {
  function Magnifier(imgSrc, width, height) {
    if (!imgSrc) {
      throw new Error('Magnifier need an image source')
    }
    const img = document.createElement('img')
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    img.src = imgSrc
    img.style.display = 'none'
    img.onload = function() {
      width = width || img.width
      height = height || img.height
      canvas.width = width
      canvas.height = height
      const magnifierLength = Math.min(width, height) * (3 / 10)
      const halfLength = magnifierLength / 4
      ctx.drawImage(img, 0, 0, width, height)
      canvas.addEventListener('mousemove', function(e) {
        let mouseX = e.offsetX - halfLength
        let mouseY = e.offsetY - halfLength
        mouseX < 0 && (mouseX = 0)
        mouseY < 0 && (mouseY = 0)
        const X = width - magnifierLength
        const Y = height - magnifierLength
        ctx.drawImage(img, mouseX, mouseY, magnifierLength / 2, magnifierLength / 2,
                           X, Y, magnifierLength, magnifierLength)
      }, false)
    }
  
    return canvas
  }
  window.Magnifier = Magnifier
})()
const canvas = Magnifier('https://img0.baidu.com/it/u=4282779866,1922355142&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=487')
console.log(canvas)
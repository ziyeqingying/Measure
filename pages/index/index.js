const app = getApp()

Page({
  data: {
    array: [],
    lineTop: 0,
    numTop: 0,
    windowHig: 0,
    windowWid: 0,
    minCount: 0
  },
  /**
   * 绘出移动时拖线
   */
  createLin: function() {
    var ctx = wx.createCanvasContext('caline')
    ctx.beginPath()
    ctx.moveTo(0, 10)
    ctx.lineTo(wx.getSystemInfoSync().screenWidth, 10)
    ctx.setStrokeStyle('red')
    ctx.stroke()
    ctx.draw()
  },
  /**
   * 获取每mm的逻辑长度
   */
  getMin: function() {
    var infor = wx.getSystemInfoSync()
    var width = infor.screenWidth
    var height = infor.screenHeight
    var phoneLength = Math.sqrt(infor.pixelRatio * width * infor.pixelRatio * width + infor.pixelRatio * 780 * infor.pixelRatio * 780)
    var ppi = phoneLength / 6.53;
    var min = 1 * ppi / 25.4;
    min = min / infor.pixelRatio
    return min
  },
  onLoad: function () {
    this.createLin()  
    
    var infor = wx.getSystemInfoSync()
    var width = infor.screenWidth
    var height = infor.screenHeight
    var min = this.getMin()
    var context = wx.createCanvasContext('myCanvas')
    var move = 10;
    this.windowWid = width
    context.beginPath();
    context.setStrokeStyle("black")
    context.moveTo(30, 10)
    context.lineTo(30, wx.getSystemInfoSync().screenHeight)
    this.setData({
      cavasHeight: wx.getSystemInfoSync().screenHeight + "px"
    })
    for (var i = 0; i < parseInt(height/min); i++) {
      var len = 10;
      if (i % 10 == 0) {
        len = 20;
      }
      context.moveTo(30, move)
      context.lineTo(30 - len, move)
      move = move + min
    }
    context.stroke()
    context.draw()
    this.setData({
      marginTop: min * 10
    })
    var arr = [];
    for (var i = 0; i < parseInt(0.1*height / min) - 1; i++) {
      arr.push({val: i});
    }
    this.setData({
      array: arr,
      numTop: -min*10,
      windowHig: wx.getSystemInfoSync().screenHeight
    })
    this.data.array = arr;
    // this.createNum()
  },
  mycallback1: function (linetop, ctx) {
    ctx.setStrokeStyle('red')
    ctx.moveTo(this.windowWid / 2, linetop)
    ctx.lineTo((this.windowWid / 2) - 10, linetop + 10)
    ctx.lineTo((this.windowWid / 2) + 10, linetop + 10)
    ctx.lineTo(this.windowWid / 2, linetop)
    ctx.strokeRect((this.windowWid / 2) - 30, linetop + 10, 60, 120)
    ctx.stroke()


    this.data.lineTop = linetop
    var min = this.getMin();
    var measureLength = (linetop - 10) / min
    ctx.setFillStyle('red')
    ctx.setFontSize(20)
    ctx.rotate(0.5 * Math.PI)
    ctx.fillText(measureLength.toFixed(1) + "mm", (linetop + 20), -(this.windowWid/2));
  },
  /**

   * 绘制当前移动到的刻度值
   */
  mycallback: function(linetop) {
    this.data.lineTop = linetop
    var min = this.getMin();
    var measureLength = (linetop-10)/min
    var ctx = wx.createCanvasContext('mlength')
    ctx.setFillStyle('red')
    ctx.setFontSize(30)
    ctx.rotate(0.5*Math.PI)
    ctx.fillText(measureLength.toFixed(1) + "mm", 50, -50);
    ctx.draw() 
  },
  fixNum: function(intNum) {
    var linetop = intNum
    var min = this.getMin();
    var measureLength = (linetop - 10) / min
    var ctx = wx.createCanvasContext('mlength')
    ctx.setFillStyle('red')
    ctx.setFontSize(30)
    ctx.rotate(0.5 * Math.PI)
    ctx.fillText(Math.round(measureLength) + "mm", 50, -50)
    ctx.draw()
    //var lineTop = Math.round(measureLength)*min + 10

  },
  changeCanvas: function(event) {
    var lineTop = event.touches[0].clientY
    var ctx = wx.createCanvasContext('caline')
    ctx.beginPath();
    if(lineTop <= 10) {
      ctx.moveTo(0, 10)
      ctx.lineTo(this.windowWid, 10)
      lineTop = 10
    }
    else if (lineTop >= wx.getSystemInfoSync().windowHeight) {
      var min = this.getMin();
      var lastMark = 10
      var count = parseInt((wx.getSystemInfoSync().windowHeight - 10) / min)
      for(var i = 0; i < count; i++) {
        lastMark += min;
      }
      ctx.moveTo(0, lastMark)
      ctx.lineTo(this.windowWid, lastMark)
      lineTop = lastMark
    }
    else {
      ctx.moveTo(0, lineTop)
      ctx.lineTo(this.windowWid, lineTop)
    }
    this.data.lineTop = lineTop



    this.mycallback1(lineTop, ctx)
    ctx.setStrokeStyle('red')
    ctx.stroke()
    ctx.draw()
    //this.mycallback(lineTop)
  }, 
  /**
   * 取整操作过程
   */
  fixCount: function() {
    var min = this.getMin()
    var lastMark = this.data.lineTop
    var acurrate = 10
    for (var i = 0; i < Math.round((lastMark - 10) / min); i++) {
      acurrate += min 
    }
    lastMark = min*parseInt(lastMark/min)
    var ctx = wx.createCanvasContext('caline')
    ctx.beginPath();
    ctx.moveTo(0, acurrate)
    ctx.lineTo(wx.getSystemInfoSync().screenWidth, acurrate)
    ctx.setStrokeStyle('red')
    ctx.stroke()
    this.mycallback1(acurrate, ctx)
    ctx.draw()
  },
  divideLine: function(event) {
    console.log("longpress emit");
  },
  createNum: function() {
    var ctx = wx.createCanvasContext('nums')
    var min = this.getMin()
    ctx.setFillStyle('red')
    ctx.setFontSize(20)
    //ctx.rotate(0.5 * Math.PI)
    // ctx.fillText('hello', 0, 50)
    // ctx.fillText('MINA', 0, 100)
    // ctx.draw()

    for (var i = 0; i < this.data.array.length; i++) {
      
      ctx.fillText(this.data.array[i].val, 0, min*10*i + 10)

    }
    ctx.draw()

  }
})

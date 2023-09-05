
import _ from 'lodash'
import appconfig from '@/package/'

    //判定是否要缩放界面
let isResizeWindowFlag = _.get(layui.electron, "app.appConfig.isResizeWindowFlag") || false;

function resizeWindow (el) {
    if (!isResizeWindowFlag) return;

    let _w = $(window).width(),
      _h = $(window).height(),
      pw = el.width(),
      ph = el.height();

    let scale_w = (_w / pw).toFixed(3),
      scale_h = (_h / ph).toFixed(3);
    let s = scale_w < scale_h ? scale_w : scale_h;

    this.windowScale = s;
    el.css("transform", "scale(" + s + ")");

    console.log(
      `resizeWindow : scale_w:${scale_w} ; scale_h:${scale_h}; s: ${s}`
    );
  },
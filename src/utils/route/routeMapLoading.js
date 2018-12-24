//
export function rayCasting(p, poly) {
  const turns = 0;
  let px = parseFloat(p.lat),
    py = parseFloat(p.lng),
    flag = false;
  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    const sx = parseFloat(poly[i].lat),
      sy = parseFloat(poly[i].lng),
      tx = parseFloat(poly[j].lat),
      ty = parseFloat(poly[j].lng);
    // 点与多边形顶点重合
    if ((sx === px && sy === py) || (tx === px && ty === py)) {
      return true
    }
    // 判断线段两端点是否在射线两侧
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      // 线段上与射线 Y 坐标相同的点的 X 坐标
      const x = sx + (py - sy) * (tx - sx) / (ty - sy);
      // 点在多边形的边上
      if (x === px) {
        return true
      }
      // 射线穿过多边形的边界
      if (x > px) {
        flag = !flag
      }
    }
  }
  // 射线穿过多边形边界的次数为奇数时点在多边形内
  return flag
}

//
export function rayBarrier(p, poly, num) {
  if (num === 0) {
    return this.rayCasting(p,poly)
  }
  const turns = 0;
  const px1 = parseFloat(p.lat),
    py1 = parseFloat(p.lng),
    px2 = parseFloat(allRouteMarkerPosition[id][num - 1].lat),
    py2 = parseFloat(allRouteMarkerPosition[id][num - 1].lng),
    flag = false;
  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    const sx = parseFloat(poly[i].lat),
      sy = parseFloat(poly[i].lng),
      tx = parseFloat(poly[j].lat),
      ty = parseFloat(poly[j].lng);
    const fa = (sy - py1) * (px2 - px1) - (sx - px1) * (py2 - py1);
    const fb = (ty - py1) * (px2 - px1) - (tx - px1) * (py2 - py1);
    const fc = (py1 - sy) * (sx - tx) - (px1 - sx) * (sy - ty);
    const fd = (py2 - sy) * (sx - tx) - (px2 - sx) * (sy - ty);
    if (fa * fb <= 0 && fc * fd <= 0) {
      return true;
    }
  }
  return flag;
}

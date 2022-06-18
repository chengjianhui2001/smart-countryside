Page({
  data: {
    activeKey: 0,
  },

  onChange(event){
    this.setData({
      activeKey:event.detail
    })
  }
});
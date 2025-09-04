## 解密data，充電無限重啟解決方案:

禁用属性:
```
persist.sys.stability.gcImproveEnable.808=false
```
## 修復裝置沒有HY2底包產生的藍芽聲音問題(方案1)
```
bluetooth.profile.bap.broadcast.assist.enabled=false 
bluetooth.profile.bap.broadcast.source.enabled=false
bluetooth.profile.bap.unicast.client.enabled=false
bluetooth.profile.bas.client.enabled=true
bluetooth.profile.ccp.server.enabled=false
bluetooth.profile.csip.set_coordinator.enabled=false
bluetooth.profile.hap.client.enabled=false bluetooth.profile.mcp.server.enabled=false bluetooth.profile.sap.server.enabled=false bluetooth.profile.vcp.controller.enabled=false
```
## 修復裝置沒有HY2底包產生的藍芽聲音問題(方案2)

# MIUI/HyperOS 移植指南：常見問題與修復

這份指南整理了在進行 MIUI 或 HyperOS 韌體移植時，可能遇到的問題及其解決方案。
> 此修復方案教學由 酷安眾多大佬提供，由 閃電Flashh 彙整，真摯感謝。

##  1\. 修復「全部參數與資訊」中的處理器頻率錯誤

此問題常見於 **MIUI A12 或更舊的底包**。
打開 **`/product/etc/device_features/你的機型代號.xml`**，搜尋 `cpu_max_freq`，然後將其參數值修改為正確的處理器頻率。

> **例如**:
>
>   * `291` 代表 2.91GHz
>   * `320` 代表 3.2GHz

-----

##  2\. 修復設定中的認證資訊

用底包中的 **`/product/overlay/SettingsRroDeviceTypeOverlay.apk`** 替換。若底包過舊找不到，可自行修改其他機型的 APK，替換其中的認證圖片並修改為正確的認證型號。

> *此修復方案部分來自是天天吖。*

-----

##  3\. 移除無法使用的呼吸燈開關

打開 **`/product/etc/device_features/你的機型代號.xml`**，搜尋 `support_led_light` 和 `support_led_color`。若它們的值為 `true`，請將其修改為 **`false`**。

-----

##  4\. 遮蔽陽光模式開關

在 **`/product/etc/device_features/你的機型代號.xml`** 中新增以下程式碼即可遮蔽開關：

```xml
<bool name="config_sunlight_mode_available">false</bool>
```

-----

##  5\. 修復預設壁紙（方案 1）

1.  拆包 **`/product/overlay/AospFrameworkResOverlay.apk`**。
2.  在 `res` → `drawable` 資料夾中，將所有壁紙替換為你想要的預設壁紙。

-----

##  6\. 修復預設壁紙（方案 2）

此方案可恢復澎湃系統的預設壁紙。

1.  拆包 **`/product/overlay/AospFrameworkResOverlay.apk`**。
2.  在 `resources.arsc` 中，刪除 `android.aosp.overlay` → `drawable` 裡的所有內容。

-----

##  7\. 修復小米相簿編輯功能

用底包中的 **`/product/data-app/MIMediaEditor`** 替換。

> **注意**: 在 **MIUI A12 或更舊的底包**中，該路徑可能為 `/system/data-app/MIMediaEditor`。

-----

##  8\. 修復 HEIC 圖片檢視問題

在 `build.prop` 中加入以下程式碼。若不確定，可新增至 **`/product/etc/build.prop`**。

```
vendor.mm.enable.qcom_parser=
```

等號後的數值會因機型而異：

  * **870/888** 機型: `12565751`
  * **778+** 機型: `16776951`

-----

##  9\. 老機型修復側滑返回震動（方案 1）

此方案適用於更換第三方內核後，其他震動正常但側滑返回震動失效的舊款機型。

1.  進入 **`/vendor/firmware/`** 路徑。
2.  刪除 `162_Gesture` 和 `163_Gesture` 開頭的兩個檔案。

> **效果**: 刪除後，側滑返回的第一段無震動，第二段有震動。

-----

##  10\. 老機型修復側滑返回震動（方案 2）

此方案適用於上述同樣問題，但效果不同。
在任意分區的 `build.prop` 中新增：
`sys.haptic.version=2.0`

> **效果**: 呼叫 2.0 震動後，側滑返回的第一段有震動，第二段無震動。但其他震動功能可能會失效大半。

-----

##  11\. 修復精彩錄製（高能時刻）錄製後不儲存

1.  找到 **`/product/app/`** 路徑下，檔名含有 `MiGameService` 的資料夾。
2.  用本機或同定位機型中的檔案替換。已知 870、778、888 為一套，7+ Gen 2 為一套，8+ Gen 1 為一套。
3.  如果你的設備原本沒有此功能，可手動開啟：
      * 打開 **`/product/etc/device_features/你的機型代號.xml`**。
      * 新增（或將現有選項從 `false` 改為 `true`）以下程式碼：
    <!-- end list -->
    ```xml
    <bool name="support_game_mi_time">true</bool>
    ```
      * 如果仍無效，檢查 `/product/app/` 是否有 `MiGameService` 資料夾。若無，可嘗試從同定位機型中提取並補入。

-----

##  12\. `cust` 分區精簡

解包 `cust.img` 後，只保留以下檔案和資料夾：

  * `/cust/cust_variant`
  * `/cust/etc/business.prop`
  * `/cust/etc/cust_apps_config`
  * `/cust/etc/cust_apps_request_config`
    其餘一律刪除後重新打包。

-----

##  13\. `userdata` 分區處理

在 MiFlash 線刷包中，通常會包含一個 `userdata.img`。更換一個乾淨、未被修改過的 `userdata.img` 即可（通常可根據較小的檔案大小判斷）。

-----

##  14\. 常規應用精簡

這些應用通常可以安全刪除，以節省空間和提高效能。

  * **使用者反饋**: `/product/app/MiBugReport`
  * **智慧服務**: `/product/app/MSA`
  * **系統更新**: `/product/app/Updater`
  * **服務與反饋**: `/product/priv-app/MIService`
  * **小米運動健康**: `/product/data-app/Health`
  * **小米相簿-編輯**: `/product/data-app/MIMediaEditor`
  * **小米錢包**: `/product/data-app/MIpay`
  * **小米商城**: `/product/data-app/MiShop`
  * **萬能遙控**: `/product/data-app/XMRemoteController`
    ...等等。

-----

##  15\. 移植時的額外精簡

老設備移植 **8 Gen 2 及以上**的 ROM 時，由於以下檔案會被本機的 `/vendor/app/` 覆蓋，因此可以安全精簡掉：

  * `/product/app/IFAAService`
  * `/product/app/MipayService`
  * `/product/app/QcomSoterService`

-----

##  16\. 解耦合應用

將以下應用從 `priv-app` 或 `app` 移動到 `data-app`，可將其轉為可卸載的系統應用，從而釋放系統空間。

  * **快應用服務框架**: `/product/app/HybridPlatform`
  * **瀏覽器**: `/product/priv-app/MIUIBrowser`

> **提示**: 在第二批解耦合的機型中，可解耦合的應用範圍更大，例如音樂、錢包等。

-----

##  17\. 移除簽名驗證

此操作可允許安裝未經簽名或修改的 APK。

1.  反編譯 **`/system/framework/services.jar`**。
2.  用 MT 管理器中的 **Dex 編輯器++**，全選後進入。
3.  搜尋 `getMinimumSignatureSchemeVersionForTargetSdk`。
4.  將類似於以下兩行的程式碼：
    ```
    invoke-static {v0}, Landroid/util/apk/ApkSignatureVerifier;->getMinimumSignatureSchemeVersionForTargetSdk(I)I
    move-result v0
    ```
    替換為：
    `const/4 v0, 0x0`

> **注意**: 通常會搜尋到 4 處，每處都需要修改。
> *此方法來自白羊唐黎明。*

-----

##  18\. Dex2Oat

此步驟用於重新編譯修改過的 `services.jar`，以確保其正常運作。

1.  在手機內部儲存中建立工作目錄，例如 `/storage/emulated/0/工作目錄/service/`。
2.  將修改好的 **`services.jar`** 和 **`services.jar.prof`** 複製到該目錄。
3.  在終端執行以下命令（指令較長，建議分段執行或確認路徑無誤）：
      * 清除舊的編譯檔案：
    <!-- end list -->
    ```sh
    rm -rf /storage/emulated/0/工作目錄/service/services.art
    rm -rf /storage/emulated/0/工作目錄/service/services.odex
    rm -rf /storage/emulated/0/工作目錄/service/services.vdex
    ```
      * 進入目錄並執行 Dex2Oat 編譯：
    <!-- end list -->
    ```sh
    cd /storage/emulated/0/工作目錄/service/
    dex2oat --dex-file=services.jar --instruction-set=arm64 --compiler-filter=everything --profile-file=services.jar.prof --oat-file=services.odex --app-image-file=services.art
    ```
      * 將新生成的檔案複製到指定位置：
    <!-- end list -->
    ```sh
    # 建立儲存目錄
    mkdir -p /storage/emulated/0/儲存目錄/framework/oat/arm64/
    # 複製編譯結果
    cp -r /storage/emulated/0/工作目錄/service/services.art /storage/emulated/0/儲存目錄/framework/oat/arm64/
    cp -r /storage/emulated/0/工作目錄/service/services.odex /storage/emulated/0/儲存目錄/framework/oat/arm64/
    cp -r /storage/emulated/0/工作目錄/service/services.vdex /storage/emulated/0/儲存目錄/framework/oat/arm64/
    # 複製 jar 和 prof 檔案
    cp -r /storage/emulated/0/工作目錄/service/services.jar.prof /storage/emulated/0/儲存目錄/framework/
    cp -r /storage/emulated/0/工作目錄/service/services.jar /storage/emulated/0/儲存目錄/framework/
    ```
4.  最後，將 `/storage/emulated/0/儲存目錄/framework/` 中的內容複製並覆蓋到 **`/system/framework/`**。

> *此方法來自白羊唐黎明。*

-----

##  19\. 修復刷模組後 NFC 失效

將 **`/product/pangu/system/`** 中的內容合併到 **`/system/`** 分區即可。

-----

##  20\. 新全域高刷

此方案用於為設備新增或開啟新的全域高刷新率模式。

1.  打開 **`/product/etc/device_features/你的機型代號.xml`**。
2.  如果沒有新版的刷新率介面，新增以下程式碼：
    ```xml
    <bool name="support_smart_fps">true</bool>
    <integer name="smart_fps_value">120</integer>
    ```
3.  找到 `fpsList` 並在其中找到 `<item>60</item>`，將其修改為：
    `<item>6</item>`
4.  進入系統後，在刷新率設定中多次從 120Hz 切換到 6Hz，即可啟用此功能。

-----

##  21\. 狂暴引擎 UI

  * **遊戲加速**: 在 **`/product/etc/device_features/你的機型代號.xml`** 中新增：
    `<bool name="support_wild_boost">true</bool>`
    需要 **8.8 或以上**版本的手機管家（安全服務）。
  * **控制中心與省電模式**: 在 **`/product/etc/device_features/你的機型代號.xml`** 中新增：
    `<bool name="support_wild_boost_bat_perf">true</bool>`
    需要 **9.0 或以上**版本的手機管家（安全服務）。
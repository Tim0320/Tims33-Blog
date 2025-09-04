# MIUI/HyperOS 移植指南：常見問題與修復

這份指南整理了在進行 MIUI 或 HyperOS 韌體移植時，可能遇到的問題及其解決方案。
> 此修復方案教學由 酷安眾多大佬提供，由 閃電Flashh 彙整，真摯感謝。

## 1\. 修復「隱藏螢幕劉海」選項錯位

用本機型或螢幕挖孔位置相同的機型中的 **`/product/overlay/SettingsRroDeviceHideStatusBarOverlay.apk`** 進行替換。

-----

## 2\. 修復護眼模式色溫過黃或調節不明顯

打開 **`/product/etc/device_features/你的機型代號.xml`**，搜尋並調整 `paper_mode_max_level` 和 `paper_mode_min_level` 這兩個參數，直到效果合適為止。

-----

## 3\. 低端機移植早期 HyperOS 修復圖標丟失

當低端機移植早期 HyperOS 後出現圖示丟失時，通常是因桌面程式未適配所致。

1.  拆包 **`/product/priv-app/MiuiHome/MiuiHome.apk`**。
2.  用 MT 管理器進入 **Dex 編輯器++**，全選後進入。
3.  搜尋並刪除你的機型代號（如果存在）。
4.  搜尋 **`cezanne`**，並將其替換為你自己的機型代號。

-----

## 4\. 修復/移除小愛翻譯實時翻譯

用本機型或低端機型中的 **`/product/app/AiAsstVision/`** 資料夾進行替換。

-----

## 5\. 低端機移植後修復超級壁紙

用旗艦機型中的 **`/product/overlay/MIWallpaperOverlay.apk`** 進行替換。

-----

## 6\. 修復靜置鎖幀（方案1）

打開 **`/product/etc/build.prop`**，並新增以下程式碼：

```
ro.surface_flinger.use_content_detection_for_refresh_rate=true
ro.surface_flinger.set_idle_timer_ms=2147483647
ro.surface_flinger.set_touch_timer_ms=2147483647
ro.surface_flinger.set_display_power_timer_ms=2147483647
```

-----

## 7\. 修復靜置鎖幀（方案2）

打開 **`/product/etc/build.prop`**，並新增以下程式碼：

```
ro.surface_flinger.use_content_detection_for_refresh_rate=false
```

-----

## 8\. 修復開機鎖定 60Hz 幀率（方案1）

1.  拆包 **`/product/overlay/AospFrameworkResOverlay.apk`**。
2.  在 `resources.arsc` → `android.aosp.overlay` → `integer` → `integer` 中，找到 `config_defaultPeakRefreshRate`。
3.  將預設值修改為 **60**。

-----

## 9\. 修復開機鎖定 60Hz 幀率（方案2）

此方案透過開機腳本來強制修復幀率。

1.  在 **`/system_ext/etc/init/`** 路徑下新增一個檔案（例如 `fix_flashh_service.rc`），並加入以下內容：

    ```
    service fix_flashh_service /system/bin/sh /system/FlashhFix/fix_flashh_service.sh
        class main
        user root
        group root
        disabled
        oneshot
        seclabel u:r:shell:s0

    on property:sys.boot_completed=1
        start fix_flashh_service
    ```

2.  在 **`/system/FlashhFix/`** 路徑下新增檔案 `fix_flashh_service.sh`，並加入以下內容：

    ```sh
    while [ "$(getprop sys.boot_completed)" != "1" ]; do
        sleep 0.1s
    done

    b=$( settings list system | grep peak_refresh_rate )

    if [[ $b == "peak_refresh_rate=165" ]]; then
        settings put system peak_refresh_rate 60
        settings put secure miui_refresh_rate 60
        settings put secure user_refresh_rate 60
        sleep 0.1s
        settings put system peak_refresh_rate 165
        settings put secure miui_refresh_rate 165
        settings put secure user_refresh_rate 165
    fi

    #... [省略 144Hz, 120Hz, 90Hz, 75Hz 的重複程式碼] ...
    ```

    > **注意**: 如果你的螢幕不是 165Hz，請依據實際情況將程式碼中的 `165` 替換為你的螢幕刷新率。如果需要其他刷新率，請自行新增。

    > *此方案感謝 Amktiao 的指點。*

-----

## 10\. 修復鎖屏解鎖後偶爾鎖定 60Hz

移除 **`/vendor/build.prop`** 中所有 `dfps` 相關的程式碼。

-----

## 11\. 修復揚聲器破音

用音質正常的機型中的 **`/vendor/lib/soundfx/libvolumelistener.so`** 和 **`/vendor/lib64/soundfx/libvolumelistener.so`** 進行替換。

> **例如**: N9P 可以使用 Civi 的檔案。

-----

## 12\. 修復藍牙音量同步關閉後無法調節音量

**適用範圍**: MIUI A12 或更舊的底包。

1.  在任意分區的 `build.prop` 中新增 `ro.vendor.audio.policy.engine.odm=true`。
2.  找到以下位於 **`/vendor/etc/`** 的檔案，並將它們連結到 **`/odm/etc/`**：
      * `audio_policy_engine_configuration_mi.xml`
      * `audio_policy_engine_default_stream_volumes_mi.xml`
      * `audio_policy_engine_product_strategies_mi.xml`
      * `audio_policy_engine_stream_volumes_mi.xml`
      * `cit_param_config.json`

-----

## 13\. 修復多應用音量調節滑動異常

更換使用底包的音質音效。若無效，可嘗試使用多個不同 MIUI 版本的音質音效，直到找到可用的為止。

> **例如**: Note 9 Pro 使用 MIUI 14 A12 音質音效後，可修復此問題。

-----

## 14\. 恢復音質音效場景選擇開關

**適用範圍**: Mi 10、Mi 11 系列等官方澎湃系統已閹割此功能的機型。
在 **`/mi_ext/etc/build.prop`**、**`/odm/etc/build.prop`** 或 **`/vendor/build.prop`** 底部新增：
`ro.vendor.audio.sfx.scenario=true`

-----

## 15\. 修復哈曼卡頓音效

用支援哈曼卡頓的機型（如 Mix Fold）的澎湃包中的 **`/product/app/MiSound`** 進行替換。

> **注意**: 如果使用 MIUI 底包，切換到小米音效後再退出自動恢復為哈曼卡頓是正常現象，可更換回 MIUI 音質音效解決。

-----

## 16\. 修復亮度不足問題

1.  拆包 **`/product/overlay/AospFrameworkResOverlay.apk`**。
2.  在 `resources.arsc` → `integer` → `integer` 中，找到以下參數：
      * `config_screenBrightnessDim`
      * `config_screenBrightnessSettingDefault`
      * `config_screenBrightnessSettingMaximum`
      * `config_screenBrightnessSettingMinimum`
3.  在每個參數後面都加上 **`_hyper`**。

-----

## 17\. 修復 Cit

用底包中的 **`/product/app/MiuiCit`** 替換即可。

-----

## 18\. 修復 Cit 揚聲器校準

此修復需要根據你底包的配置進行調整。

1.  打開位於 **`/odm/etc/`** 的 `cit_param_config.json` 等檔案。
2.  根據 JSON 內容，確認揚聲器校準呼叫的是哪個可執行檔：
      * `spkcal -c` -\> 呼叫 `/system/bin/spkcal`
      * `spkcal_dagu -c` -\> 呼叫 `/system_ext/bin/spkcal_dagu`
      * `spkcal_88263s -c` -\> 呼叫 `/system_ext/bin/spkcal_88263s`
3.  **修復方式**:
      * **替換可執行檔**: 找到上述對應的可執行檔，並用可用的檔案替換。
      * **修改 JSON**: 將 `cit_param_config.json` 中的呼叫都改成 `spkcal -c` 和 `spkcal -m`，然後替換 `/system/bin/spkcal` 即可。

> **例如**: Mi 10S、K40、N9P、Mi 12X 等機型可以拆包小米 11 的澎湃系統，使用其 `spkcal_venus` 檔案（修改名稱後）進行替換。

-----

## 19\. 修復遊戲加速切換畫質失敗

打開 **`/vendor/etc/seccomp_policy/qspm.policy`**，在檔案底部新增以下程式碼：

```
gettimeofday: 1
renameat2: 1
```

-----

## 20\. 修復 SD 卡問題

若第三方應用無法讀取 SD 卡、相機無法儲存至 SD 卡或連接電腦後無法讀取 SD 卡，請打開 **`/product/etc/build.prop`**，並刪除以下程式碼後重啟：
`persist.sys.adoptable=force_off`

-----

## 21\. 修復部分震動丟失

**以 Note 9 Pro 為例**:

1.  拆包 Civi MIUI 14.0.6。
2.  找到 `/vendor/firmware/aw8622x_rtp.bin`，將其重新命名為 **`aw8624_rtp.bin`**。
3.  用修改後的檔案替換 Note 9 Pro 的 `/vendor/firmware/aw8624_rtp.bin`。

> *此方案僅供參考，其他機型請勿照搬。*

-----

## 22\. 修復 `cust` 分區

根據 `cust` 分區的格式進行調整：

  * **`cust` 為 EXT4 格式**: 刪除 `ro.miui.cust_erofs=1`。
  * **`cust` 為 EROFS 格式**: 新增 `ro.miui.cust_erofs=1`。

> **注意**: 8 Gen 3 及之後的新機型可能需要額外處理，請參考本機型 `/product/etc/build.prop` 中與 `cust` 相關的程式碼。

-----

## 23\. 修復 `millet` 效能優化

打開 **`/product/etc/build.prop`**，新增或修改以下程式碼：

```
persist.sys.powmillet.enable=true
persist.sys.brightmillet.enable=true
persist.sys.millet.handshake=true
persist.sys.millet.newversion=true
ro.millet.netlink=XX
```

> **注意**: `XX` 的數值會因機型而異，通常需參考底包或同處理器機型的數值。例如，**865、870、778、888** 等機型多為 **29**，而 **8+ Gen 1、7+ Gen 2** 等機型多為 **30**。此功能可能需要內核支援。

-----

## 24\. 修復煥新儲存

1.  更換官方 HyperOS 底層（HyperOS A13 亦可）。
2.  更換支援煥新儲存的內核。
3.  更換支援的**手機管家（安全服務）**，通常版本不要過舊。

> *修復完畢後，別忘了按時休息。*

-----

## 25\. 老機型修復低記憶體卡頓

**適用範圍**: 5.4 內核或更舊的設備。
打開 **`/product/etc/build.prop`**，新增或修改以下程式碼：

```
persist.sys.minfree_def=AA
persist.sys.minfree_6g=BB
persist.sys.minfree_8g=CC
```

> **注意**: `AA`、`BB`、`CC` 的數值因機型而異，請從底包或同處理器機型包中查找。
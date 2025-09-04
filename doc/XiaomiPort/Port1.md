# MIUI/HyperOS 移植指南：常見問題與修復

這份指南整理了在進行 MIUI 或 HyperOS 韌體移植時，可能遇到的問題及其解決方案。
> 此修復方案教學由 酷安眾多大佬提供，由 閃電Flashh 彙整，真摯感謝。

## 📌 移植核心概念

  * **Payload-Type 特性**：在 `super` 分割區中，每個邏輯分割區（如 `system`、`system_ext`、`product`、`mi_ext`）都有其特定標籤。移植時，需要將其他機型的這些邏輯分割區替換過來。
  * **分區合併**: 如果老機型缺少某些分區，可將其內容合併至 `system` 分割區。
  * **修復 VBMeta**: 由於更換了分區，必須修補 `vbmeta` 和 `vbmeta_system` 來移除 AVB 驗證，否則無法開機。

-----

## 📁 檔案系統與內核

  * **EROFS 格式**：
      * **小米 5.4 內核及以上**的裝置官方內核已支援 EROFS 格式，可直接打包。
      * **4.19 內核**通常不支援，需打包為 **EXT4 格式**，或更換支援的內核並補全 `fstab`。

-----

## 1\. 移植 8 Gen 3 或更新機型包卡一屏

從 8 Gen 2 或更舊機型的 HyperOS 中，提取以下檔案並補入：
`/system_ext/apex/com.android.vndk.v3X.apex`

## 2\. 老內核（4.x, 5.x 低版本）卡二屏

  * **現象**: 畫面卡在第二屏，但可能有聲音、震動或按鍵反應。

  * **修復**: 在 `/system_ext/etc/init` 路徑下新增一個空檔案 `init.gsi.rc`。

    > *此修復方案來自 Nazrin 和 皮神 i。*

## 3\. 修復 POCO 機型開機桌面崩潰

在任意分區的 `etc/build.prop` 中新增以下程式碼：

```
ro.miui.product.home=com.miui.home
ro.product.vendor.brand=Redmi
ro.product.odm.brand=Redmi
ro.product.vendor_dlkm.brand=Redmi
```

## 4\. 修復圓角與狀態列

用原機型的檔案替換以下路徑的檔案：<br>
`/product/overlay/DevicesOverlay.apk`<br>
`/product/overlay/DevicesAndroidOverlay.apk`

> **注意**: MIUI 12.5 A11 版本可能在 `vendor` 分區。最低只能使用 MIUI A13 的檔案，A12 或更老的版本需依新版格式修改，否則可能導致圓角錯位或充電動畫異常。

## 5\. 修復螢幕更新率

用原機型的檔案替換以下路徑的檔案：
`/product/etc/device_features/`

> **注意**: 老版本 MIUI 可能在 `/vendor/etc/device_features/` 或 `/system/etc/device_features/`。

## 6\. 修復核心分配

最簡單的方式是直接移植**同處理器架構**的機型。
或者，打開 `/product/etc/build.prop`，根據你機型官方的參數來修改以下屬性：

```
persist.sys.miui_animator_sched.bigcores=
persist.sys.miui_animator_sched.big_prime_cores=
persist.vendor.display.miui.composer_boost=
persist.sys.miui.sf_cores=
ro.miui.affinity.sfui=
ro.miui.affinity.sfre=
ro.miui.affinity.sfuirese=
```

> **原則**: 多的刪、少的補、不一樣的改。

## 7\. 修復人臉識別

用底包的檔案替換以下路徑的檔案：
`/product/app/Biometric/`<br>
`/product/overlay/MiuiBiometricResOverlay.apk` (如果存在)

> **注意**:
>
>   * 最低支援 MIUI A13。
>   * 如果底包過舊，可嘗試使用 8+ Gen 1 機型的檔案，可能可用，但初次錄入可能會有延遲。

## 8\. 修復微信/支付寶指紋支付

  * **適用範圍**: MIUI 14 安卓 12 或更老的底包。
  * **修復**: 從同代機型 MIUI 14 安卓 13 或更高版本，提取並替換以下路徑的檔案：
    `/vendor/app/SoterService/`<br>
    `/vendor/app/IFAAService/`

> *此方案來自欣戀。*

## 9\. 修復指紋樣式錯位

  * **舊樣式**: 如果是老指紋樣式，直接刪除 `/product/overlay/SettingsRroDeviceSystemUiOverlay.apk` 即可。
  * **蝴蝶樣式**: 從支援蝴蝶樣式的 HyperOS A14 機型中提取該檔案並補入。
  * **側邊指紋**: 刪除或保留此檔案皆可，不影響功能。

## 10\. 修復息屏顯示

  * **常規修復**:

    1.  拆包 `/product/overlay/DevicesAndroidOverlay.apk`。
    2.  找到 `resources.arsc`。
    3.  在 `com.miui.systemui.overlay.devices.android - string - string - config_dozeComponent` 中，將原值：
        `com.miui.aod/com.miui.aod.doze.DozeService`
    4.  修改為：
        `com.android.systemui/com.android.systemui.doze.DozeService`

  * **5.10 內核設備半殘修復**：

      * 以 Note 12 Turbo 1.0.2 為例，拆解 `vendor_dlkm` 和 `vendor_boot`。
      * 找到 `msm_drm.ko` 和 `msm_kgsl.ko` 這四個檔案。
      * 用其他可用的 ROM（如 N12T 歐版 OS 1.0.4）中的對應檔案替換。

## 11\. 修復自動亮度與閃屏

  * **自動亮度、手動亮度閃屏**：
      * 必須**同時替換**以下三個檔案，否則可能卡一屏：
        `/product/overlay/AospFrameworkResOverlay.apk`<br>
        `/product/overlay/MiuiFrameworkResOverlay.apk`<br>
        `/product/etc/displayconfig/`
  * **老機型自動亮度**：
    1.  使用終端輸入 `su`，再輸入 `dumpsys display`。
    2.  找到 **uniqueld** 後的 ID 值。
    3.  將 `/product/etc/displayconfig/display_id_數字.xml` 重新命名為 `display_id_上一步得到的ID值.xml`。
    4.  參考 Mi 10 系列參數修改 XML 內容。
    5.  最高亮度參數可從 `AospFrameworkResOverlay` 的 `config_autoBrightnessDisplayValuesNits` 中查找。

> **提示**: 部分機型（如 LCD 螢幕）的 display\_id 是 0。

## 12\. 修復相機

  * **常規修復**:

      * 用底包的檔案替換 `/product/priv-app/MiuiCamera/`。
      * 如果底包過老，可嘗試從 Civi 14.0.6、Mi 12X OS 1.0.2 或 Mi 11 青春活力 OS 1.0.1 中提取。

  * **徠卡水印**:

      * 在底包 `/product/overlay/` 中找到帶 `Leica` 關鍵字的 overlay 檔案，複製到移植包。

  * **第三方應用前攝泛白**：

      * **適用範圍**: K40 等機型。
      * **修復**: 拆包 `/product/overlay/MiuiFrameworkResOverlay.apk`，在 `resources.arsc` 的 `bool` 中新增：

    <!-- end list -->

    ```xml
    <bool name="config_frontcamera_circle_black">true</bool>
    ```

## 13\. 修復 DPI

在各分區的 `build.prop` 中新增或修改以下兩條屬性：

```
persist.miui.density_v2=
ro.sf.lcd_density=
```

  * **2K 螢幕**: 560
  * **1.5K 螢幕**: 480
  * **1080P 螢幕**: 440
  * **720P 螢幕**: 320

## 14\. 修復 NFC

  * **同安卓版本移植**: 替換 `/system/app/` (或 `/product/pangu/system/system/app/`) 下帶 `nfc` 關鍵字的資料夾。
  * **NFC 無法打開**:
      * 從同代可用 NFC 機型，替換 `/vendor/bin/`、`/vendor/lib/` 和 `/vendor/lib64/` 中相關的 `nfc` 檔案。
  * **NFC 打開但無法使用**:
      * 從同代可用 NFC 機型，替換 `/vendor/etc/` 中所有以 `libnfc` 開頭的檔案。

## 15\. 修復小米錢包與電子身份證

  * **智慧卡**: 在 `build.prop` 檔案底部（如 `/mi_ext/etc/build.prop`）新增：
    ```
    ro.vendor.se.type=HCE,UICC,eSE
    ```
  * **eID 公民網路電子身份證**: 從國行版 ROM 提取 `/vendor/app/` 下的 `EidService` 或 `EidService_V2` 資料夾並補入。

> **注意**: 並非所有機型都支援 eID。

好的，這是我將你提供的文字轉換為適合網頁閱讀的 Markdown 格式，並進行精簡、美化與優化後的內容。

---

## 16.修復挖孔螢幕狀態列突出問題

當螢幕挖孔區塊與狀態列高度不符時，可透過修改系統覆蓋包（Overlay）來調整。

1.  **拆包**:
    `/product/overlay/DevicesAndroidOverlay.apk`

2.  **修改狀態列高度**:
    * 在 `resources.arsc` → `dimen` 底下，找到所有 DPI 設定中的 `status_bar_height_default`。
    * 將其數值修改為合適的大小，直到狀態列不再突出。
    * 同時，將 `status_bar_height_portrait` 也修改為與 `status_bar_height_default` 相同的數值。

---

## 17.修復訊飛輸入法全面屏優化問題

此修復方案適用於 **MIUI 14 A12 或更舊的底包**，旨在解決訊飛輸入法在全螢幕模式下的顯示異常。

1.  **拆包**:
    `/product/overlay/DevicesAndroidOverlay.apk`

2.  **補全數值**:
    * 在 `resources.arsc` → `com.miui.systemui.overlay.devices.android` → `dimen` → `dimen` 路徑下，新增並設定以下數值：
        * `notification_min_height`: 設置為 **106dp**
        * `rounded_corner_radius`: 與本機型的 `rounded_corner_radius_bottom` 保持一致
        * `status_bar_height_default`: 與本機型的 `status_bar_height_portrait` 保持一致

3.  **依據 DPI 補齊**:
    * 返回 `com.miui.systemui.overlay.devices.android` → `dimen`。
    * 根據本機型螢幕解析度，補上對應的 DPI，例如 **1080p 設備需補上 `dimen-440dpi`**。
    * 從 `dimen-dimen` 中匯入以下資源到對應的 DPI 文件：
        * `rounded_corner_radius`
        * `rounded_corner_radius_bottom`
        * `rounded_corner_radius_top`
        * `status_bar_height_default`
        * `status_bar_height_portrait`
    * 確保所有 DPI 文件中的數值與 `dimen-dimen` 裡的數值一致。

---

## 18.修復應用權限提醒綠點顯示異常

當螢幕右上角的小綠點（應用權限提醒）顯示過小或位置不對時，可透過以下步驟修復。

1.  **調整狀態列高度（DevicesAndroidOverlay.apk）**:
    * **拆包**: `/product/overlay/DevicesAndroidOverlay.apk`
    * 在 `com.miui.systemui.overlay.devices.android` → `resources.arsc` → `dimen` 中，修改所有 DPI 的數值。
    * 將 `status_bar_height_default` 的數值調大，直到綠點圖示大小正常。
    * 將 `status_bar_height_portrait` 的數值也調整為與 `status_bar_height_default` 相同。

2.  **調整狀態列填充（DevicesOverlay.apk）**:
    * **拆包**: `/product/overlay/DevicesOverlay.apk`
    * 在 `com.miui.systemui.devices.overlay` → `resources.arsc` → `dimen` → `dimen-port` 中，找到 `status_bar_padding_top`。
    * 將此數值**減小**，減去的量與你在上一步調大的 `status_bar_height_default` 數值相同，以抵銷其影響。
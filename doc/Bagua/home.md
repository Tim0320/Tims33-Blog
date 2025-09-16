---
layout: page
# sidebar: false
outline: false
---

<div class="article-list">
<h1>  <font size=6> 免費易經解析 </font> </h1>
<p class="description">探索易經智慧，提供易經卦象解析工具</p>

  
  <!-- 模式切換開關 -->
  <div class="mode-selector">
    <div class="mode-switch-container">
      <label class="mode-switch-label">
        <div class="page-toggle-switch" :class="{ 'divination-mode': pageMode === 'divination' }" @click="togglePageMode">
          <div class="page-switch-slider" :class="{ 'switch-right': pageMode === 'divination' }"></div>
          <div class="switch-text left">搜尋模式</div>
          <div class="switch-text right">占卜模式</div>
        </div>
      </label>
    </div>
    <p class="mode-description">
      <span v-if="pageMode === 'search'">瀏覽所有易經卦象文章，使用分類和標籤進行篩選</span>
      <span v-else>使用傳統金錢八卦占卜方法，獲得卦象指引</span>
    </p>
  </div>
  
  <!-- 內容區域過渡動畫 -->
  <transition name="mode-fade" mode="out-in">
    <!-- 金錢八卦占卜系統 -->
    <div v-if="pageMode === 'divination'" class="divination-container" key="divination">
      <div class="two-column-layout">
        <!-- 左欄：金錢八卦選擇器 -->
        <div class="left-column">
          <div class="bagua-divination">
            <h3 class="divination-title">
              <i class="fas fa-coins"></i>
              金錢八卦占卜
            </h3>
          <!-- 模式切換開關 -->
          <div class="mode-switch">
            <label class="switch-label">
              <div class="toggle-switch" :class="{ 'coins-mode': divinationMode === 'coins' }" @click="toggleDivinationMode">
                <div class="switch-slider" :class="{ 'switch-right': divinationMode === 'coins' }"></div>
                <div class="switch-text right">金幣模式</div>
                <div class="switch-text left">陰陽模式</div>
              </div>
            </label>
          </div>
          <p class="divination-description">
            <span v-if="divinationMode === 'yinyang'">請按照從下到上的順序選擇6次陰陽爻的結果</span>
            <span v-else>請按照從下到上的順序，每爻投擲3個金幣並記錄正反面</span>
          </p>
          <div class="yao-selector">
            <div class="yao-grid">
              <div 
                v-for="(yao, index) in yaoSelections" 
                :key="'yao-' + index"
                class="yao-row"
              >
                <label class="yao-label">第{{ 6 - index }}爻：</label> 
                <!-- 陰陽模式 -->
                <div v-if="divinationMode === 'yinyang'" class="yao-buttons">
                  <button 
                    @click="selectYao(index, 'yang')"
                    :class="['yao-btn', 'yang-btn', { active: yao === 'yang' }]"
                  >
                    陽爻 ⚊
                  </button>
                  <button 
                    @click="selectYao(index, 'yin')"
                    :class="['yao-btn', 'yin-btn', { active: yao === 'yin' }]"
                  >
                    陰爻 ⚋
                  </button>
                </div>
                <!-- 金幣模式 -->
                <div v-else class="coin-selection">
                  <div class="coin-display">
                    <span class="yao-result">{{ yao ? (yao === 'yang' ? '陽爻 ⚊' : '陰爻 ⚋') : '未完成' }}</span>
                    <div class="coins-container">
                      <button 
                        v-for="(coin, coinIndex) in coinSelections[index]" 
                        :key="'coin-' + coinIndex"
                        @click="toggleCoin(index, coinIndex)"
                        :class="['coin-btn', { 'tails': coin === 'tails' }]"
                      >
                        {{ coin === 'tails' ? '反面' : '正面' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右欄：卦象結果和操作按鈕 -->
      <div class="right-column">
        <!-- 卦象結果區域 -->
        <div class="hexagram-result-container">
          <div v-if="currentHexagram" class="hexagram-result">
            <div class="hexagram-info">
              <h4><font size=5>占卜結果：{{ currentHexagram.name }}&nbsp;/&nbsp;{{ currentHexagram.symbol }}&nbsp;{{ currentHexagram.description }}</font></h4>
              <div class="hexagram-details">
                <p><strong>卦序：</strong>第{{ currentHexagram.number }}卦</p>
                <p><strong>二進制編碼：</strong>{{ getBinaryString() }}</p>
              </div>
            </div>
          </div>
          <div v-else class="hexagram-placeholder">
            <div class="placeholder-content">
              <i class="fas fa-yin-yang"></i>
              <p>選擇完成6爻後將顯示卦象</p>
            </div>
          </div>
        </div>
        <!-- 操作按鈕區域 -->
        <div class="divination-actions">
          <button 
            @click="clearYaoSelections"
            class="action-btn clear-btn"
          >
            <i class="fas fa-undo"></i>
            重新選擇
          </button>
          <button 
            @click="searchByDivination"
            :disabled="!isAllYaoSelected"
            :class="['action-btn', 'search-btn', { disabled: !isAllYaoSelected }]"
          >
            <i class="fas fa-book-open"></i>
            查看卦象解析
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 搜尋模式內容 -->
  <div v-else class="search-mode-container" key="search">
    <div class="search-box">
      <div class="search-input-container">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="搜尋文章標題或標籤..." 
          class="search-input"
        />
        <button 
          @click="showCategories = !showCategories; showTags = !showTags"
          :class="['control-btn', { active: showCategories || showTags }]"
        >
          <span class="btn-icon">
            <i :class="(showCategories || showTags) ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'"></i>
          </span>
          分類
        </button>
      </div>
    </div>
    <div class="filter-section">
      <!-- 分類過濾器 -->
      <div class="filter-group" v-if="showCategories && allCategories && allCategories.length > 0">
        <h4 class="filter-title">上下卦名分類</h4>
        <div class="filter-tags">
          <button 
            v-for="category in allCategories" 
            :key="'cat-' + category"
            @click="toggleTag(category)"
            :class="['tag-filter', 'category-filter', { active: selectedTags.includes(category) }]"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <!-- 標籤過濾器 -->
      <div class="filter-group" v-if="showTags && allTags && allTags.length > 0">
        <h4 class="filter-title">下上先天數分類</h4>
        <div class="filter-tags">
          <button 
            v-for="tag in allTags" 
            :key="'tag-' + tag"
            @click="toggleTag(tag)"
            :class="['tag-filter', 'tags-filter', { active: selectedTags.includes(tag) }]"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="articles.length > 0 && filteredArticles.length > 0" class="articles-grid">
      <div 
        v-for="article in filteredArticles" 
        :key="article.path || article.title"
        class="article-card"
        @click="navigateToArticle(article.path)"
      >
        <div class="article-image">
          <img :src="article.img || '/Tims33-Blog/test.jpg'" :alt="article.title || '文章圖片'" />
        </div>
    <div class="article-content">
      <h3 class="article-title">{{ article.title || '無標題' }}</h3>
      
  <div class="article-meta">
    <span class="author">{{ article.author || 'Tims33' }} &nbsp;||&nbsp; {{ formatDate(article.date) }}</span>
  </div>
  <div class="article-tags">
    <span 
      v-for="cat in (article.category || '').split(' ').filter(t => t.trim())" 
      :key="'cat-' + cat"
      class="tag category"
    >
      {{ cat }}
    </span>
    <span 
      v-for="tag in (article.tags || '').split(' ').filter(t => t.trim())" 
      :key="'tag-' + tag"
      class="tag secondary"
    >
      {{ tag }}
    </span>
  </div>
  <p class="article-description">{{ article.description || '暫無描述' }}</p>

  </div>
  </div>
    </div>
    <div v-if="articles.length > 0 && filteredArticles.length === 0" class="no-results">
      <p>沒有找到符合條件的文章</p>
    </div>
  </div>
  </transition>
</div>



<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const searchTerm = ref('')
const selectedTags = ref([])
const showCategories = ref(true) // 分類顯示開關
const showTags = ref(true) // 標籤顯示開關

// 立即載入保存的狀態（避免閃爍效果）
const getInitialPageMode = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('easternDivination_pageMode')
    return (saved && ['search', 'divination'].includes(saved)) ? saved : 'search'
  }
  return 'search'
}

const getInitialDivinationMode = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('easternDivination_divinationMode')
    return (saved && ['yinyang', 'coins'].includes(saved)) ? saved : 'yinyang'
  }
  return 'yinyang'
}

// 頁面模式狀態 - 直接使用保存的狀態初始化
const pageMode = ref(getInitialPageMode()) // 'search' 或 'divination'

const saveState = (key, value) => {
  localStorage.setItem(`easternDivination_${key}`, value)
}

// 切換頁面模式
const togglePageMode = () => {
  pageMode.value = pageMode.value === 'search' ? 'divination' : 'search'
  saveState('pageMode', pageMode.value)
}

// 固定的易經64卦文章數據
const articles = ref([
  { path: '/doc/Bagua/乾', title: '乾', author: 'Tims33', category: '乾 乾', description: '第一卦', tags: '一 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/坤', title: '坤', author: 'Tims33', category: '坤 坤', description: '第二卦', tags: '八 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/屯', title: '屯', author: 'Tims33', category: '坎 震', description: '第三卦', tags: '六 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/蒙', title: '蒙', author: 'Tims33', category: '艮 坎', description: '第四卦', tags: '七 六', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/需', title: '需', author: 'Tims33', category: '坎 乾', description: '第五卦', tags: '六 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/訟', title: '訟', author: 'Tims33', category: '乾 坎', description: '第六卦', tags: '一 六', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/師', title: '師', author: 'Tims33', category: '坤 坎', description: '第七卦', tags: '八 六', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/比', title: '比', author: 'Tims33', category: '坎 坤', description: '第八卦', tags: '六 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/小畜', title: '小畜', author: 'Tims33', category: '巽 乾', description: '第九卦', tags: '五 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/履', title: '履', author: 'Tims33', category: '乾 兌', description: '第十卦', tags: '一 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/泰', title: '泰', author: 'Tims33', category: '坤 乾', description: '第十一卦', tags: '八 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/否', title: '否', author: 'Tims33', category: '乾 坤', description: '第十二卦', tags: '一 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/同人', title: '同人', author: 'Tims33', category: '乾 離', description: '第十三卦', tags: '一 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/大有', title: '大有', author: 'Tims33', category: '離 乾', description: '第十四卦', tags: '三 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/謙', title: '謙', author: 'Tims33', category: '坤 艮', description: '第十五卦', tags: '八 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/豫', title: '豫', author: 'Tims33', category: '震 坤', description: '第十六卦', tags: '四 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/隨', title: '隨', author: 'Tims33', category: '兌 震', description: '第十七卦', tags: '二 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/蠱', title: '蠱', author: 'Tims33', category: '艮 巽', description: '第十八卦', tags: '七 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/臨', title: '臨', author: 'Tims33', category: '坤 兌', description: '第十九卦', tags: '八 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/觀', title: '觀', author: 'Tims33', category: '巽 坤', description: '第二十卦', tags: '五 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/噬嗑', title: '噬嗑', author: 'Tims33', category: '離 震', description: '第二十一卦', tags: '三 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/賁', title: '賁', author: 'Tims33', category: '艮 離', description: '第二十二卦', tags: '七 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/剝', title: '剝', author: 'Tims33', category: '艮 坤', description: '第二十三卦', tags: '七 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/復', title: '復', author: 'Tims33', category: '坤 震', description: '第二十四卦', tags: '八 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/无妄', title: '无妄', author: 'Tims33', category: '乾 震', description: '第二十五卦', tags: '一 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/大畜', title: '大畜', author: 'Tims33', category: '艮 乾', description: '第二十六卦', tags: '七 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/頤', title: '頤', author: 'Tims33', category: '艮 震', description: '第二十七卦', tags: '七 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/大過', title: '大過', author: 'Tims33', category: '兌 巽', description: '第二十八卦', tags: '二 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/坎', title: '坎', author: 'Tims33', category: '坎 坎', description: '第二十九卦', tags: '六 六', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/離', title: '離', author: 'Tims33', category: '離 離', description: '第三十卦', tags: '三 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/咸', title: '咸', author: 'Tims33', category: '兌 艮', description: '第三十一卦', tags: '二 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/恒', title: '恒', author: 'Tims33', category: '震 巽', description: '第三十二卦', tags: '四 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/遯', title: '遯', author: 'Tims33', category: '乾 艮', description: '第三十三卦', tags: '一 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/大壯', title: '大壯', author: 'Tims33', category: '震 乾', description: '第三十四卦', tags: '四 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/晉', title: '晉', author: 'Tims33', category: '離 坤', description: '第三十五卦', tags: '三 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/明夷', title: '明夷', author: 'Tims33', category: '坤 離', description: '第三十六卦', tags: '八 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/家人', title: '家人', author: 'Tims33', category: '巽 離', description: '第三十七卦', tags: '五 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/睽', title: '睽', author: 'Tims33', category: '離 兌', description: '第三十八卦', tags: '三 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/蹇', title: '蹇', author: 'Tims33', category: '坎 艮', description: '第三十九卦', tags: '六 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/解', title: '解', author: 'Tims33', category: '震 坎', description: '第四十卦', tags: '四 六', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/損', title: '損', author: 'Tims33', category: '艮 兌', description: '第四十一卦', tags: '七 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/益', title: '益', author: 'Tims33', category: '巽 震', description: '第四十二卦', tags: '五 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/夬', title: '夬', author: 'Tims33', category: '兌 乾', description: '第四十三卦', tags: '二 一', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/姤', title: '姤', author: 'Tims33', category: '乾 巽', description: '第四十四卦', tags: '一 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/萃', title: '萃', author: 'Tims33', category: '兌 坤', description: '第四十五卦', tags: '二 八', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/升', title: '升', author: 'Tims33', category: '坤 巽', description: '第四十六卦', tags: '八 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/困', title: '困', author: 'Tims33', category: '兌 坎', description: '第四十七卦', tags: '二 六', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/井', title: '井', author: 'Tims33', category: '坎 巽', description: '第四十八卦', tags: '六 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/革', title: '革', author: 'Tims33', category: '兌 離', description: '第四十九卦', tags: '二 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/鼎', title: '鼎', author: 'Tims33', category: '離 巽', description: '第五十卦', tags: '三 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/震', title: '震', author: 'Tims33', category: '震 震', description: '第五十一卦', tags: '四 四', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/艮', title: '艮', author: 'Tims33', category: '艮 艮', description: '第五十二卦', tags: '七 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/漸', title: '漸', author: 'Tims33', category: '巽 艮', description: '第五十三卦', tags: '五 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/歸妹', title: '歸妹', author: 'Tims33', category: '震 兌', description: '第五十四卦', tags: '四 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/豐', title: '豐', author: 'Tims33', category: '震 離', description: '第五十五卦', tags: '四 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/旅', title: '旅', author: 'Tims33', category: '離 艮', description: '第五十六卦', tags: '三 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/巽', title: '巽', author: 'Tims33', category: '巽 巽', description: '第五十七卦', tags: '五 五', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/兌', title: '兌', author: 'Tims33', category: '兌 兌', description: '第五十八卦', tags: '二 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/渙', title: '渙', author: 'Tims33', category: '巽 坎', description: '第五十九卦', tags: '五 六', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/節', title: '節', author: 'Tims33', category: '坎 兌', description: '第六十卦', tags: '六 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/中孚', title: '中孚', author: 'Tims33', category: '巽 兌', description: '第六十一卦', tags: '五 二', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/小過', title: '小過', author: 'Tims33', category: '震 艮', description: '第六十二卦', tags: '四 七', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/既濟', title: '既濟', author: 'Tims33', category: '坎 離', description: '第六十三卦', tags: '六 三', date: '2025-01-01', img: null },
  { path: '/doc/Bagua/未濟', title: '未濟', author: 'Tims33', category: '離 坎', description: '第六十四卦', tags: '三 六', date: '2025-01-01', img: null }
])

// 金錢八卦相關狀態
const yaoSelections = ref([null, null, null, null, null, null]) // 6爻選擇 (從下到上)
const currentHexagram = ref(null)
const divinationMode = ref(getInitialDivinationMode()) // 直接使用保存的狀態初始化
const coinSelections = ref(Array(6).fill(null).map(() => ['heads', 'heads', 'heads'])) // 6爻，每爻3個金幣，預設為正面

// 64卦對照表 (根據二進制編碼：陽爻=1, 陰爻=0)
const hexagramMap = {
  '111111': { name: '乾', symbol: '䷀', number: 1, description: '天' },
  '000000': { name: '坤', symbol: '䷁', number: 2, description: '地' },
  '100010': { name: '屯', symbol: '䷂', number: 3, description: '水雷屯' },
  '010001': { name: '蒙', symbol: '䷃', number: 4, description: '山水蒙' },
  '111010': { name: '需', symbol: '䷄', number: 5, description: '水天需' },
  '010111': { name: '訟', symbol: '䷅', number: 6, description: '天水訟' },
  '010000': { name: '師', symbol: '䷆', number: 7, description: '地水師' },
  '000010': { name: '比', symbol: '䷇', number: 8, description: '水地比' },
  '111011': { name: '小畜', symbol: '䷈', number: 9, description: '風天小畜' },
  '110111': { name: '履', symbol: '䷉', number: 10, description: '天澤履' },
  '111000': { name: '泰', symbol: '䷊', number: 11, description: '地天泰' },
  '000111': { name: '否', symbol: '䷋', number: 12, description: '天地否' },
  '101111': { name: '同人', symbol: '䷌', number: 13, description: '天火同人' },
  '111101': { name: '大有', symbol: '䷍', number: 14, description: '火天大有' },
  '001000': { name: '謙', symbol: '䷎', number: 15, description: '地山謙' },
  '000100': { name: '豫', symbol: '䷏', number: 16, description: '雷地豫' },
  '100110': { name: '隨', symbol: '䷐', number: 17, description: '澤雷隨' },
  '011001': { name: '蠱', symbol: '䷑', number: 18, description: '山風蠱' },
  '110000': { name: '臨', symbol: '䷒', number: 19, description: '地澤臨' },
  '000011': { name: '觀', symbol: '䷓', number: 20, description: '風地觀' },
  '100101': { name: '噬嗑', symbol: '䷔', number: 21, description: '火雷噬嗑' },
  '101001': { name: '賁', symbol: '䷕', number: 22, description: '山火賁' },
  '000001': { name: '剝', symbol: '䷖', number: 23, description: '山地剝' },
  '100000': { name: '復', symbol: '䷗', number: 24, description: '地雷復' },
  '100111': { name: '無妄', symbol: '䷘', number: 25, description: '天雷無妄' },
  '111001': { name: '大畜', symbol: '䷙', number: 26, description: '山天大畜' },
  '100001': { name: '頤', symbol: '䷚', number: 27, description: '山雷頤' },
  '011110': { name: '大過', symbol: '䷛', number: 28, description: '澤風大過' },
  '010010': { name: '坎', symbol: '䷜', number: 29, description: '水' },
  '101101': { name: '離', symbol: '䷝', number: 30, description: '火' },
  '001110': { name: '咸', symbol: '䷞', number: 31, description: '澤山咸' },
  '011100': { name: '恆', symbol: '䷟', number: 32, description: '雷風恆' },
  '001111': { name: '遯', symbol: '䷠', number: 33, description: '天山遯' },
  '111100': { name: '大壯', symbol: '䷡', number: 34, description: '雷天大壯' },
  '000101': { name: '晉', symbol: '䷢', number: 35, description: '火地晉' },
  '101000': { name: '明夷', symbol: '䷣', number: 36, description: '地火明夷' },
  '101011': { name: '家人', symbol: '䷤', number: 37, description: '風火家人' },
  '110101': { name: '睽', symbol: '䷥', number: 38, description: '火澤睽' },
  '001010': { name: '蹇', symbol: '䷦', number: 39, description: '水山蹇' },
  '010100': { name: '解', symbol: '䷧', number: 40, description: '雷水解' },
  '110001': { name: '損', symbol: '䷨', number: 41, description: '山澤損' },
  '100011': { name: '益', symbol: '䷩', number: 42, description: '風雷益' },
  '111110': { name: '夬', symbol: '䷪', number: 43, description: '澤天夬' },
  '011111': { name: '姤', symbol: '䷫', number: 44, description: '天風姤' },
  '000110': { name: '萃', symbol: '䷬', number: 45, description: '澤地萃' },
  '011000': { name: '升', symbol: '䷭', number: 46, description: '地風升' },
  '010110': { name: '困', symbol: '䷮', number: 47, description: '澤水困' },
  '011010': { name: '井', symbol: '䷯', number: 48, description: '水風井' },
  '101110': { name: '革', symbol: '䷰', number: 49, description: '澤火革' },
  '011101': { name: '鼎', symbol: '䷱', number: 50, description: '火風鼎' },
  '100100': { name: '震', symbol: '䷲', number: 51, description: '雷' },
  '001001': { name: '艮', symbol: '䷳', number: 52, description: '山' },
  '001011': { name: '漸', symbol: '䷴', number: 53, description: '風山漸' },
  '110100': { name: '歸妹', symbol: '䷵', number: 54, description: '雷澤歸妹' },
  '101100': { name: '豐', symbol: '䷶', number: 55, description: '雷火豐' },
  '001101': { name: '旅', symbol: '䷷', number: 56, description: '火山旅' },
  '011011': { name: '巽', symbol: '䷸', number: 57, description: '風' },
  '110110': { name: '兌', symbol: '䷹', number: 58, description: '澤' },
  '010011': { name: '渙', symbol: '䷺', number: 59, description: '風水渙' },
  '110010': { name: '節', symbol: '䷻', number: 60, description: '水澤節' },
  '110011': { name: '中孚', symbol: '䷼', number: 61, description: '風澤中孚' },
  '001100': { name: '小過', symbol: '䷽', number: 62, description: '雷山小過' },
  '101010': { name: '既濟', symbol: '䷾', number: 63, description: '水火既濟' },
  '010101': { name: '未濟', symbol: '䷿', number: 64, description: '火水未濟' }
}

// 檢查是否所有爻都已選擇
const isAllYaoSelected = computed(() => {
  if (divinationMode.value === 'yinyang') {
    return yaoSelections.value.every(yao => yao !== null)
  } else {
    return coinSelections.value.every(coins => coins.every(coin => coin !== null))
  }
})

// 切換占卜模式
const toggleDivinationMode = () => {
  divinationMode.value = divinationMode.value === 'yinyang' ? 'coins' : 'yinyang'
  saveState('divinationMode', divinationMode.value)
  clearAllSelections()
}

// 切換金幣正反面
const toggleCoin = (yaoIndex, coinIndex) => {
  const current = coinSelections.value[yaoIndex][coinIndex]
  coinSelections.value[yaoIndex][coinIndex] = current === 'heads' ? 'tails' : 'heads'
  
  // 立即計算該爻的結果
  const yaoResult = calculateYaoFromCoins(coinSelections.value[yaoIndex])
  yaoSelections.value[yaoIndex] = yaoResult
  
  // 檢查是否所有爻都完成，自動計算卦象
  if (isAllYaoSelected.value) {
    calculateHexagram()
  }
}

// 根據三個金幣的正反面計算爻
const calculateYaoFromCoins = (coins) => {
  // 傳統金錢卦規則：
  // 3個正面 = 老陽 (陽爻)
  // 2個正面1個反面 = 少陰 (陰爻)
  // 1個正面2個反面 = 少陽 (陽爻)
  // 3個反面 = 老陰 (陰爻)
  const heads = coins.filter(coin => coin === 'heads').length
  
  if (heads === 3 || heads === 1) {
    return 'yang' // 陽爻
  } else {
    return 'yin'  // 陰爻
  }
}

// 選擇爻
const selectYao = (index, type) => {
  yaoSelections.value[index] = type
  
  // 如果所有爻都選擇了，自動計算卦象
  if (isAllYaoSelected.value) {
    calculateHexagram()
  }
}

// 清空選擇
const clearYaoSelections = () => {
  clearAllSelections()
}

// 清空所有選擇
const clearAllSelections = () => {
  yaoSelections.value = [null, null, null, null, null, null]
  coinSelections.value = Array(6).fill(null).map(() => ['heads', 'heads', 'heads']) // 重置為預設正面
  currentHexagram.value = null
  
  // 如果是金幣模式，立即計算所有爻的結果
  if (divinationMode.value === 'coins') {
    coinSelections.value.forEach((coins, index) => {
      const yaoResult = calculateYaoFromCoins(coins)
      yaoSelections.value[index] = yaoResult
    })
    calculateHexagram()
  }
}

// 計算卦象
const calculateHexagram = () => {
  // 將爻選擇轉換為二進制字串 (陽爻=1, 陰爻=0)
  const binaryString = yaoSelections.value
    .map(yao => yao === 'yang' ? '1' : '0')
    .join('')
  
  // 查找對應的卦象
  const hexagram = hexagramMap[binaryString]
  if (hexagram) {
    currentHexagram.value = hexagram
  }
}

// 根據占卜結果搜尋文章
const searchByDivination = () => {
  if (currentHexagram.value) {
    try {
      // 導航到對應的卦象文章頁面
      const hexagramTitle = currentHexagram.value.name // 使用 name 屬性作為 title
      
      // 檢查是否在 VitePress 環境中
      if (typeof window !== 'undefined') {
        // 使用相對路徑進行導航
        window.location.href = `./${hexagramTitle}`
      }
    } catch (error) {
      console.error('導航錯誤:', error)
      alert(`準備查看 ${currentHexagram.value.name} 卦的詳細解析`)
    }
  } else {
    alert('請先完成占卜選擇')
  }
}

// 獲取二進制字串（用於調試）
const getBinaryString = () => {
  return yaoSelections.value
    .map(yao => yao === 'yang' ? '1' : yao === 'yin' ? '0' : '?')
    .join('')
}

// 計算所有分類
const allCategories = computed(() => {
  if (!articles.value || articles.value.length === 0) {
    return []
  }
  
  const categories = new Set()
  
  articles.value.forEach(article => {
    if (article && article.category) {
      // category 可能包含多個分類，用空格分隔
      article.category.split(' ').forEach(cat => {
        if (cat.trim()) categories.add(cat.trim())
      })
    }
  })
  
  // 八卦順序排列
  const baguaOrder = ['乾', '坤', '震', '離', '坎', '兌', '巽', '艮']
  const categoryArray = Array.from(categories)
  
  return categoryArray.sort((a, b) => {
    const indexA = baguaOrder.indexOf(a)
    const indexB = baguaOrder.indexOf(b)
    
    // 如果都是八卦，按順序排列
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    
    // 如果只有一個是八卦，八卦排在前面
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    // 如果都不是八卦，按字母順序
    return a.localeCompare(b)
  })
})

// 計算所有標籤
const allTags = computed(() => {
  if (!articles.value || articles.value.length === 0) {
    return []
  }
  
  const tags = new Set()
  
  articles.value.forEach(article => {
    if (article && article.tags) {
      // tags 用空格分隔多個標籤
      article.tags.split(' ').forEach(tag => {
        if (tag.trim()) tags.add(tag.trim())
      })
    }
  })
  
  // 國字數字順序排列
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  const tagArray = Array.from(tags)
  
  return tagArray.sort((a, b) => {
    const indexA = chineseNumbers.indexOf(a)
    const indexB = chineseNumbers.indexOf(b)
    
    // 如果都是國字數字，按順序排列
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    
    // 如果只有一個是國字數字，國字數字排在前面
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    // 如果都不是國字數字，按字母順序
    return a.localeCompare(b)
  })
})

// 過濾文章
const filteredArticles = computed(() => {
  if (!articles.value || articles.value.length === 0) {
    return []
  }
  
  let filtered = articles.value
  
  // 按搜尋詞過濾
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(article =>
      (article.title && article.title.toLowerCase().includes(term)) ||
      (article.description && article.description.toLowerCase().includes(term)) ||
      (article.tags && article.tags.toLowerCase().includes(term))
    )
  }
  
  // 按選中的標籤過濾 (AND邏輯：必須包含所有選中的標籤)
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(article => {
      const articleTags = []
      // 將 category 中的所有分類加入
      if (article.category) {
        articleTags.push(...article.category.split(' ').filter(t => t.trim()))
      }
      // 將 tags 中的所有標籤加入
      if (article.tags) {
        articleTags.push(...article.tags.split(' ').filter(t => t.trim()))
      }
      // 檢查是否包含所有選中的標籤 (AND邏輯)
      return selectedTags.value.every(tag => articleTags.includes(tag))
    })
  }
  
  // 按易經六十四卦順序排序
  const hexagramOrder = [
    '乾', '坤', '屯', '蒙', '需', '訟', '師', '比', '小畜', '履',
    '泰', '否', '同人', '大有', '謙', '豫', '隨', '蠱', '臨', '觀',
    '噬嗑', '賁', '剝', '復', '无妄', '大畜', '頤', '大過', '坎', '離',
    '咸', '恒', '遯', '大壯', '晉', '明夷', '家人', '睽', '蹇', '解',
    '損', '益', '夬', '姤', '萃', '升', '困', '井', '革', '鼎',
    '震', '艮', '漸', '歸妹', '豐', '旅', '巽', '兌', '渙', '節',
    '中孚', '小過', '既濟', '未濟'
  ]
  
  filtered = filtered.sort((a, b) => {
    // 提取文章標題中的卦名
    const getHexagramName = (title) => {
      if (!title) return ''
      // 移除可能的序號和符號，提取純卦名
      const cleanTitle = title.replace(/^第.*?卦\s*-?\s*/, '').replace(/\s*[☯️䷀-䷿🔥💧].*$/, '').trim()
      return cleanTitle
    }
    
    const hexagramA = getHexagramName(a.title)
    const hexagramB = getHexagramName(b.title)
    
    const indexA = hexagramOrder.indexOf(hexagramA)
    const indexB = hexagramOrder.indexOf(hexagramB)
    
    // 如果都是易經卦名，按六十四卦順序排列
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    
    // 如果只有一個是易經卦名，卦名排在前面
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    // 如果都不是易經卦名，按標題字母順序
    return (a.title || '').localeCompare(b.title || '')
  })
  
  return filtered
})

// 切換標籤選擇
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

// 導航到文章
const navigateToArticle = (path) => {
  // 從路徑中提取卦名，例如從 '/doc/Bagua/乾' 提取 '乾'
  const hexagramName = path.split('/').pop()
  
  // 使用相對路徑導航
  if (typeof window !== 'undefined') {
    window.location.href = `./${hexagramName}`
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style scoped>
/* 狀態記錄顯示樣式 */







/* 頁面模式切換過渡動畫 */
.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: all 0.4s ease;
}

.mode-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.mode-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.mode-fade-enter-to,
.mode-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 搜尋模式容器樣式 */
.search-mode-container {
  animation: slideInUp 0.4s ease-out;
}

/* 占卜容器額外動畫 */
.divination-container {
  animation: slideInDown 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.article-list h1 {
  text-align: center;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.description {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* 頁面模式切換器樣式 */
.mode-selector {
  margin-bottom: 0.5rem;
  margin-top: -1rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 0.5px solid var(--vp-c-border);
  text-align: center;
}

.mode-switch-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.mode-switch-label {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.page-toggle-switch {
  position: relative;
  width: 280px;
  height: 50px;
  background: var(--vp-c-border);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border: 2px solid var(--vp-c-border);
  overflow: hidden;
}

.page-toggle-switch.divination-mode {
  background: var(--vp-c-border);
}

.page-switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(50% - 2px);
  height: calc(100% - 4px);
  background: linear-gradient(45deg, #8e44ad, #9b59b6);
  border-radius: 23px;
  transition: transform 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 2;
}

.page-switch-slider.switch-right {
  transform: translateX(100%);
  background: linear-gradient(45deg, #27ae60, #2ecc71);
}

/* 文字標籤樣式 */
.page-toggle-switch .switch-text {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  z-index: 3;
  pointer-events: none;
}

.page-toggle-switch .switch-text.left {
  left: 0;
  color: white;
}

.page-toggle-switch .switch-text.right {
  right: 0;
  color: var(--vp-c-text-2);
}

.page-toggle-switch.divination-mode .switch-text.left {
  color: var(--vp-c-text-2);
}

.page-toggle-switch.divination-mode .switch-text.right {
  color: white;
}

.mode-description {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
}

.search-box {
  margin-bottom: 1.5rem;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 8rem 0.75rem 1rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.filter-section {
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-controls {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.control-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 10;
  min-width: 4rem;
  justify-content: center;
}

.control-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.control-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.btn-icon {
  font-size: 0.7rem;
  transition: transform 0.3s;
}

.filter-group {
  width: calc(42% - 0.5rem);
  margin: 0 auto;
}

.filter-title {
  font-size: 1.3rem ;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
  border-left: 4px solid var(--vp-c-brand-1);
  padding-left: 1rem;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-filter {
  padding: 0.3rem 1rem;
  border: 2px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.tag-filter:hover {
  border-color: var(--vp-c-brand-1);
}

.tag-filter.active {
  color: white;
  border-color: var(--vp-c-brand-1);
}

/* 分類按鈕樣式 */
.category-filter {
  background: var(--vp-c-bg);
  border-color: #e67e22;
}

.category-filter:hover {
  border-color: #d35400;
}

.category-filter.active {
  background: #e67e22;
  border-color: #e67e22;
}

/* 標籤按鈕樣式 */
.tags-filter {
  background: var(--vp-c-bg);
  border-color: #3498db;
}

.tags-filter:hover {
  border-color: #2980b9;
}

.tags-filter.active {
  background: #3498db;
  border-color: #3498db;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.article-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  background: var(--vp-c-bg);
  display: inline-flex;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: var(--vp-c-brand-1);
}

.article-image {
  width: 30%;
  height: auto;
  object-fit: cover;
  overflow: hidden;
  padding-left:10px;
  margin:auto 0;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  width:100%;
  padding: 1.5rem;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.article-description {
  color: var(--vp-c-text-2);
  line-height: 2;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tag.category {
  background: var(--vp-c-brand-1);
  color: white;
}

.tag.secondary {
  background: var(--vp-c-gray-light);
  color: var(--vp-c-text-2);
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

/* 中等螢幕優化 */
@media (max-width: 992px) and (min-width: 769px) {
  .coin-btn {
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
    min-width: 3.5rem;
  }
  
  .coins-container {
    gap: 0.3rem;
    padding: 0 2% 0 0;
  }
}

@media (max-width: 768px) {
  .article-list {
    padding: 1rem;
  }
  
  /* 頁面模式切換器響應式 */
  .mode-selector {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .page-toggle-switch {
    width: 220px;
    height: 45px;
  }
  
  .page-toggle-switch .switch-text {
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .mode-description {
    font-size: 0.8rem;
  }
  
  .search-input {
    padding: 0.65rem 6rem 0.65rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .control-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    min-width: 3.5rem;
  }
  
  .btn-icon {
    font-size: 0.6rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-controls {
    justify-content: flex-start;
    margin-bottom: 1rem;
  }
  
  /* 當螢幕寬度不足以容納所有tag-filter時，改為四個一行 */
  .filter-tags {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2rem;
    justify-items: stretch;
    align-items: center;
  }
  
  .tag-filter {
    /* 保持原本的padding，不調整 */
    padding: 0.3rem 1rem;
    font-size: 0.75rem;
    text-align: center;
    border-radius: 15px;
    min-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    /* 調整文字大小以適應較小的空間 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-group {
    width: calc(50% - 0.5rem);
  }
  
  /* 當標籤數量較多時，改為四個一行 */
  .filter-tags {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.3rem;
    justify-items: stretch;
    align-items: center;
  }
  
  .tag-filter {
    padding: 0.3rem 1rem;
    font-size: 0.8rem;
    text-align: center;
    min-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (min-width: 1025px) and (max-width: 1366px) {
  .articles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 金錢八卦占卜系統樣式 */
.divination-container {
  padding: 1rem 2rem 1rem 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);

}

/* 左右欄版面 */
.two-column-layout {
  display: flex;
  gap: 2rem;
  align-items: stretch-start;

}

.left-column {
  flex: 1;
  min-width: 35%;
}

.right-column {
  flex: 0 0 35%;
  min-width: 35%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top:5%;
}

/* 卦象結果容器 */
.hexagram-result-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 卦象佔位符 */
.hexagram-placeholder {
  background: var(--vp-c-bg-soft);
  border: 2px dashed var(--vp-c-border);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.placeholder-content i {
  font-size: 2rem;
  opacity: 0.5;
}

.placeholder-content p {
  margin: 0;
  font-size: 0.9rem;
}

/* 金錢八卦選擇器樣式 */
.bagua-divination {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 1em 1rem 0rem 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.divination-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  justify-content: center;
}

/* 模式切換開關樣式 */
.mode-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.switch-label {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  width: 200px;
  height: 40px;
  background: var(--vp-c-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border: 2px solid var(--vp-c-border);
  overflow: hidden;
}

.toggle-switch.coins-mode {
  background: var(--vp-c-border);
}

.switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(50% - 2px);
  height: calc(100% - 4px);
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  border-radius: 18px;
  transition: transform 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 2;
}

.switch-slider.switch-right {
  transform: translateX(100%);
  background: linear-gradient(45deg, #4dabf7, #1c7ed6);
}

/* 占卜模式切換器文字標籤樣式 */
.toggle-switch .switch-text {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  z-index: 3;
  pointer-events: none;
}

.toggle-switch .switch-text.left {
  left: 0;
  color: white;
}

.toggle-switch .switch-text.right {
  right: 0;
  color: var(--vp-c-text-2);
}

.toggle-switch.coins-mode .switch-text.left {
  color: var(--vp-c-text-2);
}

.toggle-switch.coins-mode .switch-text.right {
  color: white;
}

/* 金幣選擇樣式 */
.coin-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.coin-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.yao-result {
  min-width: 70px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  padding: 0.3rem 0.5rem;
}

.coins-container {
  display: flex;
  gap: 0.4rem;
  padding: 0 3% 0 0;
  flex-wrap: nowrap;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.coin-btn {
  padding: 0.25rem 0.7rem;
  border: 1px solid #27ae60;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 4rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(20, 27, 24, 0.3);
  flex-shrink: 1;
  box-sizing: border-box;
}

.coin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);
}

.coin-btn.tails {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.coin-btn.tails:hover {
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.divination-description {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.yao-selector {
  max-width: 400px;
  margin: 0 auto;
}

.yao-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.yao-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
}

.yao-label {
  font-weight: 500;
  color: var(--vp-c-text-1);
  min-width: 3rem;
  font-size: 0.8rem;
}

.yao-buttons {
  display: flex;
  gap: 0.3rem;
}

.yao-btn {
  padding: 0.25rem 0.7rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 4rem;
}

.yao-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.yang-btn {
  border-color: #f39c12;
  color: #e67e22;
}

.yang-btn:hover {
  border-color: #e67e22;
  background: #fdf2e9;
}

.yang-btn.active {
  background: #f39c12;
  border-color: #f39c12;
  color: white;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.yin-btn {
  border-color: #3498db;
  color: #2980b9;
}

.yin-btn:hover {
  border-color: #2980b9;
  background: #ebf3fd;
}

.yin-btn.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.divination-actions {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.action-btn {
  padding: 0.4rem 1rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  transition: all 0.3s;
  font-size: 0.8rem;
  width: 100%;
}

.clear-btn {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-color: #95a5a6;
}

.clear-btn:hover {
  background: #95a5a6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(149, 165, 166, 0.3);
}

.search-btn {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.search-btn:hover:not(.disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(var(--vp-c-brand-1), 0.3);
}

.search-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.hexagram-result {
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hexagram-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  padding:5% 0 5% 0;
}

.hexagram-details {
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 0.7rem;
  font-size: 0.8rem;
}

.hexagram-details p {
  margin: 0.25rem 0;
}

/* 響應式設計 - 占卜系統 */
@media (max-width: 768px) {
  .divination-container {
    padding: 1rem;
  }
  
  /* 手機版改為單欄 */
  .two-column-layout {
    flex-direction: column;
    gap: 1rem;
  }
  
  .right-column {
    flex: 1;
    min-width: auto;
  }
  
  .hexagram-result-container {
    height: 150px;
  }
  
  .divination-actions {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 48%;
    font-size: 0.7rem;
    padding: 0.3rem 0.5rem;
  }
  
  .bagua-divination {
    padding: 0.8rem;
  }
  
  .divination-title {
    font-size: 1rem;
  }
  
  .yao-row {
    padding: 0.2rem 0.3rem;
  }
  
  .yao-label {
    min-width: 3.2rem;
    font-size: 0.7rem;
  }
  
  .yao-btn {
    max-width: 3.5rem;
    font-size: 0.65rem;
    padding: 0.15rem 0.3rem;
    min-width: 3.5rem;
  }
  
  .coin-btn {
    padding: 0.15rem 0.25rem;
    font-size: 0.6rem;
    min-width: 2.8rem;
    flex: 1;
  }
  
  .coins-container {
    gap: 0.2rem;
    padding: 0;
  }
  
  .yao-result {
    min-width: 3.5rem;
    font-size: 0.65rem;
    padding: 0.1rem 0.2rem;
  }
  
  .toggle-switch {
    width: 160px;
    height: 35px;
    font-size: 0.7rem;
  }
  
  .switch-text {
    font-size: 0.65rem;
    padding: 0.4rem 0.5rem;
  }
  
  .switch-slider {
    width: 75px;
    height: 29px;
  }
  
  .switch-slider.switch-right {
    transform: translateX(82px);
  }
  
  .hexagram-info h4 {
    font-size: 0.9rem;
    padding: 3% 0;
  }
  
  .hexagram-details {
    padding: 0.5rem;
    font-size: 0.7rem;
  }
}

/* 極小螢幕額外優化 */
@media (max-width: 480px) {
  .coin-btn {
    padding: 0.1rem 0.2rem;
    font-size: 0.55rem;
    min-width: 2.2rem;
    border-radius: 4px;
  }
  
  .coins-container {
    gap: 0.15rem;
    justify-content: space-between;
  }
  
  .yao-btn {
    max-width: 3rem;
    font-size: 0.6rem;
    padding: 0.1rem 0.2rem;
    min-width: 3rem;
  }
  
  .yao-result {
    min-width: 3rem;
    font-size: 0.6rem;
    padding: 0.05rem 0.1rem;
  }
  
  .coin-display {
    gap: 0.5rem;
  }

}
</style>


import * as fs from 'fs';
import * as path from 'path';

// 取得指定資料夾下所有 md 檔案（遞迴）
function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

// 生成 sidebar 配置的主函式
export function generateSidebar(docRoot: string) {
  // 依 sidebar-config.json 的 folderTitles 與 folderConfigs 產生 sidebarConfig，並自動補齊新檔案
  const configPath = path.resolve(__dirname, 'sidebar-config.json');
  let config = { folderTitles: {}, folderConfigs: {} };
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  const { folderTitles, folderConfigs } = config;
  let updated = false;
  const sidebar = {};
  if (!fs.existsSync(docRoot)) return sidebar;
  const folders = fs.readdirSync(docRoot).filter(f => fs.statSync(path.join(docRoot, f)).isDirectory());
  for (const folder of folders) {
    const folderPath = path.join(docRoot, folder);
    const mdFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'));
    // 取得顯示名稱並處理群組層級的 collapsed 設定
    let folderTitle = folderTitles[folder] || folder;
    let groupCollapsed: boolean | null = null;
    
    // 檢查 folderTitle 是否有 # 標記
    if (folderTitle.startsWith('#')) {
      const hashMatch = folderTitle.match(/^#+/);
      const hashCount = hashMatch ? hashMatch[0].length : 1;
      
      if (hashCount === 1) {
        groupCollapsed = true;  // 單個 # 設為 collapsed: true
      } else if (hashCount >= 2) {
        groupCollapsed = false; // 兩個或以上 # 設為 collapsed: false
      }
      
      // 移除 # 標記，保留純文字作為標題
      folderTitle = folderTitle.replace(/^#+/, '');
    }
    // 取得該資料夾的顯示對應表
    if (!folderConfigs[`/doc/${folder}`]) folderConfigs[`/doc/${folder}`] = {};
    const fileTitleMap = folderConfigs[`/doc/${folder}`];
    // 自動補齊新檔案
    for (const file of mdFiles) {
      const name = path.basename(file, '.md');
      if (!fileTitleMap[name]) {
        fileTitleMap[name] = name;
        updated = true;
      }
    }
    // 移除已刪除檔案的對應，但保留以 _ 開頭的說明項目
    for (const key of Object.keys(fileTitleMap)) {
      // 忽略以 _ 開頭的說明項目
      if (key.startsWith('_')) continue;
      
      if (!mdFiles.includes(key + '.md')) {
        delete fileTitleMap[key];
        updated = true;
      }
    }
    // 依 sidebar-config.json 的順序排序，未列出的補在後面，忽略說明項目
    const configOrder = Object.keys(fileTitleMap).filter(key => !key.startsWith('_'));
    const actualFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.md')).map(f => path.basename(f, '.md'));
    const ordered = configOrder.filter(f => actualFiles.includes(f));
    const rest = actualFiles.filter(f => !configOrder.includes(f));
    const allOrder = [...ordered, ...rest];
    // 支援 ' 標註階層，遇到 ' 開頭的 key 時，正確包進上一層 items，支援 build差異比對 > Page_7 > Page_8
    let groups: any[] = [];
    // groupStack[0] = 第一層 group 的 items, groupStack[1] = !! 的 items, groupStack[2] = !!! 的 items ...
    let groupStack: any[][] = [];
    let items: any[] = [];
    groupStack[0] = items;
    let stack: any[] = [items];
    for (const name of allOrder) {
      let display = String(fileTitleMap[name] || name);
      let collapsedMark = false;
      
      // 檢查是否為隱藏項目（以 // 開頭）
      if (display.startsWith('//')) {
        continue; // 跳過此項目，不加入側邊欄
      }
      
      // 支援多層 ! 跳脫巢狀、#+ 巢狀，# 數量決定 collapsed 行為
      const exclMark = display.match(/^!+/);
      let exclLevel = exclMark ? exclMark[0].length : 0;
      if (exclLevel > 0) display = display.slice(exclLevel);
      
      let collapsedValue: boolean | null = null; // null = 不設置, true = 摺疊, false = 展開
      if (display.startsWith('#')) {
        // 計算 # 的數量
        const hashMatch = display.match(/^#+/);
        const hashCount = hashMatch ? hashMatch[0].length : 1;
        
        if (hashCount === 1) {
          collapsedValue = true;  // 單個 # 設為 collapsed: true
        } else if (hashCount >= 2) {
          collapsedValue = false; // 兩個或以上 # 設為 collapsed: false
        }
        
        // 移除所有的 # 標記
        display = display.replace(/^#+/, '');
      }
      const nestMatch = display.match(/^'+/);
      const nestLevel = nestMatch ? nestMatch[0].length : 0;
      const cleanText = display.replace(/^'+/, '');
      const item: any = {
        text: cleanText,
        link: `/doc/${folder}/${name}`
      };
      
      // 如果有 collapsed 設定，直接應用到項目上
      if (collapsedValue !== null) {
        item.collapsed = collapsedValue;
      }
      
      // groupStack[exclLevel] 內部也要支援巢狀
      if (!groupStack[exclLevel]) groupStack[exclLevel] = [];
      let localStack = [groupStack[exclLevel]];
      // 保證 localStack 長度
      while (localStack.length < nestLevel + 1) localStack.push([]);
      while (localStack.length > nestLevel + 1) localStack.pop();
      if (nestLevel === 0) {
        localStack = [groupStack[exclLevel]];
        groupStack[exclLevel].push(item);
      } else {
        // 巢狀，包進正確層級的 parent.items
        const parentArr = localStack[nestLevel - 1];
        if (parentArr.length === 0) {
          groupStack[exclLevel].push(item);
          localStack = [groupStack[exclLevel]];
        } else {
          const parent = parentArr[parentArr.length - 1];
          if (!parent.items) parent.items = [];
          parent.items.push(item);
          
          // 根據 collapsedValue 設置 collapsed 屬性
          if (collapsedValue !== null) {
            parent.collapsed = collapsedValue;
          }
          
          localStack = localStack.slice(0, nestLevel);
          localStack.push(parent.items);
        }
      }
    }
    // 組合所有 groupStack
    for (let i = 0; i < groupStack.length; i++) {
      if (groupStack[i] && groupStack[i].length > 0) {
        const group: any = { 
          text: i === 0 ? folderTitle : '', 
          items: groupStack[i] 
        };
        
        // 如果是主群組且有設定 groupCollapsed，則應用到群組上
        if (i === 0 && groupCollapsed !== null) {
          group.collapsed = groupCollapsed;
        }
        
        groups.push(group);
      }
    }
    sidebar[`/doc/${folder}/`] = groups;
  }
  // 若有自動補齊則寫回 config
  if (updated) {
    fs.writeFileSync(configPath, JSON.stringify({ folderTitles, folderConfigs }, null, 2), 'utf-8');
    console.log('sidebar-config.json 已自動補齊新檔案');
  }
  return sidebar;
}

// 清除快取並重新生成 sidebar-config.json
export function clearCacheAndReload() {
  // 這裡可以加入清除快取或重新生成 sidebar-config.json 的邏輯
  // 目前僅重新生成 sidebar-config.json
  const docRoot = path.resolve(__dirname, '../../doc');
  const sidebarConfig = generateSidebar(docRoot);
  const outputPath = path.resolve(__dirname, 'sidebar-config.json');
  fs.writeFileSync(outputPath, JSON.stringify(sidebarConfig, null, 2), 'utf-8');
  console.log('sidebar-config.json 已重新生成');
}

// 直接執行時自動生成 sidebar-config.json（ESM環境下不可用 require.main）
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('sidebar-generator.ts')) {
  clearCacheAndReload();
}
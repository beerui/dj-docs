<template>
  <div class="tenant-page">
    <div class="tenant-switcher">
      <div class="current-tenant">
        <span class="label">当前租户ID:</span>
        <span class="value">{{ tenantId }}</span>
        <span class="separator">|</span>
        <span class="label">主题:</span>
        <span class="value">{{ tenantTheme }}</span>
      </div>
      <div class="switcher-buttons">
        <button @click="siteType = 'default'" :class="['switcher-btn', { active: siteType === 'default' }]">
          <span class="btn-badge">主站 T0001</span>
        </button>
        <button @click="siteType = 'baigou'" :class="['switcher-btn', { active: siteType === 'baigou' }]">
          <span class="btn-badge">白沟T0002</span>
        </button>
        <button @click="siteType = 'english'" :class="['switcher-btn', { active: siteType === 'english' }]">
          <span class="btn-badge">英文站T0001</span>
        </button>
        <button @click="siteType = 'other'" :class="['switcher-btn', { active: siteType === 'other' }]">
          <span class="btn-badge">其它T0003</span>
        </button>
      </div>
    </div>
    <section class="section">
      <h2 class="text-lg font-bold">方式 1: 使用 isTenant() 工具函数（推荐🔥）</h2>
      <ul>
        <li><strong>是默认租户 <code>isTenant('T0001')</code>:</strong> {{ isTenant(TENANT_ID_MAP.default) ? '✅' : '❌' }}
        </li>
        <li><strong>是白沟租户 <code>isTenant('T0002')</code>:</strong> {{ isTenant(TENANT_ID_MAP.baigou) ? '✅' : '❌' }}
        </li>
        <li><strong>是默认或白沟租户 <code>isTenant(['T0001', 'T0002'])</code>:</strong> {{ isTenant([TENANT_ID_MAP.default,
        TENANT_ID_MAP.baigou]) ? '✅' : '❌' }}</li>
      </ul>
    </section>

    <section class="section">
      <h2 class="text-lg font-bold">方式 2: 使用全局注入 $tenantId</h2>
      <ul>
        <li><strong>$tenantId:</strong> {{ tenantId }}</li>
        <li><strong>$tenantTheme:</strong> {{ tenantTheme }}</li>
        <li><strong>$siteType:</strong> {{ siteType }}</li>
        <li><strong>$siteTypeInfo:</strong> {{ JSON.stringify(siteTypeInfo) }}</li>
      </ul>
    </section>

    <section class="section">
      <h2 class="text-lg font-bold">方式 3: 使用 useSiteType() Composable</h2>
      <ul>
        <li><strong>租户ID:</strong> {{ tenantId }}</li>
        <li><strong>租户主题:</strong> {{ tenantTheme }}</li>
        <li><strong>站点类型:</strong> {{ siteType }}</li>
        <li><strong>完整信息:</strong> {{ JSON.stringify(siteTypeInfo) }}</li>
      </ul>
    </section>

    <section class="section">
      <h2 class="text-lg font-bold">条件渲染示例</h2>
      <div class="grid grid-cols-3 gap-2">
        <div v-if="isTenant(TENANT_ID_MAP.default)" class="tenant-card default">
          <h3>🏢 T0001租户 (T0001时展示)</h3>
          <p>欢迎来到T0001站点</p>
        </div>
        <div v-if="isTenant(TENANT_ID_MAP.baigou)" class="tenant-card baigou">
          <h3>🏪 T0002租户 (T0002时展示)</h3>
          <p>欢迎来到T0002站点</p>
        </div>
        <div v-if="isTenant([TENANT_ID_MAP.default, TENANT_ID_MAP.baigou])" class="tenant-card baigou">
          <h3>🏪 T0001或T0002租户 (T0001或T0002时展示)</h3>
          <p>欢迎来到T0001或T0002站点</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const TENANT_ID_MAP: Record<string, string> = {
  'default': 'T0001',
  'english': 'T0001',
  'baigou': 'T0002',
  'other': 'T0003',
}

const THEME_MAP: Record<string, string> = {
  'default': 'default',
  'english': 'english',
  'baigou': 'default',
  'other': 'other',
}

const tenantTheme = ref('default')
const tenantId = ref('T0001')
const siteType = ref('default')
const siteTypeInfo = ref({
  tenantTheme: tenantTheme.value,
  tenantId: tenantId.value,
  siteType: siteType.value,
})

watch(siteType, () => {
  tenantTheme.value = THEME_MAP[siteType.value as keyof typeof THEME_MAP]
  tenantId.value = TENANT_ID_MAP[siteType.value as keyof typeof TENANT_ID_MAP]

  siteTypeInfo.value.tenantTheme = tenantTheme.value
  siteTypeInfo.value.tenantId = tenantId.value
  siteTypeInfo.value.siteType = siteType.value
})
function isTenant(tid: string | Array<string>) {
  if (Array.isArray(tid)) {
    return tid.includes(tenantId.value);
  }

  return tenantId.value === tid;
}

const eg1 = String.raw`<script setup lang="ts">
import { isTenant } from '~/utils/business/nation'
import { TENANT_ID_MAP } from '~/constants/site-type';
<\/script>

<template>
  <section class="p-4 rounded-lg border border-blue-200">
    <p v-if="isTenant(TENANT_ID_MAP.default)">默认租户: {{ isDefaultTenant ? '✅' : '❌' }}</p>
    <p v-if="isTenant(TENANT_ID_MAP.baigou)">白沟租户: {{ isBaigouTenant ? '✅' : '❌' }}</p>
    <p v-if="isTenant([TENANT_ID_MAP.default, TENANT_ID_MAP.baigou])">默认或白沟: {{ isMallTenant ? '✅' : '❌' }}</p>
  </section>
</template>`;

const eg2 = String.raw`<script setup lang="ts">
const { $tenantId, $tenantTheme, $siteType, $siteTypeInfo } = useNuxtApp()
<\/script>

<template>
  <section class="p-4 rounded-lg border border-gray-200">
    <p>租户 ID: {{ $tenantId }}</p>
    <p>租户主题: {{ $tenantTheme }}</p>
    <p>站点类型: {{ $siteType }}</p>
    <p>站点信息: {{ JSON.stringify($siteTypeInfo) }}</p>
  </section>
</template>`;

const eg3 = String.raw`<script setup lang="ts">
const { tenantId, tenantTheme, siteType, siteTypeInfo } = useSiteType()
<\/script>

<template>
  <section class="p-4 rounded-lg border border-emerald-200">
    <p>租户 ID: {{ tenantId }}</p>
    <p>租户主题: {{ tenantTheme }}</p>
    <p>站点类型: {{ siteType }}</p>
    <p>完整信息: {{ JSON.stringify(siteTypeInfo) }}</p>
  </section>
</template>`;
</script>

<style scoped>
.tenant-switcher {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 8px;
  margin-bottom: 8px;
}

.switcher-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.switcher-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.switcher-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.switcher-btn:hover::before {
  left: 100%;
}

.switcher-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.switcher-btn.active {
  background: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: scale(1.05);
}

.btn-icon {
  font-size: 28px;
  line-height: 1;
}

.btn-text {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.btn-badge {
  font-size: 11px;
  background: #667eea;
  color: white;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
}

.switcher-btn.active .btn-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.current-tenant {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  margin-bottom: 8px;
}

.current-tenant .label {
  font-weight: 500;
  opacity: 0.9;
}

.current-tenant .value {
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 6px;
}

.current-tenant .separator {
  opacity: 0.5;
  margin: 0 4px;
}

.section {
  border-radius: 12px;
  padding: 8px 16px;
  margin-bottom: 8px;
  border: 1px solid #e9ecef;
}

.section h2 {
  margin-bottom: 8px;
  font-size: 16px;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 8px;
}

.section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section li {
  padding: 4px 0;
  font-size: 14px;
}

.section li strong {
  min-width: 150px;
  display: inline-block;
}

.tenant-card {
  padding: 8px;
  border-radius: 8px;
  margin-top: 12px;
  border-left: 4px solid;
}

.tenant-card.default {
  background: #e3f2fd;
  border-left-color: #1890ff;
}

.tenant-card.baigou {
  background: #f3e5f5;
  border-left-color: #722ed1;
}

.tenant-card h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
}

.tenant-card p {
  margin: 0;
  color: #495057;
}

/* 根据租户主题应用不同样式 */
:root[site-type="dark"] .tenant-page {
  background: #1f1f1f;
  color: #ffffff;
}

:root[site-type="dark"] .section {
  background: #2c2c2c;
  border-color: #404040;
}
</style>

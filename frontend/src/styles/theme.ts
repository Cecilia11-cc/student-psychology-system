import type { ThemeConfig } from 'antd';

export const customTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif",
    fontSize: 14,
    colorText: '#1a1a2e',
    colorTextSecondary: '#666',
  },
  components: {
    Layout: {
      headerBg: '#0d1b2a',
      siderBg: '#0d1b2a',
      triggerBg: '#0d1b2a',
    },
    Menu: {
      darkItemBg: '#0d1b2a',
      darkItemSelectedBg: '#1677ff',
      darkSubMenuItemBg: '#0d1b2a',
    },
    Card: {
      paddingLG: 20,
    },
  },
};

import type { MenuRecordRaw } from '@mubox-core/typings';

interface MuboxNormalMenuProps {
  /**
   * 菜单数据
   */
  activePath?: string;
  /**
   * 是否折叠
   */
  collapse?: boolean;
  /**
   * 菜单项
   */
  menus?: MenuRecordRaw[];
  /**
   * @zh_CN 是否圆润风格
   * @default true
   */
  rounded?: boolean;
  /**
   * 主题
   */
  theme?: 'dark' | 'light';
}

export type { MuboxNormalMenuProps };

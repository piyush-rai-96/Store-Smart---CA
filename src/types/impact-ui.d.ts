declare module 'impact-ui' {
  import type React from 'react';
  import type { FC, ReactNode, CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

  export type ButtonVariant = 'contained' | 'outlined' | 'text' | 'primary' | 'secondary' | 'url';
  export type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'inherit';
  export type ButtonSize = 'small' | 'medium' | 'large';

  export interface ButtonProps {
    children?: ReactNode;
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    fullWidth?: boolean;
    isLoading?: boolean;
    title?: string;
    'aria-label'?: string;
  }

  export const Button: FC<ButtonProps>;

  export type ChipsVariant = 'filled' | 'outlined' | 'stroke' | 'solid';
  export type ChipsColor = 'primary' | 'secondary' | 'default';

  export interface ChipsProps {
    label: ReactNode;
    variant?: ChipsVariant;
    color?: ChipsColor;
    size?: 'small' | 'medium' | 'large';
    onClick?: (e: ReactMouseEvent) => void;
    className?: string;
    icon?: ReactNode;
    isRemovable?: boolean;
    onDelete?: (e: ReactMouseEvent) => void;
  }

  export const Chips: FC<ChipsProps>;

  export type BadgeColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default';
  export type BadgeSize = 'small' | 'medium' | 'large';

  export interface BadgeProps {
    label: ReactNode;
    color?: BadgeColor;
    size?: BadgeSize;
    variant?: 'default' | 'subtle';
    className?: string;
  }

  export const Badge: FC<BadgeProps>;

  export type CardSize =
    | 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | 'extraLarge-3x';

  export interface CardProps {
    size?: CardSize;
    children?: ReactNode;
    className?: string;
    sx?: Record<string, unknown>;
    onClick?: (e?: ReactMouseEvent) => void;
    style?: CSSProperties;
  }
  export const Card: FC<CardProps>;
  export const Modal: FC<Record<string, unknown>>;
  export const Input: FC<Record<string, unknown>>;
  export const Select: FC<Record<string, unknown>>;
  export const Header: FC<Record<string, unknown>>;
  export const Sidebar: FC<Record<string, unknown>>;
  export const Breadcrumbs: FC<Record<string, unknown>>;

  export interface TabName {
    value: string;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  }

  export interface TabsProps {
    tabNames: TabName[];
    tabPanels?: ReactNode[];
    value: string;
    onChange: (event: React.SyntheticEvent, value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    isDisabled?: boolean;
    isBlueBg?: boolean;
    remountOnTabChange?: boolean;
    tabPanelStyle?: CSSProperties;
    className?: string;
  }

  export const Tabs: FC<TabsProps>;
}

import { useWindowDimensions } from 'react-native';

export interface ResponsiveLayout {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  numColumns: number;
  cardWidth: number;
  horizontalPadding: number;
}

const COLUMN_GAP = 12;
const HORIZONTAL_PADDING_PHONE = 16;
const HORIZONTAL_PADDING_TABLET = 24;

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= 768;

  const horizontalPadding = isTablet ? HORIZONTAL_PADDING_TABLET : HORIZONTAL_PADDING_PHONE;

  let numColumns: number;
  if (width >= 768) {
    numColumns = 3;
  } else if (width >= 480) {
    numColumns = 2;
  } else {
    numColumns = 1;
  }

  const totalGap = COLUMN_GAP * (numColumns - 1);
  const availableWidth = width - horizontalPadding * 2 - totalGap;
  const cardWidth = availableWidth / numColumns;

  return {
    width,
    height,
    isLandscape,
    isTablet,
    numColumns,
    cardWidth,
    horizontalPadding,
  };
}

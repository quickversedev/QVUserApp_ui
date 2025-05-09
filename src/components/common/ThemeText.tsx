import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

type Props = {
  type?: 'h1' | 'h2' | 'subtitle' | 'body' | 'caption';
  color?: keyof BaseColors; // Only allow base color keys
  style?: Object;
  children: React.ReactNode;
};

const ThemedText: React.FC<Props> = ({
  type = 'body',
  color = 'text',
  style,
  children,
}) => {
  const {getColor, getTypography} = useTheme();

  return (
    <Text
      style={[
        styles.text,
        {
          color: getColor(color),
          fontSize: getTypography(type),
          fontFamily: 'System',
          lineHeight: getTypography(type) * 1.4,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    letterSpacing: 0.25,
  },
});

export default ThemedText;

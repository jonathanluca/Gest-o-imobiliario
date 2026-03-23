import styled from 'styled-components/native';
import { theme } from '../../src/theme';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

export const Content = styled.View`
  padding: ${theme.spacing.lg};
`;

export const Header = styled.View`
  margin-bottom: ${theme.spacing.xl};
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${theme.colors.secondary};
`;

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Card = styled.View`
  background-color: ${theme.colors.white};
  width: 31%; /* No Web fica 3 colunas */
  min-width: 250px;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  margin-bottom: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
`;
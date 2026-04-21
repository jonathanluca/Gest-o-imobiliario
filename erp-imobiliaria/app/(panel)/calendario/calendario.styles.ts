import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../../theme';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const SummaryCard = styled.View<{ color: string }>`
  flex: 1;
  min-width: ${Platform.OS === 'web' ? '300px' : '100%'};
  background-color: ${props => props.color};
  padding: 24px;
  border-radius: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CardInfo = styled.View``;

export const CardLabel = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const CardValue = styled.Text`
  color: #ffffff;
  font-size: 36px;
  font-weight: bold;
`;

export const CalendarWrapper = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
  margin-bottom: 50px;
`;

export const CalendarHeader = styled.View`
  background-color: ${theme.colors.primary};
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MonthTitle = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

export const WeekdaysRow = styled.View`
  flex-direction: row;
  background-color: #f8fafc;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const WeekdayCell = styled.View`
  flex: 1;
  padding: 12px;
  align-items: center;
`;

export const WeekdayText = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textLight};
  font-weight: 600;
`;

export const DaysGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const DayCell = styled.View<{ isToday?: boolean; isOtherMonth?: boolean }>`
  width: 14.28%; 
  height: ${Platform.OS === 'web' ? '120px' : '80px'};
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-color: ${theme.colors.border};
  padding: 8px;
  background-color: ${props => props.isToday ? '#eff6ff' : '#ffffff'};
  opacity: ${props => props.isOtherMonth ? 0.4 : 1};
`;

export const DayNumber = styled.Text<{ isToday?: boolean }>`
  font-size: 14px;
  font-weight: ${props => props.isToday ? 'bold' : '500'};
  color: ${props => props.isToday ? theme.colors.primary : theme.colors.text};
`;

export const TodayIndicator = styled.View`
  background-color: ${theme.colors.primary};
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
`;

/* LEGENDA */
export const LegendContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 16px;
  padding: 0 8px;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const LegendBox = styled.View<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${props => props.color};
`;

export const LegendText = styled.Text`
  font-size: 13px;
  color: ${theme.colors.textLight};
`;

/* AJUSTES PARA O MODAL (Reaproveitando lógica de Imóveis) */
export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: ${Platform.OS === 'web' ? '20px' : '0px'};
`;

export const ModalContainer = styled.View`
  background-color: #ffffff;
  width: ${Platform.OS === 'web' ? '500px' : '100%'};
  max-height: 90%;
  border-radius: ${Platform.OS === 'web' ? '12px' : '0px'};
  padding: 24px;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

export const StyledInput = styled.TextInput`
  height: 45px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  background-color: #f9fafb;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;
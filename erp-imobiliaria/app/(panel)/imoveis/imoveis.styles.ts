import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { theme } from '../../../theme';

interface StatusProps {
  color: string;
}

export const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const TitleContainer = styled.View``;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textLight};
`;

export const AddButton = styled.TouchableOpacity`
  background-color: #0f172a;
  padding: 10px 20px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const AddButtonText = styled.Text`
  color: ${theme.colors.white};
  font-weight: 600;
`;

/* Filtros */
export const FilterSection = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.View`
  flex: 1;
  min-width: 250px;
  height: 45px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
`;

export const SelectInput = styled.View`
  width: ${Platform.OS === 'web' ? '200px' : '100%'};
  height: 45px;
  background-color: ${theme.colors.white};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  justify-content: center;
  padding: 0 12px;
`;

/* Grid de Imóveis */
export const PropertyGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 50px;
`;

/* Card de Imóvel */
export const Card = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  overflow: hidden;
  /* Largura dinâmica via prop style no componente */
`;

export const ImageContainer = styled.View`
  height: 180px;
  background-color: #eee;
  position: relative;
`;

export const Badge = styled.View<{ status: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: ${(props: any) => 
    props.status === 'Disponível' ? '#dcfce7' : 
    props.status === 'Vendido' ? '#fee2e2' : '#fef9c3'};
`;

export const BadgeText = styled.Text<{ status: string }>`
  font-size: 11px;
  font-weight: bold;
  color: ${(props: any) => 
    props.status === 'Disponível' ? '#166534' : 
    props.status === 'Vendido' ? '#991b1b' : '#854d0e'};
`;

export const CardContent = styled.View`
  padding: 16px;
`;

export const PropertyType = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: ${theme.colors.textLight};
  text-transform: uppercase;
  margin-bottom: 4px;
`;

export const PropertyTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

export const PropertyAddress = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
  margin-bottom: 12px;
`;

export const SpecsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SpecItem = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textLight};
`;

export const PropertyPrice = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 4px;
`;

export const BrokerText = styled.Text`
  font-size: 11px;
  color: ${theme.colors.textLight};
  margin-bottom: 16px;
`;

/* Ações do Card */
export const ActionRow = styled.View`
  flex-direction: row;
  gap: 8px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

export const ViewButton = styled.TouchableOpacity`
  flex: 1;
  height: 35px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const IconButton = styled.TouchableOpacity<{ color: string }>`
  width: 35px;
  height: 35px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${(props:StatusProps) => props.color};
  align-items: center;
  justify-content: center;
`;

// ... (mantenha os estilos anteriores)



export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

/* Formulário */


export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text};
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

export const SubmitButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

/* Estilos Específicos do "Ver" */
export const ViewImage = styled.Image`
  width: 100%;
  height: 250px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

export const DetailSection = styled.View`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;





export const StyledTextArea = styled.TextInput`
  min-height: 100px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  background-color: #f9fafb;
  text-align-vertical: top;
`;

export const AIButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 6px;
  align-self: flex-start;
  margin-top: 8px;
`;

export const AIButtonText = styled.Text`
  font-size: 13px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

export const ModalFooter = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

export const CancelButton = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

export const SaveButton = styled.TouchableOpacity`
  padding: 10px 24px;
  border-radius: 8px;
  background-color: #0f172a;
`;

export const SelectWrapper = styled.View`
  height: 45px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  border-radius: 8px;
  background-color: #f9fafb;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`;

export const ModalOverlay = styled.View`
  flex: 1; /* ESSENCIAL */
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: ${Platform.OS === 'web' ? '50px' : '0px'};
`;

export const ModalContainer = styled.View`
  background-color: #ffffff;
  width: ${Platform.OS === 'web' ? '550px' : '95%'};
  max-height: 90%; /* Evita que o modal suma se o conteúdo for grande */
  border-radius: 12px;
  padding: 20px;
min-height: 400px; 
  max-height: 90%;
  display: flex;
  
  border-radius: 12px;
  padding: 24px;
`;



export const FormScroll = styled.ScrollView.attrs({
  // Isso garante que o conteúdo interno tenha um respiro no final
  contentContainerStyle: {
    paddingBottom: 20,
    flexGrow: 1, 
  },
})`
  flex: 1; /* Agora ele vai preencher os 650px do container */
  width: 100%;
`;